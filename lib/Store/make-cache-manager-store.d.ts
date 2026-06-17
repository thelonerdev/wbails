import { Store } from 'cache-manager';
import { proto as WAProto } from '../../WAProto';

interface AuthState {
  clearState: () => Promise<void>;
  saveCreds: () => Promise<void>;
  state: {
    creds: any;
    keys: {
      get: (type: string, ids: string[]) => Promise<{ [id: string]: any }>;
      set: (data: { [category: string]: { [id: string]: any } }) => Promise<void>;
    };
  };
}

declare function makeCacheManagerAuthState(store: Store, sessionKey: string): Promise<AuthState>;

export default makeCacheManagerAuthState;
export { makeCacheManagerAuthState };
