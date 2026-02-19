import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1754905884411 implements MigrationInterface {
    name = 'Migrations1754905884411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "statistic" DROP COLUMN "qtyNotLearnedWord"
        `);
        await queryRunner.query(`
            ALTER TABLE "statistic" DROP COLUMN "qtyLearnedWord"
        `);
        await queryRunner.query(`
            ALTER TABLE "statistic" DROP COLUMN "qtyInProgress"
        `);
        await queryRunner.query(`
            ALTER TABLE "language"
            ADD "priority" integer NOT NULL DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "language"
            ADD "qtyNotLearnedWord" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "language"
            ADD "qtyLearnedWord" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "language"
            ADD "qtyInProgress" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "word"
            ADD "dictionaryId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "word"
            ADD CONSTRAINT "FK_18fab232a8dc44425fea1afdbbf" FOREIGN KEY ("dictionaryId") REFERENCES "language"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "word" DROP CONSTRAINT "FK_18fab232a8dc44425fea1afdbbf"
        `);
        await queryRunner.query(`
            ALTER TABLE "word" DROP COLUMN "dictionaryId"
        `);
        await queryRunner.query(`
            ALTER TABLE "language" DROP COLUMN "qtyInProgress"
        `);
        await queryRunner.query(`
            ALTER TABLE "language" DROP COLUMN "qtyLearnedWord"
        `);
        await queryRunner.query(`
            ALTER TABLE "language" DROP COLUMN "qtyNotLearnedWord"
        `);
        await queryRunner.query(`
            ALTER TABLE "language" DROP COLUMN "priority"
        `);
        await queryRunner.query(`
            ALTER TABLE "statistic"
            ADD "qtyInProgress" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "statistic"
            ADD "qtyLearnedWord" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "statistic"
            ADD "qtyNotLearnedWord" integer NOT NULL DEFAULT '0'
        `);
    }

}