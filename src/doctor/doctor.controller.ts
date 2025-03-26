import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { DoctorsService } from "./doctor.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("doctors")
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post("register")
  async register(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.register(createDoctorDto);
  }

  @Post("login")
  async loginDoc(@Body() input: any) {
    return this.doctorsService.login(input);
  }

  @Post("find-patient")
  // @UseGuards(JwtAuthGuard)
  async getPatientByEmail(@Body() email: string) {
    return this.doctorsService.getPatientByEmail(email);
  }

  @Post("assign-patient")
  // @UseGuards(JwtAuthGuard)
  async assignPatientToDoctor(@Body() input: object) {
    return this.doctorsService.assignPatientToDoctor(input);
  }
}
