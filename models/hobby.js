'use strict';
module.exports = (sequelize, DataTypes) => {
  const hobby = sequelize.define('hobby', {
    id:{
      type: DataTypes.INTEGER,      
      primaryKey: true
    }, 
    title: DataTypes.STRING,
    created_date_time: DataTypes.DATE,
    modified_date_time: DataTypes.DATE
  }, {timestamps:false,freezeTableName:true});
  hobby.associate = function(models) {
    // associations can be defined here
  };
  return hobby;
};