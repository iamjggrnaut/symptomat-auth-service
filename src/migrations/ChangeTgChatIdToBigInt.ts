import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTgChatIdToBigInt1700000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE doctors 
            ALTER COLUMN "tgChatId" TYPE bigint;
        `);

        await queryRunner.query(`
            ALTER TABLE patients 
            ALTER COLUMN "tgChatId" TYPE bigint;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE doctors 
            ALTER COLUMN "tgChatId" TYPE integer;
        `);
       
        await queryRunner.query(`
            ALTER TABLE patients 
            ALTER COLUMN "tgChatId" TYPE integer;
        `);
    }
}