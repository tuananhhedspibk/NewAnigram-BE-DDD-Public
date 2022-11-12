/* eslint-disable @typescript-eslint/no-unused-vars */

import { HTTP_STATUS } from '@constants/http-status';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import CheckPasswordUsecase, {
  CheckPasswordUsecaseInput,
  CheckPasswordUsecaseOutput,
} from '@usecase/user/check-password';
import UpdateUserProfileUsecase, {
  UpdateUserProfileUsecaseInput,
  UpdateUserProfileUsecaseOutput,
} from '@usecase/user/update-profile';
import { UserProfileDto } from '@view/dto/user-profile-dto';
import UserProfileView from '@view/user-profile-view';

@ApiTags('internal/user')
@ApiBearerAuth()
@Controller('internal/user')
export class UserController {
  constructor(
    private readonly checkPasswordUsecase: CheckPasswordUsecase,
    private readonly userProfileView: UserProfileView,
    private readonly updateUserProfileUsecase: UpdateUserProfileUsecase,
  ) {}

  @Post('/check-password')
  @HttpCode(HTTP_STATUS.OK)
  @ApiOperation({
    summary: 'Check password API',
    description: 'Check password API',
  })
  @ApiBody({
    description: 'Check password payload',
    type: CheckPasswordUsecaseInput,
  })
  @ApiResponse({
    description: 'Check password response',
    type: CheckPasswordUsecaseOutput,
  })
  checkPassword(@Body() input, @Req() request: { user: { email: string } }) {
    return this.checkPasswordUsecase.execute(input, request.user.email);
  }

  @Get('/profile')
  @ApiOperation({
    summary: 'Get users profile',
    description: 'Get users profile',
  })
  @ApiResponse({
    description: 'Get user profile API response',
    type: UserProfileDto,
  })
  profile(@Req() request: { user: { userId: number } }) {
    return this.userProfileView.getUserProfile(request.user.userId);
  }

  @Put('/update-profile')
  @ApiOperation({
    summary: 'Update users profile',
    description: 'Update users profile',
  })
  @ApiBody({
    description: 'Update user profile data payload',
    type: UpdateUserProfileUsecaseInput,
    required: true,
  })
  @ApiResponse({
    description: 'Update user profile API response',
    type: UpdateUserProfileUsecaseOutput,
  })
  updateProfile(
    @Body() payload: UpdateUserProfileUsecaseInput,
    @Req() request: { user: { userId: number } },
  ) {
    return this.updateUserProfileUsecase.execute(payload, request.user.userId);
  }

  // @Post('/follow')
  // @ApiOperation({
  //   summary: 'Follow user',
  //   description: 'Follow user',
  // })
  // follow() {}

  // @Delete('/unfollow/:userId')
  // @ApiOperation({
  //   summary: 'Unfollow user',
  //   description: 'Unfollow user',
  // })
  // unfollow() {}
}
