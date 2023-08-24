import { SearchParams } from '../../searchable-repository-contracts'

describe('SearchableRepository unit tests', () => {
  describe('SearchParams unit tests', () => {
    it('page prop', () => {
      const sut = new SearchParams()

      expect(sut.page).toBe(1)

      const params = [
        { page: null as any, expected: 1 },
        { page: undefined as any, expected: 1 },
        { page: '' as any, expected: 1 },
        { page: 'test' as any, expected: 1 },
        { page: 0 as any, expected: 1 },
        { page: -1 as any, expected: 1 },
        { page: 5.5 as any, expected: 1 },
        { page: true as any, expected: 1 },
        { page: false as any, expected: 1 },
        { page: {} as any, expected: 1 },
        { page: 1 as any, expected: 1 },
        { page: 2 as any, expected: 2 },
      ]

      params.forEach(param => {
        expect(new SearchParams({ page: param.page }).page).toEqual(
          param.expected,
        )
      })
    })

    it('perPage prop', () => {
      const sut = new SearchParams()

      expect(sut.perPage).toBe(15)

      const params = [
        { perPage: null as any, expected: 15 },
        { perPage: undefined as any, expected: 15 },
        { perPage: '' as any, expected: 15 },
        { perPage: 'test' as any, expected: 15 },
        { perPage: 0 as any, expected: 15 },
        { perPage: -15 as any, expected: 15 },
        { perPage: 5.5 as any, expected: 15 },
        { perPage: true as any, expected: 15 },
        { perPage: false as any, expected: 15 },
        { perPage: {} as any, expected: 15 },
        { perPage: 2 as any, expected: 2 },
        { perPage: 25 as any, expected: 25 },
      ]

      params.forEach(param => {
        expect(new SearchParams({ perPage: param.perPage }).perPage).toEqual(
          param.expected,
        )
      })
    })

    it('sort prop', () => {
      const sut = new SearchParams()

      expect(sut.sort).toBeNull()

      const params = [
        { sort: null as any, expected: null },
        { sort: undefined as any, expected: null },
        { sort: '' as any, expected: null },
        { sort: 'test', expected: 'test' },
        { sort: 0 as any, expected: '0' },
        { sort: -15 as any, expected: '-15' },
        { sort: 5.5 as any, expected: '5.5' },
        { sort: true as any, expected: 'true' },
        { sort: false as any, expected: 'false' },
        { sort: {} as any, expected: '[object Object]' },
      ]

      params.forEach(param => {
        expect(new SearchParams({ sort: param.sort }).sort).toEqual(
          param.expected,
        )
      })
    })

    it('sortDir prop', () => {
      let sut = new SearchParams()
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: null })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: undefined })
      expect(sut.sortDir).toBeNull()

      sut = new SearchParams({ sort: '' })
      expect(sut.sortDir).toBeNull()

      const params = [
        { sortDir: null as any, expected: 'desc' },
        { sortDir: undefined as any, expected: 'desc' },
        { sortDir: '' as any, expected: 'desc' },
        { sortDir: 'test', expected: 'desc' },
        { sortDir: 0 as any, expected: 'desc' },
        { sortDir: -15 as any, expected: 'desc' },
        { sortDir: 5.5 as any, expected: 'desc' },
        { sortDir: true as any, expected: 'desc' },
        { sortDir: false as any, expected: 'desc' },
        { sortDir: 'desc' as any, expected: 'desc' },
        { sortDir: 'asc' as any, expected: 'asc' },
        { sortDir: 'DESC' as any, expected: 'desc' },
        { sortDir: 'ASC' as any, expected: 'asc' },
      ]

      params.forEach(param => {
        expect(
          new SearchParams({ sort: 'field', sortDir: param.sortDir }).sortDir,
        ).toEqual(param.expected)
      })
    })

    it('filter prop', () => {
      const sut = new SearchParams()

      expect(sut.filter).toBeNull()

      const params = [
        { filter: null as any, expected: null },
        { filter: undefined as any, expected: null },
        { filter: '' as any, expected: null },
        { filter: 'test', expected: 'test' },
        { filter: 0 as any, expected: '0' },
        { filter: -15 as any, expected: '-15' },
        { filter: 5.5 as any, expected: '5.5' },
        { filter: true as any, expected: 'true' },
        { filter: false as any, expected: 'false' },
        { filter: {} as any, expected: '[object Object]' },
      ]

      params.forEach(param => {
        expect(new SearchParams({ filter: param.filter }).filter).toEqual(
          param.expected,
        )
      })
    })
  })
})
