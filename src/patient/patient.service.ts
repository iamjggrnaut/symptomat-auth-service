import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Patient } from "./entities/patient.entity";
import { CreatePatientDto } from "./dto/create-patient.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { PatientResponseDto } from "./dto/patient-response.dto";
import { HospitalPatient } from "../hospital-patient/hospitals-patients.entity";
import { DoctorPatient } from "../doctor-patient/doctors-patients.entity";

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(HospitalPatient)
    private readonly hospitalPatientRepository: Repository<HospitalPatient>,
    @InjectRepository(DoctorPatient)
    private readonly doctorPatientRepository: Repository<DoctorPatient>,
    private readonly jwtService: JwtService
  ) {}

  async findByEmail(email: string): Promise<Patient> {
    return this.patientRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<Patient> {
    return this.patientRepository.findOne({ where: { id } });
  }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
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

  async generateTokens(patient: Patient) {
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

  async register(
    createPatientDto: CreatePatientDto
  ): Promise<PatientResponseDto> {
    // Госпиталь: Глобальное медицинское учреждение
    const hospitalId = "332ea21e-470f-49bd-b9d5-b1df63f8b150";
    // Doctor: Super Doctor - на него регистрируются все пациенты с самостоятельной регистрацией
    const doctorId = "fa980263-0d17-4b18-88a5-d015d3312ec5";

    // Проверяем существование пользователя перед созданием
    const existingPatient = await this.patientRepository.findOne({
      where: { email: createPatientDto.email.toLowerCase() },
    });

    if (existingPatient) {
      throw new ConflictException("Пациент с таким email уже существует!");
    }

    try {
      const patient = await this.create(createPatientDto);

      const hospitalPatient = this.hospitalPatientRepository.create({
        patientId: patient.id,
        hospitalId: hospitalId,
        medicalCardNumber: createPatientDto.medicalCardNumber,
        firstName: createPatientDto.firstName,
        lastName: createPatientDto.lastName,
      });

      await this.hospitalPatientRepository.save(hospitalPatient);

      const doctorPatient = this.doctorPatientRepository.create({
        patientId: patient.id,
        doctorId: doctorId,
      });

      await this.doctorPatientRepository.save(doctorPatient);

      const tokens = await this.generateTokens(patient);

      return {
        user: { id: patient.id, email: patient.email },
        ...tokens,
      };
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("Пациент с таким email уже существует!");
      }
      throw error;
    }
  }

  async login(input: any): Promise<Patient | any> {
    console.log("email ", input.email);

    const patient = await this.patientRepository.findOne({
      where: { email: input.email?.toLowerCase() },
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
}
