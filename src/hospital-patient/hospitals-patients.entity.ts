import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hospitals_patients')
export class HospitalPatient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    patientId: string;

    @Column()
    hospitalId: string;
   
    @Column()
    medicalCardNumber: string;
   
    @Column()
    firstName: string;
   
    @Column()
    lastName: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
}