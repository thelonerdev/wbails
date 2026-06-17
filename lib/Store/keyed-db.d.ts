declare class KeyedDB<T> {
  private _compare: (a: string, b: string) => number;
  private _idGetter: (item: T) => string;
  private _array: T[];
  private _dict: { [id: string]: T };
  constructor(compareFn: (a: string, b: string) => number, idGetter: (item: T) => string);
  get length(): number;
  get(id: string): T | undefined;
  insert(entry: T, mode?: 'insert'): boolean;
  insertIfAbsent(...entries: T[]): T[];
  upsert(...entries: T[]): T[];
  update(id: string, updater: (item: T) => void): boolean;
  updateAssign(id: string, update: Partial<T>): boolean;
  deleteById(id: string): boolean;
  clear(): void;
  all(): T[];
  filter(predicate: (item: T) => boolean): void;
  count(): number;
  toJSON(): T[];
  fromJSON(array: T[]): void;
}
export default KeyedDB;
