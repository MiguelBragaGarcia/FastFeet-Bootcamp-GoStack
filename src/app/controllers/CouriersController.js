import { setHours, isAfter, isBefore, startOfDay } from 'date-fns';
import Order from '../models/Order';

class CouriersController {
    async index(req, res) {
        const atualDate = new Date();
        const findAll = await Order.findAll({
            where: {
                deliveryman_id: req.params.id,
                canceled_at: null,
                end_date: null,
            },
        });

        return res.json(findAll);
    }

    async update(req, res) {
        const { order_id } = req.params;
        const { deliveryman_id: id } = req.body;

        const order = await Order.findByPk(order_id);

        if (!order) {
            return res.status(400).json({ Error: 'Order not found' });
        }
        if (order.start_date !== null) {
            return res.status(400).json({
                Error:
                    'You cannot withdraw a product that has already been withdrawn',
            });
        }

        if (order.deliveryman_id !== id) {
            return res.status(400).json({
                Error: 'You do not have access to withdraw this order',
            });
        }

        if (!order.start_date) {
            const date = new Date();
            const start_date = setHours(startOfDay(date), 8);
            const end_date = setHours(startOfDay(date), 18);

            if (!(isBefore(start_date, date) && isAfter(end_date, date))) {
                return res
                    .status(400)
                    .json({ ERROR: 'Não é possível pegar a encomenda' });
            }
            await order.update({ start_date: date });

            return res.json(order);
        }
    }
}

export default new CouriersController();
