'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('b2c_user_academic', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      user_id: {
        type: Sequelize.INTEGER
      },
      board: {
        type: Sequelize.STRING
      },
      organization: {
        type: Sequelize.STRING
      },
      degree_id: {
        type: Sequelize.INTEGER
      },
      stream_id: {
        type: Sequelize.INTEGER
      },
      marks_per: {
        type: Sequelize.STRING
      },
      created_date_time: {
        type: Sequelize.DATE
      },
      modified_date_time: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('b2c_user_academic');
  }
};