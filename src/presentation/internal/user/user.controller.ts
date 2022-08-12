import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('/users')
export class UserController {
  @Get('/profile')
  profile() {}

  @Put('/update-profile')
  updateProfile() {}

  @Delete('/unfollow')
  unfollow() {}

  @Post('/follow')
  follow() {}
}
