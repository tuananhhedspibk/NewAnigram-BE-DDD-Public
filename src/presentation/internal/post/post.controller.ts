import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('/posts')
export class PostController {
  @Get('/index-by-user')
  indexByUser() {}

  @Get('/detail')
  detail() {}

  @Post('/create')
  create() {}

  @Post('/comment')
  comment() {}

  @Post('/like')
  like() {}

  @Put('/update')
  update() {}

  @Delete('/dislike')
  dislike() {}

  @Delete('/delete')
  delete() {}

  @Delete('/delete-comment')
  deleteComment() {}
}
