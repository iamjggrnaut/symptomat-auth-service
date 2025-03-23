import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('doctors_patients')
export class DoctorPatient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    patientId: string;

    @Column()
    doctorId: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
}