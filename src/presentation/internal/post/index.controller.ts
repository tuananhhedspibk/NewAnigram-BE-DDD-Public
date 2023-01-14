/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import CommentPostUsecase, {
  CommentPostUsecaseInput,
  CommentPostUsecaseOutput,
} from '@usecase/post/comment';
import CreatePostUsecase, {
  CreatePostUsecaseInput,
  CreatePostUsecaseOutput,
} from '@usecase/post/create';
import DeletePostUsecase, {
  DeletePostUsecaseOutput,
} from '@usecase/post/delete';
import LikePostUsecase, { LikePostUsecaseOutput } from '@usecase/post/like';
import UnlikePostUsecase, {
  UnlikePostUsecaseOutput,
} from '@usecase/post/unlike';
import UpdatePostUsecase, {
  UpdatePostUsecaseInput,
  UpdatePostUsecaseOutput,
} from '@usecase/post/update';
import { uploadImageFilter } from '@utils/file';

@ApiTags('internal/posts')
@ApiBearerAuth()
@Controller('internal/post')
export class PostController {
  constructor(
    private readonly createPostUsecase: CreatePostUsecase,
    private readonly updatePostUsecase: UpdatePostUsecase,
    private readonly deletePostUsecase: DeletePostUsecase,
    private readonly likePostUsecase: LikePostUsecase,
    private readonly unlikePostUsecase: UnlikePostUsecase,
    private readonly commentPostUsecase: CommentPostUsecase,
  ) {}

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

  @Put('/update')
  @ApiOperation({
    summary: 'Update post',
    description: 'Update post',
  })
  @ApiBody({
    description: 'Update post payload',
    type: UpdatePostUsecaseInput,
    required: true,
  })
  @ApiResponse({
    description: 'Update post API response',
    type: UpdatePostUsecaseOutput,
  })
  update(
    @Body() payload: UpdatePostUsecaseInput,
    @Req() request: { user: { userId: number } },
  ) {
    return this.updatePostUsecase.execute(payload, request.user.userId);
  }

  @Delete('/:postId/delete/')
  @ApiOperation({
    summary: 'Delete post by id',
    description: 'Delete post by id',
  })
  @ApiParam({
    description: 'Delete post API Query param',
    type: Number,
    name: 'postId',
  })
  @ApiResponse({
    description: 'Delete post API response',
    type: DeletePostUsecaseOutput,
  })
  delete(
    @Param('postId') postId: string,
    @Req() request: { user: { userId: number } },
  ) {
    return this.deletePostUsecase.execute(
      { id: parseInt(postId) },
      request.user.userId,
    );
  }

  @Post('/:postId/like/')
  @ApiOperation({
    summary: 'Like post',
    description: 'Like post',
  })
  @ApiParam({
    description: 'Like post API Query Param',
    type: Number,
    name: 'postId',
  })
  @ApiResponse({
    description: 'Like post API response',
    type: LikePostUsecaseOutput,
  })
  like(
    @Param('postId') postId: string,
    @Req() request: { user: { userId: number } },
  ) {
    return this.likePostUsecase.execute(
      { postId: parseInt(postId) },
      request.user.userId,
    );
  }

  @Delete('/:postId/unlike/')
  @ApiOperation({
    summary: 'Unlike post API',
    description: 'Unlike post API',
  })
  @ApiParam({
    description: 'Unlike post API Query Param',
    type: Number,
    name: 'postId',
  })
  @ApiResponse({
    description: 'Unlike post API response',
    type: UnlikePostUsecaseOutput,
  })
  unlike(
    @Param('postId') postId: string,
    @Req() request: { user: { userId: number } },
  ) {
    return this.unlikePostUsecase.execute(
      { postId: parseInt(postId) },
      request.user.userId,
    );
  }

  @Post('/:postId/comment')
  @ApiOperation({
    summary: 'Create posts comment API',
    description: 'Create posts comment API',
  })
  @ApiParam({
    description: 'Create posts comment Query param',
    type: Number,
    name: 'postId',
  })
  @ApiBody({
    description: 'Create posts comment API body',
    type: CommentPostUsecaseInput,
    required: true,
  })
  @ApiResponse({
    description: 'Create posts comment API response',
    type: CommentPostUsecaseOutput,
  })
  comment(
    @Param('postId') postId: string,
    @Body() payload: CommentPostUsecaseInput,
    @Req() request: { user: { userId: number } },
  ) {
    return this.commentPostUsecase.execute(payload, {
      postId: parseInt(postId),
      userId: request.user.userId,
    });
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
  // @Delete('/delete-comment')
  // @ApiOperation({
  //   summary: 'Delete posts comment',
  //   description: 'Delete posts comment',
  // })
  // deleteComment() {}
}
