import { PrismaClient, User } from '@prisma/client'
import { UserModelMapper } from '../../user-model.mapper'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    setupPrismaTests()

    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()
    props = {
      id: '993a09be-54d2-466a-adca-160109f18a46',
      name: 'Isaac Lambiskn',
      email: 'baa@a.com',
      password: '12345',
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('should throw an error when user model is invalid', async () => {
    const model: User = Object.assign(props, { name: null })
    expect(() => UserModelMapper.toEntity(model)).toThrowError(ValidationError)
  })

  it('should convert successfully an user model to an user entity', async () => {
    const model: User = await prismaService.user.create({
      data: props,
    })
    const sut = UserModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf(UserEntity)
    expect(sut.toJSON()).toStrictEqual(props)
  })
})
