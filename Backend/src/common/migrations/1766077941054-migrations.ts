import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1766077941054 implements MigrationInterface {
    name = 'Migrations1766077941054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "userName" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "userName"
        `);
    }

}