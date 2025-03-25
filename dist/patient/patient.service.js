"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("./entities/patient.entity");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const hospitals_patients_entity_1 = require("../hospital-patient/hospitals-patients.entity");
const doctors_patients_entity_1 = require("../doctor-patient/doctors-patients.entity");
let PatientsService = class PatientsService {
    constructor(patientRepository, hospitalPatientRepository, doctorPatientRepository, jwtService) {
        this.patientRepository = patientRepository;
        this.hospitalPatientRepository = hospitalPatientRepository;
        this.doctorPatientRepository = doctorPatientRepository;
        this.jwtService = jwtService;
    }
    async findByEmail(email) {
        return this.patientRepository.findOne({ where: { email } });
    }
    async findById(id) {
        return this.patientRepository.findOne({ where: { id } });
    }
    async create(createPatientDto) {
        const hashedPassword = await bcrypt.hash(createPatientDto.password, 10);
        const patient = this.patientRepository.create({
            email: createPatientDto.email.toLowerCase(),
            fcmToken: null,
            isFirstSignUp: false,
            lastAuthProvider: "email",
            notificationsSettings: JSON.stringify({ newSurvey: false }),
            language: "ru",
            password: hashedPassword,
            role: "patient",
        });
        return this.patientRepository.save(patient);
    }
    async generateTokens(patient) {
        const payload = {
            email: patient.email,
            id: patient.id,
            tokenType: patient.role,
        };
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
    async register(createPatientDto) {
        // Госпиталь: Глобальное медицинское учреждение
        const hospitalId = "332ea21e-470f-49bd-b9d5-b1df63f8b150";
        // Doctor: Super Doctor - на него регистрируются все пациенты с самостоятельной регистрацией
        const doctorId = "fa980263-0d17-4b18-88a5-d015d3312ec5";
        try {
            // Пытаемся создать пациента
            const patient = await this.create(createPatientDto);
            // Создаем связь пациента с госпиталем
            const hospitalPatient = this.hospitalPatientRepository.create({
                patientId: patient.id,
                hospitalId: hospitalId,
                medicalCardNumber: createPatientDto.medicalCardNumber,
                firstName: createPatientDto.firstName,
                lastName: createPatientDto.lastName
            });
            await this.hospitalPatientRepository.save(hospitalPatient);
            // Создаем связь пациента с доктором
            const doctorPatient = this.doctorPatientRepository.create({
                patientId: patient.id,
                doctorId: doctorId,
            });
            await this.doctorPatientRepository.save(doctorPatient);
            // Генерируем токены
            const tokens = await this.generateTokens(patient);
            return {
                user: { id: patient.id, email: patient.email },
                ...tokens,
            };
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('Пациент с таким email уже существует!');
            }
            throw error;
        }
    }
    async login(input) {
        console.log("email ", input.email);
        const patient = await this.patientRepository.findOne({
            where: { email: input.email },
        });
        if (!patient) {
            throw new Error("Пользователь с таким email не найден");
        }
        const passMatch = bcrypt.compareSync(input.password, patient.password);
        if (!passMatch) {
            throw new Error("Неверный пароль");
        }
        const tokens = await this.generateTokens(patient);
        return {
            user: { id: patient.id, email: patient.email },
            ...tokens,
        };
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(1, (0, typeorm_1.InjectRepository)(hospitals_patients_entity_1.HospitalPatient)),
    __param(2, (0, typeorm_1.InjectRepository)(doctors_patients_entity_1.DoctorPatient)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], PatientsService);
