'use strict';
module.exports = (sequelize, DataTypes) => {
  const b2c_user = sequelize.define('b2c_user', {
    id:{ 
      
        type: DataTypes.INTEGER,
        primaryKey: true,
        // allowNull: true,
        autoIncrement: true,
        // field: "id"
      
      },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    photo_sm: DataTypes.STRING,
    photo_sm: DataTypes.STRING,
    dateofbirth: DataTypes.DATE,
    gender: DataTypes.STRING,
    // martialstatus: DataTypes.STRING,
    email: DataTypes.STRING,
    alt_email: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    alt_phone: DataTypes.INTEGER,
    bloodgroup: DataTypes.STRING,
    aadhar_no: DataTypes.STRING,
    bloodgroup: DataTypes.STRING,
    aadhar_no: DataTypes.STRING,
    website: DataTypes.STRING,
    pin: DataTypes.INTEGER,
    facebook_link: DataTypes.STRING,
    linkedin_link: DataTypes.STRING,
    google_link: DataTypes.STRING,
    mothertongue: DataTypes.STRING,
    about_me: DataTypes.STRING,
    resume_heading: DataTypes.STRING,
    expected_ctc: DataTypes.INTEGER,
    caste: DataTypes.STRING,
    physical_challenge: DataTypes.STRING,
    percentage_ph: DataTypes.STRING,
    passport_no: DataTypes.STRING,
    fathers_name: DataTypes.STRING,
    fathers_occupation: DataTypes.STRING,
    mothers_occupation: DataTypes.STRING,
    created_date_time: DataTypes.DATE,
    modified_date_time: DataTypes.DATE,
    password_users: DataTypes.STRING,
    isverified: DataTypes.BOOLEAN,
    token: DataTypes.STRING
  },
  // {
  //   classMethods: {
  //     associate: function(models) {
  //       b2c_user.hasOne(models.VerificationTokens, {
  //           as: 'VericationTokens',
  //           foreignKey: 'userId',
  //           foreignKeyConstraint: true,
  //         });
  //     }
  //   }
  // },
  {timestamps:false,freezeTableName:true});
  b2c_user.associate = function(models) {
    // associations can be defined here
    
    // b2c_user.hasMany(Channels, {foreignKey: 'id'});
    //  b2c_user.hasOne(models.VericationTokens, {targetKey:'id',foreignKey: 'userId',foreignKeyConstraint: true});

  };
  return b2c_user;
};