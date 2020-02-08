'use strict';
module.exports = (sequelize, DataTypes) => {
  const degree = sequelize.define('degree', {
    id:{
      type: DataTypes.INTEGER,      
      primaryKey: true
    }, 
    degree_name: DataTypes.STRING,
    short: DataTypes.STRING,
    branch_id: DataTypes.INTEGER,
    created_date_time: DataTypes.DATE,
    modified_date_time: DataTypes.DATE
  }, {timestamps:false,freezeTableName:true});
  degree.associate = function(models) {
    // associations can be defined here
  };
  return degree;
};