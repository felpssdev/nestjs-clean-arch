import { HashProvider } from '@/shared/application/providers/hash-provider'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserPrismaReposity } from '@/users/infrastructure/database/prisma/repositories/user-prisma-repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { UpdatePasswordUseCase } from '../../update-password.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

describe('UpdatePasswordUseCase integration tests', () => {
  const prismaService: PrismaClient = new PrismaClient()
  let sut: UpdatePasswordUseCase.UseCase
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
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throw an error when email already exists', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: '1234',
        password: 'newpassword',
      }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity._id}`),
    )
  })

  it('should throw an error if old password is not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: '',
        password: 'newpassword',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(`Old password and new password are required`),
    )
  })

  it('should throw an error if new password is not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: '11244',
        password: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(`Old password and new password are required`),
    )
  })

  it('should successfully update an users password', async () => {
    const oldPassword = await hashProvider.generateHash('12345')
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({
      id: entity._id,
      oldPassword: '12345',
      password: 'newpassword123',
    })

    const result = await hashProvider.compareHash(
      'newpassword123',
      output.password,
    )

    expect(result).toBeTruthy()
  })
})
