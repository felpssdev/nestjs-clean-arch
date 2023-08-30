import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { GetUserUseCase } from '../../getuser.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('GetUserUseCase unit tests', () => {
  let sut: GetUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new GetUserUseCase.UseCase(repository)
  })

  it('should throw an error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fake-id' })).rejects.toThrow(
      new NotFoundError('Entity not found!'),
    )
  })

  it('should get an user profile by ID', async () => {
    const spyFindByID = jest.spyOn(repository, 'findById')
    const items = [new UserEntity(UserDataBuilder({}))]
    repository.items = items

    const output = await sut.execute({ id: items[0].id })

    expect(spyFindByID).toHaveBeenCalledTimes(1)
    expect(output).toMatchObject({
      id: items[0].id,
      name: items[0].name,
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
  })
})
