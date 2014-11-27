module.exports = function(sequelize, DataTypes) {
	var Reply = sequelize.define('Reply', {
	  link: DataTypes.STRING,
	  description: DataTypes.STRING
	}, {
		classMethods: {
			associate: function(models) {
				Reply.belongsTo(models.Question);
				Reply.belongsTo(models.User);
			}
		}
	});

	return Reply;
};