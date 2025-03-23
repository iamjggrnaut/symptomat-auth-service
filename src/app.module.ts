import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { Patient } from "./patient/entities/patient.entity";
import { Doctor } from "./doctor/entities/doctor.entity";
import { DoctorsModule } from "./doctor/doctor.module";
import { PatientsModule } from "./patient/patient.module";
import { ConfigModule } from "@nestjs/config";
import { HospitalDoctor } from "./hospital-doctor/hospitals-doctors.entity";
import { HospitalPatient } from "./hospital-patient/hospitals-patients.entity";
import { DoctorPatient } from "./doctor-patient/doctors-patients.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Doctor, Patient, HospitalDoctor, HospitalPatient, DoctorPatient],
      synchronize: false, // Включайте только в разработке
    }),
    AuthModule,
    DoctorsModule,
    PatientsModule,
    DoctorsModule,
    PatientsModule,
  ],
})
export class AppModule {}
