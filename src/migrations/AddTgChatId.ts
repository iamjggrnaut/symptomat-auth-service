import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTgChatId implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE patients 
      ADD COLUMN IF NOT EXISTS "tgChatId" BIGINT UNIQUE;
    `);
    
    await queryRunner.query(`
      ALTER TABLE doctors 
      ADD COLUMN IF NOT EXISTS "tgChatId" BIGINT UNIQUE;
    `);
    
    await queryRunner.query(`
      ALTER TABLE patient_notifications 
      ADD COLUMN IF NOT EXISTS "tgChatId" BIGINT;
    `);
    
    await queryRunner.query(`
      ALTER TABLE doctor_notifications 
      ADD COLUMN IF NOT EXISTS "tgChatId" BIGINT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE patients DROP COLUMN IF EXISTS "tgChatId";`);
    await queryRunner.query(`ALTER TABLE doctors DROP COLUMN IF EXISTS "tgChatId";`);
    await queryRunner.query(`ALTER TABLE admins DROP COLUMN IF EXISTS "tgChatId";`);
    await queryRunner.query(`ALTER TABLE patient_notifications DROP COLUMN IF EXISTS "tgChatId";`);
    await queryRunner.query(`ALTER TABLE doctor_notifications DROP COLUMN IF EXISTS "tgChatId";`);
  }
}