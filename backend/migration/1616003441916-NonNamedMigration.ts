import {MigrationInterface, QueryRunner} from "typeorm";

export class NonNamedMigration1616003441916 implements MigrationInterface {
    name = 'NonNamedMigration1616003441916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "research_group" DROP COLUMN "institution"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."confirmationCode" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "confirmationCode" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "participation"."startedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "participation" ALTER COLUMN "startedAt" SET DEFAULT '"2021-03-17T17:50:42.018Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participation" ALTER COLUMN "startedAt" SET DEFAULT '2021-03-17 17:03:19.031'`);
        await queryRunner.query(`COMMENT ON COLUMN "participation"."startedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "confirmationCode" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."confirmationCode" IS NULL`);
        await queryRunner.query(`ALTER TABLE "research_group" ADD "institution" character varying`);
    }

}
