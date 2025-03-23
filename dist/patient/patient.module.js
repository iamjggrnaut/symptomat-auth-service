"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const patient_entity_1 = require("./entities/patient.entity");
const patient_controller_1 = require("./patient.controller");
const patient_service_1 = require("./patient.service");
const jwt_1 = require("@nestjs/jwt");
const hospitals_patients_entity_1 = require("../hospital-patient/hospitals-patients.entity");
const doctors_patients_entity_1 = require("../doctor-patient/doctors-patients.entity");
let PatientsModule = class PatientsModule {
};
exports.PatientsModule = PatientsModule;
exports.PatientsModule = PatientsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([patient_entity_1.Patient, hospitals_patients_entity_1.HospitalPatient, doctors_patients_entity_1.DoctorPatient]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRES_IN },
            }),
        ],
        controllers: [patient_controller_1.PatientsController],
        providers: [patient_service_1.PatientsService],
        exports: [patient_service_1.PatientsService],
    })
], PatientsModule);
