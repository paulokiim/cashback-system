module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    'Purchase',
    {
      uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'uid',
      },
      code: {
        type: DataTypes.STRING,
        field: 'code',
      },
      value: {
        type: DataTypes.FLOAT,
        field: 'value',
      },
      status: {
        type: DataTypes.STRING,
        field: 'status',
      },
      documentNumber: {
        type: DataTypes.STRING,
        field: 'document_number',
      },
      purchaseDate: {
        type: DataTypes.DATE,
        field: 'purchase_date',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    {
      tableName: 'purchase',
      schema: 'public',
    }
  );

  Purchase.associate = (models) => {
    Purchase.hasOne(models.User, {
      foreignKey: 'documentNumber',
      targetKey: 'document_number',
      as: 'user',
    });
  };

  return Purchase;
};
