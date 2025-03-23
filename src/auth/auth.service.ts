import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';
import { DoctorsService } from '../doctor/doctor.service';
import { PatientsService } from '../patient/patient.service';
import { Doctor } from '../doctor/entities/doctor.entity';
import { Patient } from '../patient/entities/patient.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly doctorsService: DoctorsService,
        private readonly patientsService: PatientsService,
    ) {}

    async validateDoctor(payload: TokenPayload): Promise<Doctor> {
        const doctor = await this.doctorsService.findById(payload.userId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        return doctor;
    }

    async validatePatient(payload: TokenPayload): Promise<Patient> {
        const patient = await this.patientsService.findById(payload.userId);
        if (!patient) {
            throw new Error('Patient not found');
        }
        return patient;
    }

    async generateDoctorTokens(doctor: Doctor) {
        const payload = { userId: doctor.id, email: doctor.email, role: 'doctor' };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN,
        });
        return { accessToken, refreshToken };
    }

    async generatePatientTokens(patient: Patient) {
        const payload = { userId: patient.id, email: patient.email, role: 'patient' };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN,
        });
        return { accessToken, refreshToken };
    }
}