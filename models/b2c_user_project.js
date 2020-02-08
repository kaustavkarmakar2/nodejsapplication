'use strict';
module.exports = (sequelize, DataTypes) => {
  const b2c_user_project = sequelize.define('b2c_user_project', {
    id:{
      type: DataTypes.INTEGER,      
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    client: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    detail: DataTypes.STRING,
    file_url: DataTypes.STRING,
    role:DataTypes.STRING,
    create_date: DataTypes.DATE,
    modify_date: DataTypes.DATE,
    user_id: DataTypes.INTEGER
  }, {timestamps:false,freezeTableName:true});
  b2c_user_project.associate = function(models) {
    // associations can be defined here
  };
  return b2c_user_project;
};