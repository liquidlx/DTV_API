import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class UsersAttributes {
  @IsOptional()
  @IsUUID(4)
  id?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class PhoneAttributes {
  @IsNumberString()
  number: number;

  @IsNumberString()
  ddd: number;
}

export class SignUpRequest extends UsersAttributes {
  @ValidateNested()
  phones: PhoneAttributes[];
}
