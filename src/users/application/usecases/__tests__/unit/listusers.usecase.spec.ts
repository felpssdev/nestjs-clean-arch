import { ListUsersUseCase } from '../../listusers.usecase'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('ListUsersUseCase unit tests', () => {
  let sut: ListUsersUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new ListUsersUseCase.UseCase(repository)
  })

  it('should convert an instance of Search', () => {
    let result = new UserRepository.SearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: null,
      sortDir: null,
      filter: 'fake',
    })
    let output = sut['toOutput'](result)

    expect(output).toStrictEqual({
      items: [],
      total: result.total,
      currentPage: result.currentPage,
      lastPage: 1,
      perPage: result.perPage,
    })

    const entity = new UserEntity(UserDataBuilder({}))

    result = new UserRepository.SearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: null,
      sortDir: null,
      filter: 'fake',
    })
    output = sut['toOutput'](result)

    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: result.total,
      currentPage: result.currentPage,
      lastPage: 1,
      perPage: result.perPage,
    })
  })
})
