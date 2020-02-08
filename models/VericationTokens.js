'use strict';
module.exports = (sequelize, DataTypes) => {
  const VericationTokens = sequelize.define('VericationTokens', {
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING
  }
  // ,{
  //   classMethods: {
  //     associate: function(models) {
  //       verificationtoken.belongsTo(models.b2c_user, {
  //         as: "user",
  //         foreignKey: "userId",
  //         foreignKeyConstraint: true
  //       });
  //     }
  //   },
  // }
  ,{timestamps:false,freezeTableName:true});
  VericationTokens.associate = function(models) {
    // associations can be defined here
    // VericationToken.belongsTo(ChannelsTypes, {foreignKey: 'user_id'});
    // VericationTokens.hasOne(models.b2c_user, {targetKey:'id',foreignKey: "userId",foreignKeyConstraint: true});
  };
  return VericationTokens;
};