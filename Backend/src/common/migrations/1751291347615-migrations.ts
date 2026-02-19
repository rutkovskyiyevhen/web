import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1751291347615 implements MigrationInterface {
    name = 'Migrations1751291347615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "game"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "game" DROP COLUMN "created_at"
        `);
    }

}