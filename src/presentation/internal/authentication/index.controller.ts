import { Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/authentication')
export class AuthenticationController {
  @Post('/sign-in')
  @ApiOperation({
    summary: 'Sign in API',
    description: 'Sign in API',
  })
  signIn() {}

  @Post('/sign-up')
  @ApiOperation({
    summary: 'Sign up API',
    description: 'Sign up API',
  })
  signUp() {}
}
