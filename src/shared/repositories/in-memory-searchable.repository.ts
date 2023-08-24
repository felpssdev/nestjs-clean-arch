import { Entity } from '../domain/entities/entity'
import { InMemoryRepository } from './in-memory.repository'
import {
  SearchParams,
  SearchResult,
  SearchableRepositoryInterface,
} from './searchable-repository-contracts'

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  async search(props: SearchParams): Promise<SearchResult<E>> {
    const filteredItems = await this.applyFilter(this.items, props.filter)
    const sortedItems = await this.applySort(
      filteredItems,
      props.sort,
      props.sortDir,
    )
    const paginatedItems = await this.applyPaginate(
      sortedItems,
      props.page,
      props.perPage,
    )

    return new SearchResult({
      items: paginatedItems,
      total: filteredItems.length,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      filter: props.filter,
    })
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<E[]> {}

  protected async applyPaginate(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {}
}
