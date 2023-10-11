import { HashProvider } from '@/shared/application/providers/hash-provider'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserPrismaReposity } from '@/users/infrastructure/database/prisma/repositories/user-prisma-repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { SignInUseCase } from '../../sign-in.usecase'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('SigninUseCase integration tests', () => {
  const prismaService: PrismaClient = new PrismaClient()
  let sut: SignInUseCase.UseCase
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
    sut = new SignInUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should not authorize authetication with an invalid email', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: 'passwordd',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not authorize authetication with an invalid password', async () => {
    const hashPassword = await hashProvider.generateHash('12345')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: 'not12345',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not authorize authetication if email is not provided', async () => {
    const hashPassword = await hashProvider.generateHash('12345')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )

    await expect(() =>
      sut.execute({
        email: null,
        password: 'not12345',
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should not authorize authetication if password is not provided', async () => {
    const hashPassword = await hashProvider.generateHash('12345')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )

    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: null,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should succesfully authorize authetication', async () => {
    const hashPassword = await hashProvider.generateHash('12345')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({
      email: 'a@a.com',
      password: '12345',
    })

    expect(output).toStrictEqual(entity.toJSON())
  })
})
