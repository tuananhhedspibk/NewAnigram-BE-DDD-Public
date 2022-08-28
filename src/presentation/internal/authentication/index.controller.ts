import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS } from '@constants/http-status';
import SigninUsecase, {
  SigninUsecaseInput,
  SigninUsecaseOutput,
} from '@usecase/authentication/signin';
import SignupUsecase, {
  SignupUsecaseInput,
  SignupUsecaseOutput,
} from '@usecase/authentication/signup';

@ApiTags('internal/auth')
@Controller('internal/auth')
export class AuthenticationController {
  constructor(
    private readonly signinUsecase: SigninUsecase,
    private readonly signupUsecase: SignupUsecase,
  ) {}

  @Post('/sign-in')
  @HttpCode(HTTP_STATUS.OK)
  @ApiOperation({
    summary: 'Sign in API',
    description: 'Sign in API',
  })
  @ApiBody({
    description: 'Sign in payload',
    type: SigninUsecaseInput,
  })
  @ApiResponse({
    description: 'Sign in response',
    type: SigninUsecaseOutput,
  })
  signIn(@Body() input: SigninUsecaseInput): Promise<SigninUsecaseOutput> {
    return this.signinUsecase.execute(input);
  }

  @Post('/sign-up')
  @HttpCode(HTTP_STATUS.OK)
  @ApiOperation({
    summary: 'Sign up API',
    description: 'Sign up API',
  })
  @ApiBody({
    description: 'Sign up payload',
    type: SignupUsecaseInput,
  })
  @ApiResponse({
    description: 'Sign up response',
    type: SignupUsecaseOutput,
  })
  signUp(@Body() input: SignupUsecaseInput): Promise<SignupUsecaseOutput> {
    return this.signupUsecase.execute(input);
  }
}
