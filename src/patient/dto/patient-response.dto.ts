import { Exclude, Expose } from "class-transformer";

@Exclude()
export class PatientResponseDto {
  @Expose()
  user: any;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
