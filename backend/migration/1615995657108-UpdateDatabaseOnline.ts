import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateDatabaseOnline1615995657108 implements MigrationInterface {
    name = 'UpdateDatabaseOnline1615995657108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "research_group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_a74936ab840b0bfe3262b8ebbee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "response" ("id" SERIAL NOT NULL, "testItemId" integer, "participationId" integer, CONSTRAINT "PK_f64544baf2b4dc48ba623ce768f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roles" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "researchGroupId" integer`);
        await queryRunner.query(`ALTER TABLE "mechanic" ADD "researchGroupId" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."confirmationCode" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "confirmationCode" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "participation"."startedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "participation" ALTER COLUMN "startedAt" SET DEFAULT '"2021-03-17T15:40:57.225Z"'`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_1bf1525212d41502e287730a708" FOREIGN KEY ("researchGroupId") REFERENCES "research_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mechanic" ADD CONSTRAINT "FK_0fc0ccb29ff619a262dde7ad58a" FOREIGN KEY ("researchGroupId") REFERENCES "research_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "response" ADD CONSTRAINT "FK_13970e58bd6a38d1d7cf91fa202" FOREIGN KEY ("testItemId") REFERENCES "test_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "response" ADD CONSTRAINT "FK_ae7e5250b162f5686c03c202729" FOREIGN KEY ("participationId") REFERENCES "participation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "response" DROP CONSTRAINT "FK_ae7e5250b162f5686c03c202729"`);
        await queryRunner.query(`ALTER TABLE "response" DROP CONSTRAINT "FK_13970e58bd6a38d1d7cf91fa202"`);
        await queryRunner.query(`ALTER TABLE "mechanic" DROP CONSTRAINT "FK_0fc0ccb29ff619a262dde7ad58a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1bf1525212d41502e287730a708"`);
        await queryRunner.query(`ALTER TABLE "participation" ALTER COLUMN "startedAt" SET DEFAULT '2021-03-16 23:53:35.662'`);
        await queryRunner.query(`COMMENT ON COLUMN "participation"."startedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "confirmationCode" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."confirmationCode" IS NULL`);
        await queryRunner.query(`ALTER TABLE "mechanic" DROP COLUMN "researchGroupId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "researchGroupId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
        await queryRunner.query(`DROP TABLE "response"`);
        await queryRunner.query(`DROP TABLE "research_group"`);
    }

}
