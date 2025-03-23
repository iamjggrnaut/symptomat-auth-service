import { Body, Controller, Post } from "@nestjs/common";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { PatientsService } from "./patient.service";

@Controller("patients")
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post("register")
  async register(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.register(createPatientDto);
  }

  @Post("login")
  async loginDoc(@Body()input: any) {
    return this.patientsService.login(input);
  }

}
