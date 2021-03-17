import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// https://orkhan.gitbook.io/typeorm/docs/migrations
// npx typeorm migration:create -n MigrationName
// npx typeorm migration:generate --config ormconfig.json -n MigrationName
// npx typeorm migration:run
// npx typeorm migration:revert

export const databaseConfig = {
    synchronize: false,
    database: process.env.TYPEORM_DATABASE,
    type: "postgres",
    entities: [
        "dist/**/*.entity{.ts,.js}"
    ],
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT as unknown as number,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    logging: process.env.TYPEORM_LOGGING,

    // Automaticaly run migrations
    migrationsRun: true,
    
    migrationsTableName: "custom_migration_table",
    migrations: ["dist/migration/*.js"],
    cli: {
        migrationsDir: "migration"
    }
} as TypeOrmModuleOptions

console.log(databaseConfig)