import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserPrismaReposity } from '@/users/infrastructure/database/prisma/repositories/user-prisma-repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { DeleteUserUseCase } from '../../delete-user.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('UserPrismaRepository integration tests', () => {
  const prismaService: PrismaClient = new PrismaClient()
  let sut: DeleteUserUseCase.UseCase
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
    sut = new DeleteUserUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should successfully delete an user', async () => {
    await expect(() =>
      sut.execute({ id: 'b2d6d85f-e77a-412b-a8fe-c163da8dcc69' }),
    ).rejects.toThrow(
      new NotFoundError(
        'UserModel not found using ID b2d6d85f-e77a-412b-a8fe-c163da8dcc69',
      ),
    )
  })

  it('should successfully delete an user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await sut.execute({ id: entity.id })

    const output = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    })
    expect(output).toBeNull()
    const models = await prismaService.user.findMany()
    expect(models).toHaveLength(0)
  })
})
