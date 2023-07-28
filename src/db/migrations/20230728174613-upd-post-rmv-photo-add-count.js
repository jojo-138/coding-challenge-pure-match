'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		return await queryInterface.sequelize.transaction((t) => {
			return Promise.all([
				queryInterface.addColumn(
					'Posts',
					'photoCount',
					{
						type: Sequelize.INTEGER,
						allowNull: false,
						defaultValue: 0,
					},
					{ transaction: t }
				),
				queryInterface.removeColumn('Posts', 'photo', { transaction: t }),
			]);
		});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		// return await queryInterface.addColumn('Posts', 'photo', { type: Sequelize.STRING });
		return await queryInterface.sequelize.transaction((t) => {
			return Promise.all([
				queryInterface.removeColumn('Posts', 'photoCount', { transaction: t }),
				queryInterface.addColumn('Posts', 'photo', { type: Sequelize.STRING }, { transaction: t }),
			]);
		});
	},
};
