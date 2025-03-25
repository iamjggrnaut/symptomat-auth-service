import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Doctor } from "./entities/doctor.entity";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { DoctorResponseDto } from "./dto/doctor-response.dto";
import { HospitalDoctor } from "../hospital-doctor/hospitals-doctors.entity";
import { Patient } from "../patient/entities/patient.entity";
import { HospitalPatient } from "../hospital-patient/hospitals-patients.entity";
import { DoctorPatient } from "../doctor-patient/doctors-patients.entity";

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(HospitalPatient)
    private readonly hospitalPatientRepository: Repository<HospitalPatient>,
    @InjectRepository(HospitalDoctor)
    private readonly hospitalDoctorRepository: Repository<HospitalDoctor>,
    @InjectRepository(DoctorPatient)
    private readonly doctorPatientRepository: Repository<DoctorPatient>,
    private readonly jwtService: JwtService
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
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

  async findById(id: string): Promise<Doctor | null> {
    return this.doctorRepository.findOne({ where: { id } });
  }

  async generateTokens(doctor: Doctor) {
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

  async register(createDoctorDto: CreateDoctorDto): Promise<DoctorResponseDto> {
    // Госпиталь: Глобальное медицинское учреждение
    const hospitalId = "332ea21e-470f-49bd-b9d5-b1df63f8b150";

    try {
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
  } catch (error) {
      if (error.code === '23505') { 
          throw new ConflictException('Доктор с таким email уже существует!');
      }
      throw error;
  }
  }

  async findByEmail(email: string): Promise<Doctor | undefined> {
    return this.doctorRepository.findOne({ where: { email } });
  }

  async login(input: any): Promise<Doctor | any> {
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

  async getPatientByEmail(input: any): Promise<HospitalPatient | null> {
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
    } else {
      console.log("Запись в hospital_patient не найдена");
      return null;
    }
  }

  async assignPatientToDoctor(input: any): Promise<DoctorPatient | null> {
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
      await this.doctorPatientRepository.update(
        { patientId },
        { doctorId }
      );
    } else {
      await this.doctorPatientRepository.insert({ patientId, doctorId });
    }

    return this.doctorPatientRepository.findOne({
      where: { patientId, doctorId },
    });
  }
}
