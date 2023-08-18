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

  it('should validate a valid case', () => {
    const validUser = UserDataBuilder({})
    const isValid = sut.validate(validUser)

    expect(isValid).toBeTruthy()
    expect(sut.errors).toBeNull()
    expect(sut.validatedData).toStrictEqual(new UserRules(validUser))
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
  })

  describe('email field', () => {
    it('should invalidate null email', () => {
      const isValid = sut.validate(null)
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
        'email must be a string',
        'email should not be empty',
      ])
    })

    it('should invalidate empty email', () => {
      const isValid = sut.validate({ ...UserDataBuilder({ email: '' }) })
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
      ])
    })

    it('should invalidate non string email', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        email: false as any,
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
        'email must be a string',
      ])
    })

    it('should invalidate email with more than 255 characters', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        email: 'a'.repeat(256),
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ])
    })
  })

  describe('password field', () => {
    it('should invalidate null password', () => {
      const isValid = sut.validate(null)
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
        'password must be a string',
        'password should not be empty',
      ])
    })

    it('should invalidate empty password', () => {
      const isValid = sut.validate({ ...UserDataBuilder({ password: '' }) })
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
      ])
    })

    it('should invalidate non string password', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        password: false as any,
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
        'password must be a string',
      ])
    })

    it('should invalidate password with more than 100 characters', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        password: 'a'.repeat(101),
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ])
    })
  })

  describe('createdAt field', () => {
    it('should invalidate number date', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        createdAt: 10 as any,
      })

      expect(isValid).toBeFalsy()
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ])
    })

    it('should invalidate strings that are not in the date format', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        createdAt: '10' as any,
      })

      expect(isValid).toBeFalsy()
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ])
    })
  })
})
