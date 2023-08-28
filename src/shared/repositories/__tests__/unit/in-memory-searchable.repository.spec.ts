import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name']

  protected async applyFilter(
    items: StubEntity[],
    filter: string,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items
    }

    return items.filter(item => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase())
    })
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository()
  })

  describe('applyFilter method', () => {
    it('should return all items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name', price: 10 })]
      const spyFilterMethod = jest.spyOn(items, 'filter')
      const filteredItems = await sut['applyFilter'](items, null)

      expect(filteredItems).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('should filter using filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 10 }),
        new StubEntity({ name: 'TEST', price: 10 }),
        new StubEntity({ name: 'fake', price: 10 }),
      ]
      const spyFilterMethod = jest.spyOn(items, 'filter')
      let filteredItems = await sut['applyFilter'](items, 'TEST')

      expect(filteredItems).toStrictEqual(items.slice(0, 2))
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)

      filteredItems = await sut['applyFilter'](items, 'test')

      expect(filteredItems).toStrictEqual(items.slice(0, 2))
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)

      filteredItems = await sut['applyFilter'](items, 'nothing')

      expect(filteredItems).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
    })
  })

  describe('applySort method', () => {
    it('', () => {})
  })

  describe('applyPaginate method', () => {
    it('', () => {})
  })

  describe('search method', () => {
    it('', () => {})
  })
})
