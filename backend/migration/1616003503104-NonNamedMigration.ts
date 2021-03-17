import {MigrationInterface, QueryRunner} from "typeorm";

export class NonNamedMigration1616003503104 implements MigrationInterface {
    name = 'NonNamedMigration1616003503104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."confirmationCode" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "confirmationCode" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "participation"."startedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "participation" ALTER COLUMN "startedAt" SET DEFAULT '"2021-03-17T17:51:43.218Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participation" ALTER COLUMN "startedAt" SET DEFAULT '2021-03-17 17:50:42.018'`);
        await queryRunner.query(`COMMENT ON COLUMN "participation"."startedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "confirmationCode" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."confirmationCode" IS NULL`);
    }

}
