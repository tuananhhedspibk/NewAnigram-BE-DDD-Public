import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('internal/posts')
@Controller('internal/post')
export class PostController {
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
  // @Post('/create')
  // @ApiOperation({
  //   summary: 'Create post',
  //   description: 'Create post',
  // })
  // create() {}
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
