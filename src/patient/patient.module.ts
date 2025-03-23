import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "./entities/patient.entity";
import { PatientsController } from "./patient.controller";
import { PatientsService } from "./patient.service";
import { JwtModule } from "@nestjs/jwt";
import { HospitalPatient } from "../hospital-patient/hospitals-patients.entity";
import { DoctorPatient } from "../doctor-patient/doctors-patients.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, HospitalPatient, DoctorPatient]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRES_IN },
    }),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
