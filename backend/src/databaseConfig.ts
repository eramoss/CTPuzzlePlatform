import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConfig = {
    synchronize: process.env.DATABASE_SYNCHRONIZE as unknown as boolean,
    database: process.env.DATABASE_NAME,
    type: "postgres",
    entities: [
        "dist/**/*.entity{.ts,.js}"
    ],
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT as unknown as number,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
} as TypeOrmModuleOptions

console.log(databaseConfig)