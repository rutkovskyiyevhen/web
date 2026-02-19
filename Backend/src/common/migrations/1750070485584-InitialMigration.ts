import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1750070485584 implements MigrationInterface {
    name = 'InitialMigration1750070485584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "direction" character varying NOT NULL DEFAULT 'en-ua', "userId" integer, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);        await queryRunner.query(`CREATE TABLE "support" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_54c6021e6f6912eaaee36b3045d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reset" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "resetToken" character varying, CONSTRAINT "PK_5d04f4fd10772663543c6ccc512" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "resetId" integer, CONSTRAINT "REL_b394604436add75fa2f2665098" UNIQUE ("resetId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "word" ("id" SERIAL NOT NULL, "word" character varying NOT NULL, "translation" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'not_learned', "userId" integer, CONSTRAINT "PK_ad026d65e30f80b7056ca31f666" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_a8106c0a84d70ecfc3358301c54" FOREIGN 
KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support" ADD CONSTRAINT "FK_0768a9a514d90be0f9d00fd8036" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_b394604436add75fa2f26650983" FOREIGN 
KEY ("resetId") REFERENCES "reset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "word" ADD CONSTRAINT "FK_4d9fb2abff81f0e34ae02be3178" FOREIGN 
KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "word" DROP CONSTRAINT "FK_4d9fb2abff81f0e34ae02be3178"`);     
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b394604436add75fa2f26650983"`);     
        await queryRunner.query(`ALTER TABLE "support" DROP CONSTRAINT "FK_0768a9a514d90be0f9d00fd8036"`);  
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_a8106c0a84d70ecfc3358301c54"`);     
        await queryRunner.query(`DROP TABLE "word"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "reset"`);
        await queryRunner.query(`DROP TABLE "support"`);
        await queryRunner.query(`DROP TABLE "game"`);
    }

}