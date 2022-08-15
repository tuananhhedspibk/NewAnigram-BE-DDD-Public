/* eslint-disable @typescript-eslint/no-var-requires */
const pluralize = require('pluralize');
const DefaultNamingStrategy = require('typeorm').DefaultNamingStrategy;
const snakeCase = require('typeorm/util/StringUtils').snakeCase;

class CustomNamingStrategy extends DefaultNamingStrategy {
  tableName(targetName, userSpecifiedName) {
    return userSpecifiedName
      ? userSpecifiedName
      : pluralize.plural(snakeCase(targetName));
  }

  columnName(propertyName, customName, embeddedPrefixes) {
    return customName ? customName : snakeCase(propertyName);
  }

  joinColumnName(relationName, referencedColumnName) {
    return snakeCase(
      pluralize.singular(relationName) + '_' + referencedColumnName,
    );
  }

  joinTableName(
    firstTableName,
    secondTableName,
    firstPropertyName,
    secondPropertyName,
  ) {
    return snakeCase(firstTableName + '_' + secondTableName);
  }

  joinTableColumnName(tableName, propertyName, columnName) {
    return snakeCase(
      pluralize.singular(tableName) + '_' + (columnName || propertyName),
    );
  }
}

module.exports = [
  {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'newanigram',
    entities: ['src/infrastructure/rdb/entities/**.ts'],
    migrations: ['src/infrastructure/rdb/migration/**/*.ts'],
    timezone: 'Z',
    synchronize: false,
    logging: true,
    // logger: TypeormCustomLogger, → TODO: need to be configured
    namingStrategy: new CustomNamingStrategy(),
    migrationsTableName: 'migrations',
    cli: {
      migrationsDir: 'src/infrastructure/rdb/migration',
    },
  },
  {
    name: 'seed',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'newanigram',
    entities: ['src/infrastructure/rdb/entities/**.ts'],
    migrations: ['src/infrastructure/rdb/seed/**/*.ts'],
    timezone: 'Z',
    synchronize: false,
    logging: true,
    // logger: TypeormCustomLogger, → TODO: need to be configured
    namingStrategy: new CustomNamingStrategy(),
    cli: {
      migrationsDir: 'src/infrastructure/rdb/seed',
    },
  },
];
