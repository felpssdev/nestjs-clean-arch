import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dto/user-output'
import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { SignupDto } from '../../dtos/sign-up.dto'
import { SignInUseCase } from '@/users/application/usecases/sign-in.usecase'
import { SigninDto } from '../../dtos/sign-in.dto'

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

  it('should authenticate an user', async () => {
    const output: SignInUseCase.Output = props
    const mockSignInUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['signinUseCase'] = mockSignInUseCase as any

    const input: SigninDto = {
      email: 'john@doe.com',
      password: '12345',
    }
    const result = await sut.login(input)

    expect(result).toStrictEqual(output)
    expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input)
  })
})
