'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Post.belongsTo(models.User, {
				foreignKey: 'userId',
				onDelete: 'CASCADE',
			});
			Post.hasMany(models.Photo, {
				foreignKey: 'postId',
			});
			Post.hasMany(models.Comment, {
				foreignKey: 'postId',
			});
		}
	}
	Post.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: DataTypes.TEXT,
			photoCount: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Post',
		}
	);
	return Post;
};
