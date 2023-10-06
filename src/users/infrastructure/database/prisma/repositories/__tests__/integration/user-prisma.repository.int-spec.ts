import { PrismaClient } from '@prisma/client'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserPrismaReposity } from '../../user-prisma-repository'
import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('UserPrismaRepository integration tests', () => {
  const prismaService: PrismaClient = new PrismaClient()
  let sut: UserPrismaReposity
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()

    await prismaService.$connect()

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new UserPrismaReposity(prismaService as any)
    await prismaService.user.deleteMany()
  })

  it('should throw an error when entity not found by ID', async () => {
    expect(() => sut.findById('fakeid')).rejects.toThrow(
      new NotFoundError('UserModel not found using ID fakeid'),
    )
  })

  it('should successfully return an entity by ID', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })
    const output = await sut.findById(newUser.id)
    expect(output.toJSON()).toStrictEqual(entity.toJSON())
  })
})
