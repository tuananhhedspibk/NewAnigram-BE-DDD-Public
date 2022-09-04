import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('internal/user')
@ApiBearerAuth()
@Controller('internal/user')
export class UserController {
  @Get('/profile')
  @ApiOperation({
    summary: 'Get users profile',
    description: 'Get users profile',
  })
  profile() {}

  @Put('/update-profile')
  @ApiOperation({
    summary: 'Update users profile',
    description: 'Update users profile',
  })
  updateProfile() {}

  @Post('/follow')
  @ApiOperation({
    summary: 'Follow user',
    description: 'Follow user',
  })
  follow() {}

  @Delete('/unfollow/:userId')
  @ApiOperation({
    summary: 'Unfollow user',
    description: 'Unfollow user',
  })
  unfollow() {}
}
