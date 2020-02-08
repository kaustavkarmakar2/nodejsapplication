'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('b2c_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      photo_sm: {
        type: Sequelize.STRING
      },
      photo_sm: {
        type: Sequelize.STRING
      },
      dateofbirth: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.STRING
      },
      martialstatus: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      alt_email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.INTEGER
      },
      alt_phone: {
        type: Sequelize.INTEGER
      },
      bloodgroup: {
        type: Sequelize.STRING
      },
      aadhar_no: {
        type: Sequelize.STRING
      },
      bloodgroup: {
        type: Sequelize.STRING
      },
      aadhar_no: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      pin: {
        type: Sequelize.INTEGER
      },
      facebook_link: {
        type: Sequelize.STRING
      },
      linkedin_link: {
        type: Sequelize.STRING
      },
      google_link: {
        type: Sequelize.STRING
      },
      mothertongue: {
        type: Sequelize.STRING
      },
      about_me: {
        type: Sequelize.STRING
      },
      resume_heading: {
        type: Sequelize.STRING
      },
      expected_ctc: {
        type: Sequelize.INTEGER
      },
      caste: {
        type: Sequelize.STRING
      },
      physical_challenge: {
        type: Sequelize.STRING
      },
      percentage_ph: {
        type: Sequelize.STRING
      },
      passport_no: {
        type: Sequelize.STRING
      },
      fathers_name: {
        type: Sequelize.STRING
      },
      fathers_occupation: {
        type: Sequelize.STRING
      },
      mothers_occupation: {
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
      },
      isVerified: {
        type: Sequelize.BOOLEAN
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('b2c_users');
  }
};