import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateNotification1660690004262 implements MigrationInterface {
    name = 'CreateNotification1660690004262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `notifications` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `owner_id` int NOT NULL, `source_user_id` int NOT NULL, `content` varchar(255) NOT NULL, `post_id` int NULL, `type` enum ('FollowNotify', 'PostLikeNotify', 'PostCommentNotify') NOT NULL, `read` tinyint NOT NULL, `image` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `notifications` ADD CONSTRAINT `FK_ce0f8e6bad510067df0713f30c2` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `notifications` ADD CONSTRAINT `FK_3aae7402d743b2487a71abc1f2a` FOREIGN KEY (`source_user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `notifications` DROP FOREIGN KEY `FK_3aae7402d743b2487a71abc1f2a`");
        await queryRunner.query("ALTER TABLE `notifications` DROP FOREIGN KEY `FK_ce0f8e6bad510067df0713f30c2`");
        await queryRunner.query("DROP TABLE `notifications`");
    }

}
