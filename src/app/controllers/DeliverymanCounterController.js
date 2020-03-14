import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Order from '../models/Order';

class DeliverymanCounterController {
    async update(req, res, next) {
        const atualDate = new Date();
        const findAll = await Order.findAll({
            where: {
                start_date: {
                    [Op.between]: [startOfDay(atualDate), endOfDay(atualDate)],
                },
                deliveryman_id: req.body.deliveryman_id,
            },
        });

        if (findAll.length < 5) {
            return next();
        } else {
            return res
                .status(400)
                .json({ error: 'You have more than 5 deliverys at this day' });
        }
    }
}

export default new DeliverymanCounterController();
