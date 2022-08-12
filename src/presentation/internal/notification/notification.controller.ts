import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class NotificationController {
  @Get('/index-by-user')
  indexByUser() {}

  @Post('/mark-as-read')
  markAsRead() {}

  @Post('/mark-as-read-by-batch')
  markAsReadByBatch() {}
}
