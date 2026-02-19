import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1767098194974 implements MigrationInterface {
    name = 'Migrations1767098194974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "googleId" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_470355432cc67b2c470c30bef7c" UNIQUE ("googleId")
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "password" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "password"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_470355432cc67b2c470c30bef7c"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "googleId"
        `);
    }

}