import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddUserToTransactions1703980800000 implements MigrationInterface {
  name = 'AddUserToTransactions1703980800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add userId column to transactions table
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'userId',
        type: 'integer',
        isNullable: false,
        default: 1, // Temporary default for existing records
      }),
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Remove the temporary default
    await queryRunner.changeColumn(
      'transactions',
      'userId',
      new TableColumn({
        name: 'userId',
        type: 'integer',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key
    const table = await queryRunner.getTable('transactions');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('transactions', foreignKey);
    }

    // Drop userId column
    await queryRunner.dropColumn('transactions', 'userId');
  }
}
