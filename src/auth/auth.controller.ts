import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'
import { DoctorsService } from '../doctor/doctor.service';
import { PatientsService } from '../patient/patient.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly doctorsService: DoctorsService,
        private readonly patientsService: PatientsService,
    ) {}

    @Post('login/doctor')
    async loginDoctor(@Body() loginDto: LoginDto) {
        const doctor = await this.doctorsService.findByEmail(loginDto.email);
        if (!doctor || !(await bcrypt.compare(loginDto.password, doctor.password))) {
            throw new Error('Invalid credentials');
        }
        const tokens = await this.authService.generateDoctorTokens(doctor);
        return { ...tokens, user: doctor };
    }

    @Post('login/patient')
    async loginPatient(@Body() loginDto: LoginDto) {
        const patient = await this.patientsService.findByEmail(loginDto.email);
        if (!patient || !(await bcrypt.compare(loginDto.password, patient.password))) {
            throw new Error('Invalid credentials');
        }
        const tokens = await this.authService.generatePatientTokens(patient);
        return { ...tokens, user: patient };
    }
}