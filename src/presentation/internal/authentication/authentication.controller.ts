import { Controller, Post } from '@nestjs/common';

@Controller('/authentication')
export class AuthenticationController {
  @Post('/sign-in')
  signIn() {}

  @Post('/sign-up')
  signUp() {}
}
