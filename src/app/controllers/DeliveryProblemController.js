import * as Yup from 'yup';

import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

import DeliveryProblem from '../models/DeliveryProblem';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
    async store(req, res) {
        const schemma = Yup.object().shape({
            description: Yup.string().required(),
        });

        if (!(await schemma.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const delivery_id = req.params.id;
        const problem = await DeliveryProblem.create({
            delivery_id,
            description: req.body.description,
        });
        return res.json(problem);
    }

    async index(req, res) {
        const findAll = await DeliveryProblem.findAll({
            where: { delivery_id: req.params.id },
        });

        return res.json(findAll);
    }

    async update(req, res) {
        const cancelOrder = await Order.findByPk(req.params.id, {
            attributes: [
                'id',
                'product',
                'canceled_at',
                'start_date',
                'deliveryman_id',
                'recipient_id',
            ],
            include: [
                {
                    model: Deliveryman,
                    as: 'deliveryman',
                    attributes: ['id', 'nome', 'email'],
                },
            ],
        });

        if (!cancelOrder) {
            return res.status(400).json({ error: 'Order does not exists' });
        }

        if (cancelOrder.canceled_at !== null) {
            return res.status(400).json({
                error:
                    'You cannot cancel a product that has already been canceled',
            });
        }
        await cancelOrder.update({ canceled_at: new Date() });
        await Queue.add(CancellationMail.key, { cancelOrder });

        return res.json(cancelOrder);
    }
}
export default new DeliveryProblemController();
