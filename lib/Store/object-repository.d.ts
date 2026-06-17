declare class ObjectRepository<T> {
  private entityMap: Map<string, T>;
  constructor(entities?: { [id: string]: T });
  findById(id: string): T | undefined;
  findAll(): T[];
  upsertById(id: string, entity: T): Map<string, T>;
  deleteById(id: string): boolean;
  count(): number;
  toJSON(): T[];
}
export { ObjectRepository };