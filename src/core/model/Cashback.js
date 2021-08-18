module.exports = (sequelize, DataTypes) => {
  const Cashback = sequelize.define(
    'Cashback',
    {
      uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'uid',
      },
      value: {
        type: DataTypes.FLOAT,
        field: 'value',
      },
      percentage: {
        type: DataTypes.FLOAT,
        field: 'percentage',
      },
      purchaseUid: {
        type: DataTypes.UUID,
        field: 'purchase_uid',
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
      tableName: 'cashback',
      schema: 'public',
    }
  );

  Cashback.associate = (models) => {
    Cashback.hasOne(models.Purchase, {
      foreignKey: 'uid',
      targetKey: 'purchaseUid',
      as: 'purchase',
    });
  };

  return Cashback;
};
