import { Entity } from '@/shared/domain/entities/entity'
import { UserValidatorFactory } from '../validators/user.validator'

export type UserProps = {
  name: string
  email: string
  password: string
  createdAt?: Date
}

export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly props: UserProps,
    id?: string,
  ) {
    UserEntity.validade(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
  }

  updateName(value: string): void {
    UserEntity.validade({ ...this.props, name: value })
    this.name = value
  }

  updatePassword(value: string): void {
    UserEntity.validade({ ...this.props, password: value })
    this.password = value
  }

  get name() {
    return this.props.name
  }

  private set name(value: string) {
    this.props.name = value
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  private set password(value: string) {
    this.props.password = value
  }

  get createdAt() {
    return this.props.createdAt
  }

  static validade(props: UserProps): void {
    const validator = UserValidatorFactory.create()
    validator.validate(props)
  }
}
