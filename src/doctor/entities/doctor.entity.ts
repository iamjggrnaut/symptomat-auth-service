import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique
} from "typeorm";

@Entity('doctors')
@Unique(['email'])
export class Doctor {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column("jsonb")
  notificationsSettings?: string;

  @Column({ default: "doctor" })
  role: string;

  @Column({type: 'bigint', nullable: true })
  tgChatId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
