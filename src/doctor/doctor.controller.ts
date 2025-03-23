import { Body, Controller, Post } from "@nestjs/common";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { DoctorsService } from "./doctor.service";

@Controller("doctors")
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post("register")
  async register(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.register(createDoctorDto);
  }

  @Post("login")
  async loginDoc(@Body()input: any) {
    return this.doctorsService.login(input);
  }

  @Post('find-patient')
  async getPatientByEmail(@Body() email: string){
    return this.doctorsService.getPatientByEmail(email)
  }

  @Post('assign-patient')
  async assignPatientToDoctor(@Body() input: object){

    return this.doctorsService.assignPatientToDoctor(input)
  }
}
