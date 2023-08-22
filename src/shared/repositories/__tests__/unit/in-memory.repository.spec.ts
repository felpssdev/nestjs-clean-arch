import { Entity } from '@/shared/domain/entities/entity'
import { InMemoryRepository } from '../../in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { async } from 'rxjs'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository

  beforeEach(() => {
    sut = new StubInMemoryRepository()
  })

  it('should insert a new entity to the repository', async () => {
    const entity = new StubEntity({ name: 'test name', price: 10 })
    await sut.insert(entity)

    expect(sut.items[0].toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should throw NotFoundError when entity not found', async () => {
    await expect(sut.findById('fake id')).rejects.toThrow(
      new NotFoundError('Entity not found!'),
    )
  })

  it('should return the correct entity when searching by id', async () => {
    const entity = new StubEntity({ name: 'test name', price: 10 })
    await sut.insert(entity)

    expect((await sut.findById(entity.id)).toJSON()).toStrictEqual(
      entity.toJSON(),
    )
  })

  it('should return all entities when finding all', async () => {
    const entity = new StubEntity({ name: 'test name', price: 10 })
    await sut.insert(entity)

    expect(await sut.findAll()).toStrictEqual([entity])
  })

  it('should throw NotFoundError when updating a non existent entity', () => {
    const entity = new StubEntity({ name: 'test name', price: 10 })

    expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError('Entity not found!'),
    )
  })

  it('should update an existing entity', async () => {
    const entity = new StubEntity({ name: 'test name', price: 10 })

    await sut.insert(entity)

    const updatedEntity = new StubEntity(
      { name: 'new name', price: 20 },
      entity.id,
    )

    await sut.update(updatedEntity)

    expect(sut.items[0].toJSON()).toStrictEqual(updatedEntity.toJSON())
  })
})
