import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1751637973850 implements MigrationInterface {
    name = 'Migrations1751637973850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "statistic" (
                "id" SERIAL NOT NULL,
                "qtyNotLearnedWord" integer NOT NULL DEFAULT '0',
                "qtyLearnedWord" integer NOT NULL DEFAULT '0',
                "qtyInProgress" integer NOT NULL DEFAULT '0',
                "matching_word" integer NOT NULL DEFAULT '0',
                "translate_it" integer NOT NULL DEFAULT '0',
                "wordByMeaning" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_e3e6fd496e1988019d8a46749ae" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "statisticId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_e84d274dee481b3ef43ebc6d7a0" UNIQUE ("statisticId")
        `);
        await queryRunner.query(`
            ALTER TABLE "word"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_e84d274dee481b3ef43ebc6d7a0" FOREIGN KEY ("statisticId") REFERENCES "statistic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_e84d274dee481b3ef43ebc6d7a0"
        `);
        await queryRunner.query(`
            ALTER TABLE "word" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_e84d274dee481b3ef43ebc6d7a0"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "statisticId"
        `);
        await queryRunner.query(`
            DROP TABLE "statistic"
        `);
    }

}