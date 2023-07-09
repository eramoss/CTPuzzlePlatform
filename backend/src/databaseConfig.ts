import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// https://orkhan.gitbook.io/typeorm/docs/migrations
// npx typeorm migration:create -n MigrationName
// npx typeorm migration:generate --config ormconfig.json -n MigrationName
// npx typeorm migration:run
// npx typeorm migration:revert

function bool(any: string) {
  let result = true;
  if (any == 'false') {
    result = false;
  }
  if (!any) {
    result = false;
  }
  console.log(`Converting to boolean ${any}: `, result);
  return result;
}

export const databaseConfig = {
  database: process.env.TYPEORM_DATABASE,
  type: 'postgres',
  entities: ['dist/**/*.entity{.ts,.js}'],
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT as unknown as number,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  logging: bool(process.env.TYPEORM_LOGGING),
  synchronize: bool(process.env.TYPEORM_SYNCHRONIZE),
  // Automaticaly run migrations
  migrationsRun: bool(process.env.TYPEORM_MIGRATIONS_RUN),
  migrationsTableName: 'custom_migration_table',
  migrations: ['dist/migration/*.js'],
  cli: {
    migrationsDir: 'migration',
  },
} as TypeOrmModuleOptions;

console.log(databaseConfig);
