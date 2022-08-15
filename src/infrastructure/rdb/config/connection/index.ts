import { TypeOrmModule } from '@nestjs/typeorm';

import CustomNamingStrategy from '../typeorm-custom-name-strategy';
import RDBConfig from '../../';

const getConnection = () => {
  const entities = [
    'User',
    'UserDetail',
    'Post',
    'Like',
    'Comment',
    'Follow',
    'Notification',
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
