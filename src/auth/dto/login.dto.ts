import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}