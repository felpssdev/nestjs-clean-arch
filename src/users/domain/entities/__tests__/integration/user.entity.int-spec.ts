import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'
import { ValidationError } from 'class-validator'
import { ValidationErrorEntity } from '@/shared/domain/errors/validation-error'

describe('UserEntity integration tests', () => {
  describe('constructor method', () => {
    it('should throw an error when creating an user with null name', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        name: null,
      }
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ name: '' })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)

      props = UserDataBuilder({ name: 'a'.repeat(256) })
      expect(() => new UserEntity(props)).toThrowError(ValidationErrorEntity)
    })
  })
})
