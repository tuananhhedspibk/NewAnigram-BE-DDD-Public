/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import CreatePostUsecase, {
  CreatePostUsecaseInput,
  CreatePostUsecaseOutput,
} from '@usecase/post/create';
import { uploadImageFilter } from '@utils/file';

@ApiTags('internal/posts')
@ApiBearerAuth()
@Controller('internal/post')
export class PostController {
  constructor(private readonly createPostUsecase: CreatePostUsecase) {}

  // Max number of pictures: 10, max size of picture: 5MB -> Max Size of Payload: 50MB
  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create post',
    description: 'Create post',
  })
  @ApiBody({
    description: 'Create post data payload',
    type: CreatePostUsecaseInput,
    required: true,
  })
  @ApiResponse({
    description: 'Create post API response',
    type: CreatePostUsecaseOutput,
  })
  @UseInterceptors(
    FilesInterceptor('images', null, {
      limits: {
        fileSize: 5000000, // 50000000 Bytes = 5MB - max size for each picture
      },
      fileFilter: uploadImageFilter,
    }),
  )
  create(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() payload: CreatePostUsecaseInput,
    @Req() request: { user: { userId: number } },
  ) {
    return this.createPostUsecase.execute(
      { ...payload, images },
      request.user.userId,
    );
  }

  // @Get('/index-by-user')
  // @ApiOperation({
  //   summary: 'Get users all posts',
  //   description: 'Get users all posts',
  // })
  // indexByUser() {}
  // @Get('/detail/:id')
  // @ApiOperation({
  //   summary: 'Get post detail by posts id',
  //   description: 'Get post detail by posts id',
  // })
  // detail() {}
  // @Post('/comment')
  // @ApiOperation({
  //   summary: 'Create posts comment',
  //   description: 'Create posts comment',
  // })
  // comment() {}
  // @Post('/like')
  // @ApiOperation({
  //   summary: 'Like post',
  //   description: 'Like post',
  // })
  // like() {}
  // @Put('/update')
  // @ApiOperation({
  //   summary: 'Update post',
  //   description: 'Update post',
  // })
  // update() {}
  // @Delete('/dislike')
  // @ApiOperation({
  //   summary: 'Dislike post',
  //   description: 'Dislike post',
  // })
  // dislike() {}
  // @Delete('/delete/:id')
  // @ApiOperation({
  //   summary: 'Delete post by id',
  //   description: 'Delete post by id',
  // })
  // delete() {}
  // @Delete('/delete-comment')
  // @ApiOperation({
  //   summary: 'Delete posts comment',
  //   description: 'Delete posts comment',
  // })
  // deleteComment() {}
}
