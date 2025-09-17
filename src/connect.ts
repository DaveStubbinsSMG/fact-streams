import { MongoClient, Db } from 'mongodb';

import { createFactStore } from './factStore';
import type { ConnectOptions, CreateFactStoreOptions, FactStreamsDatabase } from './types';

/**
 * A shared helper to build the FactStreamsDatabase object.
 * It now correctly takes the client to handle the close() method.
 */
const createFactStreamsDatabase = (client: MongoClient, db: Db): FactStreamsDatabase => ({
  createFactStore: (options: CreateFactStoreOptions) => createFactStore(db, options),
  mongoDatabase: db,
  close: () => client.close(),
});

/**
 * Creates a new database connection and returns a FactStreamsDatabase instance.
 */
export async function connect(options: ConnectOptions): Promise<FactStreamsDatabase> {
  const client = new MongoClient(options.uri);
  await client.connect();
  const mongoDatabase = client.db(options.dbName);
  return createFactStreamsDatabase(client, mongoDatabase);
}

/**
 * Initialises fact-streams from an existing, connected MongoClient instance.
 */
export const initializeFromClient = (client: MongoClient, dbName: string): FactStreamsDatabase => {
  const mongoDatabase = client.db(dbName);
  return createFactStreamsDatabase(client, mongoDatabase);
};