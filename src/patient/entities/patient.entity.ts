import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity("patients")
@Unique(['email'])
export class Patient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: "varchar", length: 255 })
  fcmToken?: string;

  @Column({ nullable: true })
  isFirstSignUp?: boolean;

  @Column({nullable: true})
  lastAuthProvider: string;

  @Column({nullable: true})
  language: string;

  @Column( { nullable: true})
  notificationsSettings?: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  tgChatId?: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
