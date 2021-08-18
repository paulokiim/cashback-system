'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('cashback', {
      uid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      value: {
        allowNull: false,
        type: Sequelize.FLOAT,
        unique: true,
      },
      percentage: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      purchase_uid: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'purchase',
          },
          key: 'uid',
        },
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cashback');
  },
};
