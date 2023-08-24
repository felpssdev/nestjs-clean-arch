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
  })
})
