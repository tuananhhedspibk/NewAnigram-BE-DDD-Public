/* eslint-disable @typescript-eslint/no-unused-vars */

import { HTTP_STATUS } from '@constants/http-status';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import FollowUserUsecase, {
  FollowUserUsecaseOutput,
} from '@usecase/user/follow';
import UpdatePasswordUsecase, {
  UpdatePasswordUsecaseInput,
  UpdatePasswordUsecaseOutput,
} from '@usecase/user/update-password';
import UpdateUserProfileUsecase, {
  UpdateUserProfileUsecaseInput,
  UpdateUserProfileUsecaseOutput,
} from '@usecase/user/update-profile';
import { uploadImageFilter } from '@utils/file';
import { UserProfileDto } from '@view/dto/user-profile-dto';
import UserProfileView from '@view/user-profile-view';

@ApiTags('internal/user')
@ApiBearerAuth()
@Controller('internal/user')
export class UserController {
  constructor(
    private readonly updatePasswordUsecase: UpdatePasswordUsecase,
    private readonly updateUserProfileUsecase: UpdateUserProfileUsecase,
    private readonly followUserUsecase: FollowUserUsecase,
    private readonly userProfileView: UserProfileView,
  ) {}

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
  @ApiConsumes('multipart/form-data')
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
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 5000000, // maxSize: 5MB = 5 * 10^6 Byte
      },
      fileFilter: uploadImageFilter,
    }),
  )
  updateProfile(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() payload: UpdateUserProfileUsecaseInput,
    @Req() request: { user: { userId: number } },
  ) {
    return this.updateUserProfileUsecase.execute(
      { ...payload, avatar },
      request.user.userId,
    );
  }

  @Post('/update-password')
  @HttpCode(HTTP_STATUS.OK)
  @ApiOperation({
    summary: 'Update password API',
    description: 'Update password API',
  })
  @ApiBody({
    description: 'Update password data payload',
    type: UpdatePasswordUsecaseInput,
    required: true,
  })
  @ApiResponse({
    description: 'Update password API response',
    type: UpdatePasswordUsecaseOutput,
  })
  updatePassword(
    @Body() payload: UpdatePasswordUsecaseInput,
    @Req() request: { user: { userId: number } },
  ) {
    return this.updatePasswordUsecase.execute(payload, request.user.userId);
  }

  @Post('/follow/:userId')
  @ApiOperation({
    summary: 'Follow user API',
    description: 'Follow user API',
  })
  @ApiParam({
    description: 'Query params',
    type: Number,
    name: 'userId',
  })
  @ApiResponse({
    description: 'Follow user API Response',
    type: FollowUserUsecaseOutput,
  })
  follow(
    @Param('userId') userId: string,
    @Req() request: { user: { userId: number } },
  ) {
    return this.followUserUsecase.execute(
      { destinationUserId: parseInt(userId) },
      request.user.userId,
    );
  }

  // @Delete('/unfollow/:userId')
  // @ApiOperation({
  //   summary: 'Unfollow user',
  //   description: 'Unfollow user',
  // })
  // unfollow() {}
}
