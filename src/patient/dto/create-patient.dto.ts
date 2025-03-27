import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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

  @IsOptional()
  @IsNumber()
  tgChatId?: number;
}
