import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750662730707 implements MigrationInterface {
    name = 'Migrations1750662730707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "game"
            ADD "gameName" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "game" DROP COLUMN "gameName"
        `);
    }

}