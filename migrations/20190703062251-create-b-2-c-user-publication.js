'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('b2c_user_publications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      user_id: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      client: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      publish_year: {
        type: Sequelize.STRING
      },
      catation: {
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      detail: {
        type: Sequelize.STRING
      },
      file_url: {
        type: Sequelize.STRING
      },
      create_date: {
        type: Sequelize.DATE
      },
      modify_date: {
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
    return queryInterface.dropTable('b2c_user_publications');
  }
};