'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Photo extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Photo.belongsTo(models.Post, {
				foreignKey: 'postId',
				onDelete: 'CASCADE',
			});
		}
	}
	Photo.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			postId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Photo',
		}
	);
	return Photo;
};
