"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const patient_entity_1 = require("./patient/entities/patient.entity");
const doctor_entity_1 = require("./doctor/entities/doctor.entity");
const doctor_module_1 = require("./doctor/doctor.module");
const patient_module_1 = require("./patient/patient.module");
const config_1 = require("@nestjs/config");
const hospitals_doctors_entity_1 = require("./hospital-doctor/hospitals-doctors.entity");
const hospitals_patients_entity_1 = require("./hospital-patient/hospitals-patients.entity");
const doctors_patients_entity_1 = require("./doctor-patient/doctors-patients.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [doctor_entity_1.Doctor, patient_entity_1.Patient, hospitals_doctors_entity_1.HospitalDoctor, hospitals_patients_entity_1.HospitalPatient, doctors_patients_entity_1.DoctorPatient],
                synchronize: false, // Включайте только в разработке
            }),
            auth_module_1.AuthModule,
            doctor_module_1.DoctorsModule,
            patient_module_1.PatientsModule,
            doctor_module_1.DoctorsModule,
            patient_module_1.PatientsModule,
        ],
    })
], AppModule);
