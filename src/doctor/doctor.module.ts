import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Doctor } from "./entities/doctor.entity";
import { DoctorsController } from "./doctor.controller";
import { DoctorsService } from "./doctor.service";
import { JwtModule } from "@nestjs/jwt";
import { HospitalDoctor } from "../hospital-doctor/hospitals-doctors.entity";
import { Patient } from "../patient/entities/patient.entity";
import { HospitalPatient } from "../hospital-patient/hospitals-patients.entity";
import { DoctorPatient } from "../doctor-patient/doctors-patients.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doctor,
      HospitalDoctor,
      Patient,
      HospitalPatient,
      DoctorPatient,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRES_IN },
    }),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
