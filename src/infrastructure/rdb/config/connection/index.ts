import { TypeOrmModule } from '@nestjs/typeorm';

import CustomNamingStrategy from '../typeorm-custom-name-strategy';
import RDBConfig from '../../';

import User from '@infrastructure/rdb/entities/user';
import UserDetail from '@infrastructure/rdb/entities/user-detail';
import Post from '@infrastructure/rdb/entities/post';
import Like from '@infrastructure/rdb/entities/like';
import Comment from '@infrastructure/rdb/entities/comment';
import Follow from '@infrastructure/rdb/entities/follow';
import Notification from '@infrastructure/rdb/entities/notification';

const getConnection = () => {
  const entities = [
    User,
    UserDetail,
    Post,
    Like,
    Comment,
    Follow,
    Notification,
  ];

  return TypeOrmModule.forRoot({
    type: RDBConfig.type,
    host: RDBConfig.host,
    port: RDBConfig.port,
    username: RDBConfig.username,
    password: RDBConfig.password,
    database: RDBConfig.database,
    entities,
    timezone: 'Z',
    synchronize: false,
    logging: true,
    // logger: TypeormCustomLogger, → TODO: need to be configured
    namingStrategy: new CustomNamingStrategy(),
  });
};

export const connection = getConnection();
