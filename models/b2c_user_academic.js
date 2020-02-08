'use strict';
module.exports = (sequelize, DataTypes) => {
  const b2c_user_academic = sequelize.define('b2c_user_academic', {
    id:{
      type: DataTypes.INTEGER,      
      primaryKey: true
    }, 
    user_id: DataTypes.INTEGER,
    board: DataTypes.STRING,
    organization: DataTypes.STRING,
    degree_id: DataTypes.INTEGER,
    stream_id: DataTypes.INTEGER,
    marks_per: DataTypes.STRING,
    // created_date_time: DataTypes.DATE,
    modified_date_time: DataTypes.DATE
  }, {timestamps:false,freezeTableName:true});
  b2c_user_academic.associate = function(models) {
    // associations can be defined here
  };
  return b2c_user_academic;
};