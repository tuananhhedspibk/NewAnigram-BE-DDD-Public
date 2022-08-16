import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeGenderOfUserDetailToEnum1660690903877
  implements MigrationInterface
{
  name = 'ChangeGenderOfUserDetailToEnum1660690903877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user_details` DROP COLUMN `gender`');
    await queryRunner.query(
      "ALTER TABLE `user_details` ADD `gender` enum ('Male', 'Female') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user_details` DROP COLUMN `gender`');
    await queryRunner.query(
      'ALTER TABLE `user_details` ADD `gender` varchar(255) NOT NULL',
    );
  }
}
