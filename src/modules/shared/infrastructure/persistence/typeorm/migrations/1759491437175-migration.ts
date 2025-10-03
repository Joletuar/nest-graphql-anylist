import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759491437175 implements MigrationInterface {
  name = 'Migration1759491437175';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE "items" CASCADE');
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_3b934e62fb52bac909e0ddf5422"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_3b934e62fb52bac909e0ddf5422" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_3b934e62fb52bac909e0ddf5422"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_3b934e62fb52bac909e0ddf5422" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD "userId" character varying NOT NULL`,
    );
  }
}
