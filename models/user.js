module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('User', {
		login: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
    githubid: DataTypes.INTEGER
	});

	return User;
};