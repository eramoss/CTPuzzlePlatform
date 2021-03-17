import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDefaultResearchGroup1616003651450 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`insert into research_group(name) values ('Grupo LITE')`);
        queryRunner.query(`update "user" set "researchGroupId" = (select max(id) from research_group)`);
        queryRunner.query(`update mechanic set "researchGroupId" = (select max(id) from research_group)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
