import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserPrismaReposity } from '@/users/infrastructure/database/prisma/repositories/user-prisma-repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { GetUserUseCase } from '../../getuser.usecase'

describe('UserPrismaRepository integration tests', () => {
  const prismaService: PrismaClient = new PrismaClient()
  let sut: GetUserUseCase.UseCase
  let repository: UserPrismaReposity
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()

    await prismaService.$connect()

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()

    repository = new UserPrismaReposity(prismaService as any)
  })

  beforeEach(async () => {
    sut = new GetUserUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should return an user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({ id: entity._id })

    expect(output).toStrictEqual(model)
  })
})
