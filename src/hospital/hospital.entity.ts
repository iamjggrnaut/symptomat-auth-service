import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('hospitals')
export class Hospital {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    patientsLimit: number;
}