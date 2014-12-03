module.exports = function(sequelize, DataTypes) {
	var Question = sequelize.define('Question', {
	  title: DataTypes.STRING,
	  description: DataTypes.TEXT,
	  codeSnippet: DataTypes.TEXT,
	  githubRepo: DataTypes.STRING,
	  votes: DataTypes.INTEGER,
	}, {
		classMethods: {
			associate: function(models) {
				Question.hasMany(models.Reply);
				Question.belongsTo(models.User);
			}
		}
	});

	return Question;
};
