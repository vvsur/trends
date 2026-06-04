export interface RawSqlExecutor {
  $executeRawUnsafe(sql: string): Promise<unknown>;
}

export const SQLITE_ENABLE_FOREIGN_KEYS = 'PRAGMA foreign_keys = ON';

export async function enableSqliteForeignKeys(db: RawSqlExecutor): Promise<void> {
  await db.$executeRawUnsafe(SQLITE_ENABLE_FOREIGN_KEYS);
}
