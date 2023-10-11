import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UpdatePasswordUseCase } from '../../update-password.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

describe('UpdatePasswordUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider)
  })

  it('should throw an error when entity not found', async () => {
    await expect(() =>
      sut.execute({
        id: 'fake-id',
        password: 'test name',
        oldPassword: 'old password',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found!'))
  })

  it('should throw an error when oldPassword is not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    repository.items = [entity]
    await expect(() =>
      sut.execute({
        id: entity._id,
        password: 'new password',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password are required'),
    )
  })

  it('should throw an error when new password is not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({ password: '1234' }))

    repository.items = [entity]
    await expect(() =>
      sut.execute({
        id: entity._id,
        password: '',
        oldPassword: '1234',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password are required'),
    )
  })

  it('should throw an error when oldPassword does not match', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }))

    repository.items = [entity]
    await expect(() =>
      sut.execute({
        id: entity._id,
        password: 'new password',
        oldPassword: '12345',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'))
  })

  it('should update an user password by ID', async () => {
    const spyFindByID = jest.spyOn(repository, 'update')
    const hashPassword = await hashProvider.generateHash('1234')
    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))]
    repository.items = items

    const output = await sut.execute({
      id: items[0].id,
      password: 'newpassword',
      oldPassword: '1234',
    })

    const checkNewPassword = await hashProvider.compareHash(
      'newpassword',
      output.password,
    )

    expect(spyFindByID).toHaveBeenCalledTimes(1)
    expect(checkNewPassword).toBeTruthy()
  })
})
