module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      documentNumber: {
        type: DataTypes.STRING,
        primaryKey: true,
        field: 'document_number',
      },
      fullName: {
        type: DataTypes.STRING,
        field: 'full_name',
      },
      password: {
        type: DataTypes.STRING,
        field: 'password',
      },
      email: {
        type: DataTypes.STRING,
        field: 'email',
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
      tableName: 'users',
      schema: 'public',
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Purchase, {
      foreignKey: 'documentNumber',
    });
  };

  return User;
};
