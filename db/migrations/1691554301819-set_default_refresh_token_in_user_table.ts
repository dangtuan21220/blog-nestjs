import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultRefreshTokenInUserTable1691554301819 implements MigrationInterface {
    name = 'SetDefaultRefreshTokenInUserTable1691554301819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
