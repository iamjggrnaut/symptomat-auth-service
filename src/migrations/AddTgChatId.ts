// src/migrations/XXXXXXXXXXXXXX-AddTgChatId.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTgChatIdXXXXXXXXXXXXXX1743064176879 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем колонку для пациентов
    await queryRunner.query(`
      ALTER TABLE patients 
      ADD COLUMN "tgChatId" BIGINT,
      ADD CONSTRAINT UQ_patients_tgChatId UNIQUE ("tgChatId");
    `);
    
    // Добавляем колонку для врачей
    await queryRunner.query(`
      ALTER TABLE doctors 
      ADD COLUMN "tgChatId" BIGINT,
      ADD CONSTRAINT UQ_doctors_tgChatId UNIQUE ("tgChatId");
    `);
    
    // Добавляем колонку для уведомлений пациентов
    await queryRunner.query(`
      ALTER TABLE patient_notifications 
      ADD COLUMN "tgChatId" BIGINT;
    `);
    
    // Добавляем колонку для уведомлений врачей
    await queryRunner.query(`
      ALTER TABLE doctor_notifications 
      ADD COLUMN "tgChatId" BIGINT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем колонки в обратном порядке
    await queryRunner.query(`ALTER TABLE doctor_notifications DROP COLUMN "tgChatId";`);
    await queryRunner.query(`ALTER TABLE patient_notifications DROP COLUMN "tgChatId";`);
    await queryRunner.query(`ALTER TABLE doctors DROP CONSTRAINT UQ_doctors_tgChatId;`);
    await queryRunner.query(`ALTER TABLE doctors DROP COLUMN "tgChatId";`);
    await queryRunner.query(`ALTER TABLE patients DROP CONSTRAINT UQ_patients_tgChatId;`);
    await queryRunner.query(`ALTER TABLE patients DROP COLUMN "tgChatId";`);
  }
}