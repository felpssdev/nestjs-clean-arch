import { Entity } from '../domain/entities/entity'
import { InMemoryRepository } from './in-memory.repository'
import { SearchableRepositoryInterface } from './searchable-repository-contracts'

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  items: E[] = []

  search(props: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
