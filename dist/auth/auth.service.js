"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const doctor_service_1 = require("../doctor/doctor.service");
const patient_service_1 = require("../patient/patient.service");
let AuthService = class AuthService {
    constructor(jwtService, doctorsService, patientsService) {
        this.jwtService = jwtService;
        this.doctorsService = doctorsService;
        this.patientsService = patientsService;
    }
    async validateDoctor(payload) {
        const doctor = await this.doctorsService.findById(payload.userId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        return doctor;
    }
    async validatePatient(payload) {
        const patient = await this.patientsService.findById(payload.userId);
        if (!patient) {
            throw new Error('Patient not found');
        }
        return patient;
    }
    async generateDoctorTokens(doctor) {
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
    async generatePatientTokens(patient) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        doctor_service_1.DoctorsService,
        patient_service_1.PatientsService])
], AuthService);
