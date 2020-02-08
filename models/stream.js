'use strict';
module.exports = (sequelize, DataTypes) => {
  const stream = sequelize.define('stream', {
    id:{
      type: DataTypes.INTEGER,      
      primaryKey: true
    }, 
    title: DataTypes.STRING,
    details: DataTypes.STRING,
    branch_id: DataTypes.INTEGER,
    created_date_time: DataTypes.DATE,
    modified_date_time: DataTypes.DATE
  }, {timestamps:false,freezeTableName:true});
  stream.associate = function(models) {
    // associations can be defined here
  };
  return stream;
};