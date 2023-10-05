import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dto/user-output'
import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { SignupDto } from '../../dtos/sign-up.dto'

describe('UsersController', () => {
  let sut: UsersController
  let id: string
  let props: UserOutput

  beforeEach(async () => {
    sut = new UsersController()
    id = '993a09be-54d2-466a-adca-160109f18a46'
    props = {
      id,
      name: 'John Doe',
      createdAt: new Date(),
      email: 'john@doe.com',
      password: '12345',
    }
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should create an user', async () => {
    const output: SignupUseCase.Output = props
    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['signupUseCase'] = mockSignupUseCase as any

    const input: SignupDto = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '12345',
    }
    const result = await sut.create(input)

    expect(result).toStrictEqual(output)
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input)
  })
})
