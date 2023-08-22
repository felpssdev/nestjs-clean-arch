import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'
import { ValidationErrorEntity } from '@/shared/domain/errors/validation-error'

describe('UserEntity integration tests', () => {
  describe('constructor method', () => {
    it('should accept a valid user', () => {
      expect.assertions(0)

      const props: UserProps = UserDataBuilder({})

      new UserEntity(props)
    })

    it('should throw an error when creating an user with invalid name', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        name: null,
      }
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ name: '' })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ name: 'a'.repeat(256) })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ name: 10 as any })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)
    })

    it('should throw an error when creating an user with invalid email', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        email: null,
      }
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ email: '' })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ email: 'a'.repeat(256) })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ email: 10 as any })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)
    })

    it('should throw an error when creating an user with invalid password', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        password: null,
      }
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ password: '' })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ password: 'a'.repeat(101) })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ password: 10 as any })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)
    })

    it('should throw an error when creating an user with invalid createdAt', () => {
      let props: UserProps = UserDataBuilder({ createdAt: '2023' as any })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ createdAt: 10 as any })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)
    })
  })
})
