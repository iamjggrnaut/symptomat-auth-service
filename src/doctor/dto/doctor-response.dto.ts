import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DoctorResponseDto {
    @Expose()
   user: any

    @Expose()
    accessToken: string;

    @Expose()
    refreshToken: string;
}