import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759491175579 implements MigrationInterface {
  name = 'Migration1759491175579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items" RENAME COLUMN "quantity" TO "stock"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items" RENAME COLUMN "stock" TO "quantity"`,
    );
  }
}
