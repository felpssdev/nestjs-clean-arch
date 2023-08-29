import { UserEntity } from '../entities/user.entity'
import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from '@/shared/repositories/searchable-repository-contracts'

export namespace UserRepository {
  export type Filter = string
  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<UserEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      UserEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByEmail(email: string): Promise<UserEntity>
    emailExists(email: string): Promise<void>
  }
}
