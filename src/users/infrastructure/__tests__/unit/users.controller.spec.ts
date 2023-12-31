import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dto/user-output'
import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { SignupDto } from '../../dtos/sign-up.dto'
import { SignInUseCase } from '@/users/application/usecases/sign-in.usecase'
import { SigninDto } from '../../dtos/sign-in.dto'
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase'
import { UpdatePasswordDto } from '../../dtos/update-password.dto'
import { DeleteUserUseCase } from '@/users/application/usecases/delete-user.usecase'
import { GetUserUseCase } from '@/users/application/usecases/getuser.usecase'
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase'
import { ListUsersDto } from '../../dtos/list-users.dto'
import { UserPresenter } from '../../presenters/user.presenter'

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
    const presenter = await sut.create(input)

    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
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
    const presenter = await sut.login(input)

    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should update an user', async () => {
    const output: UpdateUserUseCase.Output = props
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['updateUserUseCase'] = mockUpdateUserUseCase as any

    const input: UpdateUserDto = {
      name: 'New Name',
    }

    const presenter = await sut.update(id, input)

    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({ id, ...input })
  })

  it('should update an users password', async () => {
    const output: UpdatePasswordUseCase.Output = props
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any

    const input: UpdatePasswordDto = {
      password: 'newpassword',
      oldPassword: '1234',
    }
    const presenter = await sut.updatePassword(id, input)

    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    })
  })

  it('should delete an user', async () => {
    const output: DeleteUserUseCase.Output = undefined
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any

    const result = await sut.remove(id)

    expect(result).toStrictEqual(output)
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id })
  })

  it('should get an user', async () => {
    const output: GetUserUseCase.Output = props
    const mockGetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['getUserUseCase'] = mockGetUserUseCase as any

    const presenter = await sut.findOne(id)

    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id })
  })

  it('should list users', async () => {
    const output: ListUsersUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    }
    const mockListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['listUsersUseCase'] = mockListUsersUseCase as any

    const searchParams: ListUsersDto = {
      page: 1,
      perPage: 1,
    }
    const result = await sut.search(searchParams)

    expect(result).toStrictEqual(output)
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(searchParams)
  })
})
