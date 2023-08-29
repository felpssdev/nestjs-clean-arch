import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserInMemoryRepository } from '../user-in-memory.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository

  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })

  it('should throw an error when email not found - findByEmail method', async () => {
    await expect(sut.findByEmail('a@email.com')).rejects.toThrow(
      new NotFoundError('Email "a@email.com" not found!'),
    )
  })

  it('should return an entity by email - findByEmail method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    expect((await sut.findByEmail(entity.email)).toJSON()).toStrictEqual(
      entity.toJSON(),
    )
  })

  it('should throw an error when email exists - emailExists method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError(`Email "${entity.email}" already exists!`),
    )
  })

  it('should not throw an error when email does not exists - emailExists method', async () => {
    expect.assertions(0)

    await sut.emailExists('email@test.com')
  })

  it('should not filter items when filter object is null - applyFilter method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result, 'filter')
    const filteredItems = await sut['applyFilter'](result, null)

    expect(spyFilter).not.toHaveBeenCalled()
    expect(filteredItems).toStrictEqual(result)
  })

  it('should filter items by filter params - applyFilter method', async () => {
    const items: UserEntity[] = [
      new UserEntity(UserDataBuilder({ name: 'Test' })),
      new UserEntity(UserDataBuilder({ name: 'TEST' })),
      new UserEntity(UserDataBuilder({ name: 'fake' })),
    ]
    const spyFilter = jest.spyOn(items, 'filter')
    const filteredItems = await sut['applyFilter'](items, 'test')

    expect(spyFilter).toHaveBeenCalled()
    expect(filteredItems).toStrictEqual(items.slice(0, 2))
  })
})
