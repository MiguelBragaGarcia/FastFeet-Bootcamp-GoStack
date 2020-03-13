'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('orders', 'recipient_id', {
            type: Sequelize.INTEGER,
            references: { model: 'recipients', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: false,
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('orders', 'recipient_id');
    },
};
