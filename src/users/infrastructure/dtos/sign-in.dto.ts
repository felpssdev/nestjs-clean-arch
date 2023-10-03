import { SignInUseCase } from '@/users/application/usecases/sign-in.usecase'

export class SigninDto implements SignInUseCase.Input {
  email: string
  password: string
}
