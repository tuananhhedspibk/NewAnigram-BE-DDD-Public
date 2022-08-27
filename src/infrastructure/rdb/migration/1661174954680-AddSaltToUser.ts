import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSaltToUser1661174954680 implements MigrationInterface {
  name = 'AddSaltToUser1661174954680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` ADD `salt` varchar(255) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `salt`');
  }
}
