import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hospitals_doctors')
export class HospitalDoctor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    doctorId: string;

    @Column()
    hospitalId: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
}