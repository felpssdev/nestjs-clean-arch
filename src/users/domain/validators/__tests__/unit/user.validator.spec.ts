import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '../../user.validator'

let sut: UserValidator

describe('UserValidator unit tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create()
  })

  describe('name field', () => {
    it('should invalidate null name', () => {
      const isValid = sut.validate(null)
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
        'name should not be empty',
      ])
    })

    it('should invalidate empty name', () => {
      const isValid = sut.validate({ ...UserDataBuilder({ name: '' }) })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual(['name should not be empty'])
    })

    it('should invalidate non string name', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        name: false as any,
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
      ])
    })

    it('should invalidate name with more than 255 characters', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        name: 'a'.repeat(256),
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ])
    })

    it('should validate', () => {
      const validUser = UserDataBuilder({})
      const isValid = sut.validate(validUser)

      expect(isValid).toBeTruthy()
      expect(sut.errors).toBeNull()
      expect(sut.validatedData).toStrictEqual(new UserRules(validUser))
    })
  })
})
