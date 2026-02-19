import dataSource from './data-source';

async function migrate() {
  try {
    await dataSource.initialize();
    await dataSource.runMigrations();
    console.log('✅ Migrations complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed', err);
    process.exit(1);
  }
}

migrate();
