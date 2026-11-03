// Migration script: Move data from CockroachDB to Supabase PostgreSQL
// This script reads data from the existing CockroachDB and migrates it
// to the Supabase project. It preserves record IDs where possible.

const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

// CockroachDB connection (current production database)
const cockroachConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};

// Supabase connection (using service role key for admin operations)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Target tables and their CockroachDB counterparts
const TABLES = [
  { supabaseTable: 'image_of_day', cockroachQuery: 'SELECT * FROM image_of_day' },
  { supabaseTable: 'prompts', cockroachQuery: 'SELECT * FROM prompts' },
  { supabaseTable: 'likes', cockroachQuery: 'SELECT * FROM likes' },
  { supabaseTable: 'prompts_shared', cockroachQuery: 'SELECT * FROM prompts_shared' },
];

async function migrateTable(tableInfo) {
  const supabaseTable = tableInfo.supabaseTable;
  const cockroachQuery = tableInfo.cockroachQuery;

  console.log(`\nMigrating table: ${supabaseTable}`);

  // Connect to CockroachDB
  const cockroachPool = new Pool(cockroachConfig);
  const cockroachClient = await cockroachPool.connect();

  try {
    // Execute query on CockroachDB
    const cockroachResult = await cockroachClient.query(cockroachQuery);
    const rows = cockroachResult.rows;

    console.log(`Found ${rows.length} rows in CockroachDB ${supabaseTable}`);

    if (rows.length === 0) {
      console.log(`No data to migrate for ${supabaseTable}`);
      return;
    }

    // Get column names from the first row
    const columns = Object.keys(rows[0]);

    // Insert rows into Supabase
    // We'll use the Supabase REST API via the JavaScript client
    for (const row of rows) {
      // Build the insert object with only the columns that exist in Supabase
      const insertData = {};
      for (const col of columns) {
        // Skip internal CockroachDB columns
        if (col.startsWith('_') || col === 'rowid') continue;
        // Map CockroachDB types to Supabase types
        // UUID -> string, TIMESTAMP -> ISO string, etc.
        insertData[col] = row[col];
      }

      try {
        const { error } = await supabase
          .from(supabaseTable)
          .upsert([insertData]);

        if (error) {
          console.error(`Error migrating row:`, error.message);
        } else {
          console.log(`Migrated row ${row.id || row.slug || row.idx} to ${supabaseTable}`);
        }
      } catch (err) {
        console.error(`Exception migrating row:`, err);
      }
    }
  } catch (err) {
    console.error(`Error querying CockroachDB ${supabaseTable}:`, err);
  } finally {
    await cockroachClient.release();
    await cockroachPool.end();
  }
}

async function main() {
  console.log('Starting PromptHub migration to Supabase...\n');

  // Check environment variables
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable not set');
    process.exit(1);
  }
  if (!process.env.SUPABASE_URL) {
    console.error('ERROR: SUPABASE_URL environment variable not set');
    process.exit(1);
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable not set');
    process.exit(1);
  }

  // Wait a moment for Supabase to initialize
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Migrate each table
  for (const tableInfo of TABLES) {
    await migrateTable(tableInfo);
  }

  console.log('\nMigration complete!');
}

// Run the migration
main().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});