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
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const doctor_entity_1 = require("./entities/doctor.entity");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const hospitals_doctors_entity_1 = require("../hospital-doctor/hospitals-doctors.entity");
const patient_entity_1 = require("../patient/entities/patient.entity");
const hospitals_patients_entity_1 = require("../hospital-patient/hospitals-patients.entity");
const doctors_patients_entity_1 = require("../doctor-patient/doctors-patients.entity");
let DoctorsService = class DoctorsService {
    constructor(doctorRepository, patientRepository, hospitalPatientRepository, hospitalDoctorRepository, doctorPatientRepository, jwtService) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.hospitalPatientRepository = hospitalPatientRepository;
        this.hospitalDoctorRepository = hospitalDoctorRepository;
        this.doctorPatientRepository = doctorPatientRepository;
        this.jwtService = jwtService;
    }
    async create(createDoctorDto) {
        const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);
        const doctor = this.doctorRepository.create({
            password: hashedPassword,
            email: createDoctorDto.email.toLowerCase(),
            role: "doctor",
            notificationsSettings: JSON.stringify({
                contactMeRequest: false,
                criticalIdicators: false,
                uploadAnalyzesByPatients: false,
            }),
        });
        return this.doctorRepository.save(doctor);
    }
    async findById(id) {
        return this.doctorRepository.findOne({ where: { id } });
    }
    async generateTokens(doctor) {
        const payload = {
            email: doctor.email,
            id: doctor.id,
            tokenType: doctor.role,
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
    async register(createDoctorDto) {
        // Госпиталь: Глобальное медицинское учреждение
        const hospitalId = "332ea21e-470f-49bd-b9d5-b1df63f8b150";
        const doctor = await this.create({
            ...createDoctorDto,
        });
        const hospitalDoctor = this.hospitalDoctorRepository.create({
            doctorId: doctor.id,
            hospitalId: hospitalId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await this.hospitalDoctorRepository.save(hospitalDoctor);
        const tokens = await this.generateTokens(doctor);
        return {
            user: { id: doctor.id, email: doctor.email },
            ...tokens,
        };
    }
    async findByEmail(email) {
        return this.doctorRepository.findOne({ where: { email } });
    }
    async login(input) {
        console.log("email ", input.email);
        const doctor = await this.doctorRepository.findOne({
            where: { email: input.email },
        });
        if (!doctor) {
            throw new Error("Пользователь с таким email не найден");
        }
        const passMatch = bcrypt.compareSync(input.password, doctor.password);
        if (!passMatch) {
            throw new Error("Неверный пароль");
        }
        const tokens = await this.generateTokens(doctor);
        return {
            user: { id: doctor.id, email: doctor.email },
            ...tokens,
        };
    }
    async getPatientByEmail(input) {
        const patient = await this.patientRepository.findOne({
            where: { email: input.email.toLowerCase() },
        });
        if (!patient) {
            console.log("Пациент не найден");
            return null;
        }
        console.log("Найден пациент:", patient);
        const hospitalPatient = await this.hospitalPatientRepository.findOne({
            where: { patientId: patient.id },
        });
        if (hospitalPatient) {
            console.log("Найдена запись в hospital_patient:", hospitalPatient);
            return hospitalPatient;
        }
        else {
            console.log("Запись в hospital_patient не найдена");
            return null;
        }
    }
    async assignPatientToDoctor(input) {
        const patientId = input.patientId;
        const doctorId = input.doctorId;
        const patient = this.patientRepository.find({ where: { id: patientId } });
        if (!patient) {
            return null;
        }
        const existingRecord = await this.doctorPatientRepository.findOne({
            where: { patientId },
        });
        if (existingRecord) {
            await this.doctorPatientRepository.update({ patientId }, { doctorId });
        }
        else {
            await this.doctorPatientRepository.insert({ patientId, doctorId });
        }
        return this.doctorPatientRepository.findOne({
            where: { patientId, doctorId },
        });
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(doctor_entity_1.Doctor)),
    __param(1, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(2, (0, typeorm_1.InjectRepository)(hospitals_patients_entity_1.HospitalPatient)),
    __param(3, (0, typeorm_1.InjectRepository)(hospitals_doctors_entity_1.HospitalDoctor)),
    __param(4, (0, typeorm_1.InjectRepository)(doctors_patients_entity_1.DoctorPatient)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], DoctorsService);
