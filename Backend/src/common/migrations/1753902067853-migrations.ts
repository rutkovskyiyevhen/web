import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1753902067853 implements MigrationInterface {
    name = 'Migrations1753902067853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "gpt_response" (
                "id" SERIAL NOT NULL,
                "isCorrect" boolean,
                "correction" character varying,
                "explanation" character varying,
                CONSTRAINT "PK_1844973d1b5a7f8cbb2fb1774df" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "language" (
                "id" SERIAL NOT NULL,
                "learningLang" character varying NOT NULL,
                "userId" integer,
                CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "game_progress"
            ADD "gptAnswerId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "game_progress"
            ADD CONSTRAINT "UQ_7db7e037d7c14f6c62993c20c3d" UNIQUE ("gptAnswerId")
        `);
        await queryRunner.query(`
            ALTER TABLE "statistic"
            ADD "makeASentence" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "nativeLang" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "game_progress"
            ADD CONSTRAINT "FK_7db7e037d7c14f6c62993c20c3d" FOREIGN KEY ("gptAnswerId") REFERENCES "gpt_response"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "language"
            ADD CONSTRAINT "FK_69eb92e6b51565cf9a3d28f614b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "language" DROP CONSTRAINT "FK_69eb92e6b51565cf9a3d28f614b"
        `);
        await queryRunner.query(`
            ALTER TABLE "game_progress" DROP CONSTRAINT "FK_7db7e037d7c14f6c62993c20c3d"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "nativeLang"
        `);
        await queryRunner.query(`
            ALTER TABLE "statistic" DROP COLUMN "makeASentence"
        `);
        await queryRunner.query(`
            ALTER TABLE "game_progress" DROP CONSTRAINT "UQ_7db7e037d7c14f6c62993c20c3d"
        `);
        await queryRunner.query(`
            ALTER TABLE "game_progress" DROP COLUMN "gptAnswerId"
        `);
        await queryRunner.query(`
            DROP TABLE "language"
        `);
        await queryRunner.query(`
            DROP TABLE "gpt_response"
        `);
    }

}