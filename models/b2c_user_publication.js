'use strict';
module.exports = (sequelize, DataTypes) => {
  const b2c_user_publication = sequelize.define('b2c_user_publication', {
    id:{
      type: DataTypes.INTEGER,      
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    client: DataTypes.STRING,
    author: DataTypes.STRING,
    publish_year: DataTypes.STRING,
    catation: DataTypes.STRING,
    version: DataTypes.STRING,
    url: DataTypes.STRING,
    detail: DataTypes.STRING,
    file_url: DataTypes.STRING,
    create_date: DataTypes.DATE,
    modify_date: DataTypes.DATE
  }, {timestamps:false,freezeTableName:true});
  b2c_user_publication.associate = function(models) {
    // associations can be defined here
  };
  return b2c_user_publication;
};