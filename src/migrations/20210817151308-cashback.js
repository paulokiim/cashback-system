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
        type: Sequelize.DECIMAL,
      },
      percentage: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      purchase_uid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'purchase',
          },
          key: 'uid',
        },
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
