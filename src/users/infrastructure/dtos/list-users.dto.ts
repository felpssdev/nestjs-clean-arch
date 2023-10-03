import { SortDirection } from '@/shared/repositories/searchable-repository-contracts'
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase'

export class ListUsersDto implements ListUsersUseCase.Input {
  page?: number
  perPage?: number
  sort?: string
  sortDir?: SortDirection
  filter?: 'string'
}
