import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { SearchInput } from '@/shared/application/dto/search-input'
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dto/pagination-output'
import { UserOutput, UserOutputMapper } from '../dto/user-output'

export namespace ListUsersUseCase {
  export type Input = SearchInput

  export type Output = PaginationOutput<UserOutput>

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new UserRepository.SearchParams(input)
      const searchResult = await this.userRepository.search(params)

      return this.toOutput(searchResult)
    }

    private toOutput(result: UserRepository.SearchResult): Output {
      const items = result.items.map(item => UserOutputMapper.toOutput(item))

      return PaginationOutputMapper.toOutput(items, result)
    }
  }
}
