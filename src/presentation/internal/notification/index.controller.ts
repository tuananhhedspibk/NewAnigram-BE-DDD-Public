import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class NotificationController {
  @Get('/index-by-user')
  @ApiOperation({
    summary: 'Get users notifications',
    description: 'Get users notifications',
  })
  indexByUser() {}

  @Post('/mark-as-read')
  @ApiOperation({
    summary: 'Mark users notification as read',
    description: 'Mark users notification as read',
  })
  markAsRead() {}

  @Post('/mark-as-read-by-batch')
  @ApiOperation({
    summary: 'Mark users notification as read by batch (max = 25)',
    description: 'Mark users notification as read by batch (max = 25)',
  })
  markAsReadByBatch() {}
}
