import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UpdateUserUseCase } from '../../update-user.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new UpdateUserUseCase.UseCase(repository)
  })

  it('should throw an error when entity not found', async () => {
    await expect(() =>
      sut.execute({ id: 'fake-id', name: 'test name' }),
    ).rejects.toThrow(new NotFoundError('Entity not found!'))
  })

  it('should throw an error when name is not provided', async () => {
    await expect(() =>
      sut.execute({ id: 'fake-id', name: '' }),
    ).rejects.toThrow(new BadRequestError('Name not provided'))
  })

  it('should update an user name by ID', async () => {
    const spyFindByID = jest.spyOn(repository, 'update')
    const items = [new UserEntity(UserDataBuilder({}))]
    repository.items = items

    const output = await sut.execute({
      id: items[0].id,
      name: 'new valid name',
    })

    expect(spyFindByID).toHaveBeenCalledTimes(1)
    expect(output).toMatchObject({
      id: items[0].id,
      name: 'new valid name',
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
  })
})
