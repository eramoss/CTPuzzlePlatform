import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateResearchGroupIntoTests1616018616896 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`update test set "researchGroupId" = (select id from research_group where name like '%LITE%')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
