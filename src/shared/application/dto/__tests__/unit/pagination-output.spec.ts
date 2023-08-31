import { SearchResult } from '@/shared/repositories/searchable-repository-contracts'
import { PaginationOutputMapper } from '../../pagination-output'

describe('PaginationOutputMapper unit tests', () => {
  it('should convert an entity to output', () => {
    const result = new SearchResult({
      items: ['fake'] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: null,
      sortDir: null,
      filter: 'fake',
    })
    const sut = PaginationOutputMapper.toOutput(result.items, result)

    expect(sut).toStrictEqual({
      items: result.items,
      total: result.total,
      currentPage: result.currentPage,
      lastPage: 1,
      perPage: result.perPage,
    })
  })
})
