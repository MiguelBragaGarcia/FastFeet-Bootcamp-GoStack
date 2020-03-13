'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('orders', 'deliveryman_id', {
            type: Sequelize.INTEGER,
            references: { model: 'deliverymans', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: false,
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('orders', 'deliveryman_id');
    },
};
