'use strict';
module.exports = (sequelize, DataTypes) => {
  const b2c_user_research = sequelize.define('b2c_user_research', {
    id:{
      type: DataTypes.INTEGER,      
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    detail: DataTypes.STRING,
    file_url: DataTypes.STRING,
    create_date: DataTypes.DATE,
    modify_date: DataTypes.DATE
  }, {timestamps:false,freezeTableName:true});
  b2c_user_research.associate = function(models) {
    // associations can be defined here
  };
  return b2c_user_research;
};