import { PrismaClient } from '@prisma/client'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserPrismaReposity } from '../../user-prisma-repository'
import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { SearchResult } from '@/shared/repositories/searchable-repository-contracts'

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

  it('should successfully insert an entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    const result = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })

    expect(result).toStrictEqual(entity.toJSON())
  })

  it('should successfully return all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })
    const output = await sut.findAll()

    output.map(item => {
      expect(item.toJSON()).toStrictEqual(entity.toJSON())
    })
  })

  it('should throw an error when updating an entity by non existent id', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity.id}`),
    )
  })

  it('should successfully update an entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    entity.updateName('new name')

    await sut.update(entity)

    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(output.name).toStrictEqual('new name')
  })

  it('should throw an error when deleting an entity by non existent id', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    expect(() => sut.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity.id}`),
    )
  })

  it('should successfully delete an entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await sut.delete(entity._id)

    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(output).toBeNull()
  })

  describe('search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = Array(16).fill(UserDataBuilder({}))
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            name: `User${index}`,
            email: `test${index}@email.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({
        data: entities.map(entity => entity.toJSON()),
      })

      const searchOutput = await sut.search(new UserRepository.SearchParams())
      const items = searchOutput.items

      expect(searchOutput).toBeInstanceOf(SearchResult)
      expect(searchOutput.total).toBe(16)
      expect(searchOutput.items.length).toBe(15)
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(UserEntity)
      })
      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@email.com`).toBe(item.email)
      })
    })

    it('should apply sort, pagination and filter', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({
        data: entities.map(entity => entity.toJSON()),
      })

      const searchOutputPage1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage1.items[0].toJSON()).toStrictEqual(
        entities[0].toJSON(),
      )

      expect(searchOutputPage1.items[1].toJSON()).toStrictEqual(
        entities[4].toJSON(),
      )

      const searchOutputPage2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage2.items[0].toJSON()).toStrictEqual(
        entities[2].toJSON(),
      )
    })
  })
})
