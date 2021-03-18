import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDefaultSysadmin1616027119563 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`insert into research_group (name) values ('sysadmin_group')`)
        queryRunner.query(`insert into "user" (name, roles, "researchGroupId", password, email) values ('SysAdmin', '["sysadmin"]', (select id from research_group where name = 'sysadmin_group'), 'sysadmin', 'sysadmin@mail.com')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
