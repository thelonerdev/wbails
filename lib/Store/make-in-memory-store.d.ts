import { proto as WAProto } from '../../WAProto';
import { LabelAssociationType } from '../Types/LabelAssociation';

interface StoreConfig {
  socket: any;
  chatKey?: any;
  labelAssociationKey?: any;
  logger?: any;
}

interface Store {
  chats: any;
  contacts: any;
  messages: any;
  groupMetadata: any;
  state: any;
  presences: any;
  labels: any;
  labelAssociations: any;
  bind: (ev: any) => void;
  loadMessages: (jid: string, count: number, cursor: any) => Promise<any[]>;
  getLabels: () => any[];
  getChatLabels: (chatId: string) => any[];
  getMessageLabels: (messageId: string) => any[];
  loadMessage: (jid: string, id: string) => Promise<any>;
  mostRecentMessage: (jid: string) => Promise<any>;
  fetchImageUrl: (jid: string, sock: any) => Promise<string | undefined>;
  fetchGroupMetadata: (jid: string, sock: any) => Promise<any>;
  fetchMessageReceipts: (opts: { remoteJid: string; id: string }) => Promise<any[] | undefined>;
  toJSON: () => any;
  fromJSON: (json: any) => void;
  writeToFile: (path: string) => void;
  readFromFile: (path: string) => void;
}

declare function makeStore(config: StoreConfig): Store;

export default makeStore;
export { makeStore, waChatKey, waMessageID, waLabelAssociationKey };
