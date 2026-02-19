import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750703209939 implements MigrationInterface {
    name = 'Migrations1750703209939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "role" character varying NOT NULL DEFAULT 'user'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "role"
        `);
    }

}