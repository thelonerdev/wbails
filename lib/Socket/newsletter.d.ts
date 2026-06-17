import { NewsletterMetadata, NewsletterReactionMode, NewsletterState, NewsletterViewRole, NewsletterCreateResponse, WAMessage } from '../Types/index.js';
import { BinaryNode } from '../WABinary/index.js';
import { GroupMetadata } from './groups.js';

export declare const makeNewsletterSocket: (config: any) => {
    subscribeNewsletterUpdates: (jid: string) => Promise<{
        duration: string;
    }>;
    newsletterReactionMode: (jid: string, mode: NewsletterReactionMode) => Promise<void>;
    newsletterUpdateDescription: (jid: string, description?: string) => Promise<void>;
    newsletterUpdateName: (jid: string, name: string) => Promise<void>;
    newsletterUpdatePicture: (jid: string, content: Buffer | Uint8Array | string) => Promise<void>;
    newsletterRemovePicture: (jid: string) => Promise<void>;
    newsletterUnfollow: (jid: string) => Promise<void>;
    newsletterFollow: (jid: string) => Promise<void>;
    newsletterUnmute: (jid: string) => Promise<void>;
    newsletterMute: (jid: string) => Promise<void>;
    newsletterCreate: (
        name: string, 
        description?: string, 
        picture?: Buffer | Uint8Array | string
    ) => Promise<NewsletterCreateResponse>;
    newsletterMetadata: (
        type: 'invite' | 'jid', 
        key: string, 
        role?: NewsletterViewRole
    ) => Promise<NewsletterMetadata>;
    newsletterAdminCount: (jid: string) => Promise<number>;
    /** user is Lid, not Jid */
    newsletterChangeOwner: (jid: string, user: string) => Promise<void>;
    /** user is Lid, not Jid */
    newsletterDemote: (jid: string, user: string) => Promise<void>;
    newsletterDelete: (jid: string) => Promise<void>;
    /** if code wasn't passed, the reaction will be removed (if is reacted) */
    newsletterReactMessage: (jid: string, server_id: string, code?: string) => Promise<void>;
    newsletterFetchMessages: (
        type: 'invite' | 'jid', 
        key: string, 
        count: number, 
        after?: number
    ) => Promise<NewsletterMessage[]>;
    newsletterFetchUpdates: (
        jid: string, 
        count: number, 
        after?: number, 
        since?: number
    ) => Promise<NewsletterUpdate[]>;
};

export declare const extractNewsletterMetadata: (
    node: BinaryNode, 
    isCreate?: boolean
) => NewsletterMetadata;

export interface NewsletterMessage {
    server_id: string;
    views: number;
    reactions: {
        count: number;
        code: string;
    }[];
    message?: WAMessage;
}

export interface NewsletterUpdate {
    server_id: string;
    views: number;
    reactions: {
        count: number;
        code: string;
    }[];
}

export interface NewsletterMetadata {
    id: string;
    state: NewsletterState;
    creation_time: number;
    name: string;
    nameTime: number;
    description: string;
    descriptionTime: number;
    invite: string;
    handle: string;
    picture: string | null;
    preview: string | null;
    reaction_codes: NewsletterReactionMode;
    subscribers: number;
    verification: 'VERIFIED' | 'UNVERIFIED';
    viewer_metadata: NewsletterViewerMetadata;
}

export interface NewsletterViewerMetadata {
    mute: 'ON' | 'OFF';
    role: NewsletterViewRole;
}

export interface NewsletterCreateResponse extends NewsletterMetadata {}

export type NewsletterState = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
export type NewsletterViewRole = 'SUBSCRIBER' | 'GUEST' | 'ADMIN' | 'OWNER';
export type NewsletterReactionMode = 'ALL' | 'BASIC' | 'NONE' | 'BLOCKLIST';