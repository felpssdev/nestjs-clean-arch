import { HashProvider } from '@/shared/application/providers/hash-provider'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserPrismaReposity } from '@/users/infrastructure/database/prisma/repositories/user-prisma-repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { SignupUseCase } from '../../signup.usecase'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'

describe('UserPrismaRepository integration tests', () => {
  const prismaService: PrismaClient = new PrismaClient()
  let sut: SignupUseCase.UseCase
  let repository: UserPrismaReposity
  let module: TestingModule
  let hashProvider: HashProvider

  beforeAll(async () => {
    setupPrismaTests()

    await prismaService.$connect()

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()

    repository = new UserPrismaReposity(prismaService as any)
    hashProvider = new BcryptjsHashProvider()
  })

  beforeEach(async () => {
    sut = new SignupUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should successfully create an user', async () => {
    const props = {
      name: 'test name',
      email: 'a@a.com',
      password: 'testpassword123',
    }

    const output = await sut.execute(props)
    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeInstanceOf(Date)
  })
})
