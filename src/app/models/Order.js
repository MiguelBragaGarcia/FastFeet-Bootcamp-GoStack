import Sequelize, { Model } from 'sequelize';

class Order extends Model {
    static init(sequelize) {
        super.init(
            {
                product: Sequelize.STRING,
                canceled_at: Sequelize.DATE,
                start_date: Sequelize.DATE,
                end_date: Sequelize.DATE,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    associate(models) {
        this.belongsTo(models.Signature, {
            foreignKey: 'signature_id',
            as: 'signature',
        });

        this.belongsTo(models.Recipient, {
            foreignKey: 'recipient_id',
            as: 'recipient',
        });

        this.belongsTo(models.Deliveryman, {
            foreignKey: 'deliveryman_id',
            as: 'deliveryman',
        });
    }
}

export default Order;
