import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { SignupUseCase } from '../../signup.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { BadRequestError } from '@/users/application/errors/bad-request-error'

describe('SignupUseCase unit tests', () => {
  let sut: SignupUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new SignupUseCase.UseCase(repository, hashProvider)
  })

  it('should create an user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = UserDataBuilder({})
    const output = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    })

    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should not create an user with an existing email', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = UserDataBuilder({ email: 'a@test.com' })

    await sut.execute(props)

    expect(spyInsert).toHaveBeenCalledTimes(1)
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should throw an error when name is not provided', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = Object.assign(UserDataBuilder({}), { name: null })

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
    expect(spyInsert).not.toHaveBeenCalled()
  })

  it('should throw an error when email is not provided', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = Object.assign(UserDataBuilder({}), { email: null })

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
    expect(spyInsert).not.toHaveBeenCalled()
  })

  it('should throw an error when password is not provided', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = Object.assign(UserDataBuilder({}), { password: null })

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
    expect(spyInsert).not.toHaveBeenCalled()
  })
})
