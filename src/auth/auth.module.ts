import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { Doctor } from "../doctor/entities/doctor.entity";
import { Patient } from "../patient/entities/patient.entity";
import { PatientsService } from "../patient/patient.service";
import { DoctorsModule } from "../doctor/doctor.module";
import { HospitalPatient } from "../hospital-patient/hospitals-patients.entity";
import { DoctorPatient } from "../doctor-patient/doctors-patients.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Patient, HospitalPatient, DoctorPatient]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRES_IN },
    }),
    DoctorsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PatientsService],
})
export class AuthModule {}
