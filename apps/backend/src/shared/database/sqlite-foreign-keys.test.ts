import { describe, expect, it, vi } from 'vitest';
import {
  enableSqliteForeignKeys,
  SQLITE_ENABLE_FOREIGN_KEYS,
} from './sqlite-foreign-keys.js';

describe('enableSqliteForeignKeys', () => {
  it('enables SQLite foreign key enforcement for a connection', async () => {
    const db = {
      $executeRawUnsafe: vi.fn().mockResolvedValue(undefined),
    };

    await enableSqliteForeignKeys(db);

    expect(db.$executeRawUnsafe).toHaveBeenCalledWith(SQLITE_ENABLE_FOREIGN_KEYS);
  });
});
