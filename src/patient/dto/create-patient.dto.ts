import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreatePatientDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  medicalCardNumber?: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;
}
