import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { SignInUseCase } from '../../sign-in.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'

describe('SignInUseCase unit tests', () => {
  let sut: SignInUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new SignInUseCase.UseCase(repository, hashProvider)
  })

  it('should authenticate an user', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail')
    const hashPassword = await hashProvider.generateHash('12345')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    repository.items = [entity]
    const output = await sut.execute({
      email: entity.email,
      password: '12345',
    })

    expect(spyFindByEmail).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual(entity.toJSON())
  })

  it('should throw an error when email is not provided', async () => {
    const props = { email: null, password: '12345' }

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('should throw an error when password is not provided', async () => {
    const props = { email: 'a@a.com', password: null }

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('should not be able to authenticate wrong email', async () => {
    const props = { email: 'a@a.com', password: '12345' }

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to authenticate wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('12345')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    repository.items = [entity]

    const props = { email: 'a@a.com', password: 'fake' }

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})
