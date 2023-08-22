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

  describe('updateName method', () => {
    it('should throw an error when updating an user with invalid name', () => {
      const props: UserProps = UserDataBuilder({})

      const entity = new UserEntity(props)

      expect(() => entity.updateName(null)).toThrowError(ValidationErrorEntity)

      expect(() => entity.updateName('')).toThrowError(ValidationErrorEntity)

      expect(() => entity.updateName('a'.repeat(256))).toThrowError(
        ValidationErrorEntity,
      )

      expect(() => entity.updateName(10 as any)).toThrowError(
        ValidationErrorEntity,
      )
    })

    it('should accept a valid name on user update method', () => {
      expect.assertions(0)

      const props: UserProps = UserDataBuilder({})
      const entity = new UserEntity(props)
      entity.updateName('other name')
    })
  })

  describe('updatePassword method', () => {
    it('should throw an error when updating an user with invalid password', () => {
      const props: UserProps = UserDataBuilder({})

      const entity = new UserEntity(props)

      expect(() => entity.updatePassword(null)).toThrowError(
        ValidationErrorEntity,
      )

      expect(() => entity.updatePassword('')).toThrowError(
        ValidationErrorEntity,
      )

      expect(() => entity.updatePassword('a'.repeat(101))).toThrowError(
        ValidationErrorEntity,
      )

      expect(() => entity.updatePassword(10 as any)).toThrowError(
        ValidationErrorEntity,
      )
    })

    it('should accept a valid password on user update method', () => {
      expect.assertions(0)

      const props: UserProps = UserDataBuilder({})
      const entity = new UserEntity(props)
      entity.updatePassword('other password')
    })
  })
})
