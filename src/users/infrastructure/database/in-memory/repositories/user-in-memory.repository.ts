import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { InMemorySearchableRepository } from '@/shared/repositories/in-memory-searchable.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
  async findByEmail(email: string): Promise<UserEntity> {
    const entity: UserEntity = this.items.find(item => item.email === email)

    if (!entity) throw new ConflictError(`Email "${email} not found!"`)

    return entity
  }

  async emailExists(email: string): Promise<void> {
    const entity: UserEntity = this.items.find(item => item.email === email)

    if (!entity) throw new ConflictError(`Email "${email} already exists!"`)
  }
}
