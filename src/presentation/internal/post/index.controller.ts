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
  ApiProperty,
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
import DeletePostCommentUsecase, {
  DeletePostCommentUsecaseOutput,
} from '@usecase/post/delete-comment';
import LikePostUsecase, { LikePostUsecaseOutput } from '@usecase/post/like';
import UnlikePostUsecase, {
  UnlikePostUsecaseOutput,
} from '@usecase/post/unlike';
import UpdatePostUsecase, {
  UpdatePostUsecaseInput,
  UpdatePostUsecaseOutput,
} from '@usecase/post/update';
import UpdatePostCommentUsecase, {
  UpdatePostCommentUsecaseOutput,
} from '@usecase/post/update-comment';
import { uploadImageFilter } from '@utils/file';
import PostDetailView from '@view/post-detail-view';

class UpdatePostCommentApiBodyParams {
  @ApiProperty({
    description: 'Comment content',
    type: String,
    required: true,
  })
  content: string;
}

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
    private readonly updatePostCommentUsecase: UpdatePostCommentUsecase,
    private readonly deletePostCommentUsecase: DeletePostCommentUsecase,
    private readonly postDetailView: PostDetailView,
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

  @Put('/:postId/comment/:commentId')
  @ApiOperation({
    summary: 'Update posts comment API',
    description: 'Update posts comment API',
  })
  @ApiParam({
    description: 'Post id',
    type: Number,
    name: 'postId',
  })
  @ApiParam({
    description: 'Comment id',
    type: Number,
    name: 'commentId',
  })
  @ApiBody({
    description: 'Comment content',
    type: UpdatePostCommentApiBodyParams,
  })
  @ApiResponse({
    description: 'Update posts comment API Response',
    type: UpdatePostCommentUsecaseOutput,
  })
  updateComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() payload: UpdatePostCommentApiBodyParams,
    @Req() request: { user: { userId: number } },
  ) {
    return this.updatePostCommentUsecase.execute(
      {
        postId: parseInt(postId),
        commentId: parseInt(commentId),
        content: payload.content,
      },
      request.user.userId,
    );
  }

  @Delete('/:postId/comment/:commentId')
  @ApiOperation({
    summary: 'Delete posts comment API',
    description: 'Delete posts comment API',
  })
  @ApiParam({
    description: 'Post id',
    type: Number,
    name: 'postId',
  })
  @ApiParam({
    description: 'Comment id',
    type: Number,
    name: 'commentId',
  })
  @ApiResponse({
    description: 'Delete posts comment API Response',
    type: DeletePostCommentUsecaseOutput,
  })
  deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Req() request: { user: { userId: number } },
  ) {
    return this.deletePostCommentUsecase.execute(
      { postId: parseInt(postId), commentId: parseInt(commentId) },
      request.user.userId,
    );
  }

  @Get(':id/detail')
  @ApiOperation({
    summary: 'Get post detail by posts id',
    description: 'Get post detail by posts id',
  })
  @ApiParam({
    description: 'Get post detail API Query Param',
    type: Number,
    name: 'id',
  })
  detail(@Param('id') id: string) {
    return this.postDetailView.getPostDetail(parseInt(id));
  }

  // @Get('/index-by-user')
  // @ApiOperation({
  //   summary: 'Get users all posts',
  //   description: 'Get users all posts',
  // })
  // indexByUser() {}
}
