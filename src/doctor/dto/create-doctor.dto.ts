import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateDoctorDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}