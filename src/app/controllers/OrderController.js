import * as Yup from 'yup';
import { setHours, startOfDay, isBefore, isAfter } from 'date-fns';

import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';
import Signature from '../models/Signature';

import Queue from '../../lib/Queue';
import NewOrderMail from '../jobs/NewOrderMail';
import CancellationMail from '../jobs/CancellationMail';

class OrderController {
    async store(req, res) {
        const schema = Yup.object().shape({
            recipient_id: Yup.number().required(),
            deliveryman_id: Yup.number().required(),
            product: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                Error: 'Validation Fails',
            });
        }

        const { recipient_id, deliveryman_id } = req.body;

        const existRecipient = await Recipient.findByPk(recipient_id);
        if (!existRecipient) {
            return res.status(400).json({ Error: 'Recipient does not exists' });
        }

        const existDeliveryman = await Deliveryman.findByPk(deliveryman_id);
        if (!existDeliveryman) {
            return res
                .status(400)
                .json({ Error: 'Deliveryman does not exists' });
        }

        const order = await Order.create(req.body);

        const { nome, email } = existDeliveryman;
        order.deliveryman_id = {
            nome,
            email,
        };

        await Queue.add(NewOrderMail.key, { order });

        return res.status(200).json({ order });
    }

    async index(req, res) {
        const allOrders = await Order.findAll({
            where: { canceled_at: null },
            attributes: [
                'id',
                'product',
                'start_date',
                'end_date',
                'recipient_id',
                'signature_id',
            ],
            include: [
                {
                    model: Deliveryman,
                    as: 'deliveryman',
                    attributes: ['id', 'nome', 'email', 'avatar_id'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['name', 'path', 'url'],
                        },
                    ],
                },

                {
                    model: Signature,
                    as: 'signature',
                    attributes: ['name', 'path', 'url'],
                },
            ],
        });

        return res.status(200).json(allOrders);
    }

    async delete(req, res) {
        const { id } = req.params;
        const cancelOrder = await Order.findByPk(id, {
            where: { start_date: null },
            include: [
                {
                    model: Deliveryman,
                    as: 'deliveryman',
                    attributes: ['id', 'nome', 'email'],
                },
            ],
        });

        if (!cancelOrder) {
            return res.status(400).json({
                error: 'Order does not exist',
            });
        } else if (cancelOrder.start_date !== null) {
            return res.status(400).json({
                Error:
                    'you are trying to remove an order that is being delivered',
            });
        } else if (cancelOrder.canceled_at !== null) {
            return res.status(400).json({
                Error:
                    'You cannot cancel a product that has already been canceled',
            });
        }

        await cancelOrder.update({ canceled_at: new Date() });
        await Queue.add(CancellationMail.key, { cancelOrder });

        return res.json(cancelOrder);
    }

    async update(req, res) {
        const schemma = Yup.object().shape({
            product: Yup.string(),
            recipient_id: Yup.number(),
            deliveryman_id: Yup.number(),
        });

        if (!(await schemma.isValid(req.body))) {
            return res.status(400).json({ Error: 'Validation fails' });
        }
        const { order_id } = req.params;
        const order = await Order.findByPk(order_id);

        if (!order) {
            return res.status(400).json({ Error: 'Order not found' });
        }

        if (!order.start_date) {
            const date = new Date();
            const start_date = setHours(startOfDay(date), 8);
            const end_date = setHours(startOfDay(date), 18);

            if (!(isBefore(start_date, date) && isAfter(end_date, date))) {
                return res.status(400).json({
                    ERROR:
                        'it is not possible to pick up the order outside opening hours 08:00 AM - 18:00 PM',
                });
            }
            await order.update({ start_date: date });

            return res.json(order);
        }
    }
}

export default new OrderController();
