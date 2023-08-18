import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { UserProps } from '../entities/user.entity'
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'

export class UserRules {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  password: string

  @IsDate()
  @IsOptional()
  createdAt?: Date

  constructor({ name, email, password, createdAt }: UserProps) {
    Object.assign(this, { name, email, password, createdAt })
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserProps): boolean {
    return super.validate(new UserRules(data ?? ({} as UserProps)))
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator()
  }
}
