import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1755433062974 implements MigrationInterface {
    name = 'Migrations1755433062974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "word" DROP CONSTRAINT "FK_4d9fb2abff81f0e34ae02be3178"
        `);
        await queryRunner.query(`
            ALTER TABLE "word" DROP COLUMN "userId"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "word"
            ADD "userId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "word"
            ADD CONSTRAINT "FK_4d9fb2abff81f0e34ae02be3178" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}