import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1752158239481 implements MigrationInterface {
    name = 'Migrations1752158239481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "game_progress" (
                "id" SERIAL NOT NULL,
                "userAnswer" character varying,
                "gameId" integer,
                "wordId" integer,
                CONSTRAINT "PK_de6c047e1eb7ceca5ae545a2b28" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "game_progress"
            ADD CONSTRAINT "FK_282fc303f2caecf74f7af9d802e" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "game_progress"
            ADD CONSTRAINT "FK_d64fc395a1d1c625ded646a4f55" FOREIGN KEY ("wordId") REFERENCES "word"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "game_progress" DROP CONSTRAINT "FK_d64fc395a1d1c625ded646a4f55"
        `);
        await queryRunner.query(`
            ALTER TABLE "game_progress" DROP CONSTRAINT "FK_282fc303f2caecf74f7af9d802e"
        `);
        await queryRunner.query(`
            DROP TABLE "game_progress"
        `);
    }

}