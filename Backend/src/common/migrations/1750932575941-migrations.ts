import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750932575941 implements MigrationInterface {
    name = 'Migrations1750932575941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "game"
            ALTER COLUMN "direction"
            SET DEFAULT 'word-translation'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "game"
            ALTER COLUMN "direction"
            SET DEFAULT 'en-ua'
        `);
    }

}