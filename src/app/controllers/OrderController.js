import * as Yup from 'yup';

import NewOrderMail from '../jobs/NewOrder';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

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

        //Verifica se o destinatário existe
        const existRecipient = await Recipient.findByPk(recipient_id);
        if (!existRecipient) {
            return res.status(400).json({ Error: 'Recipient does not exists' });
        }

        //Verifica se o entregador existe
        const existDeliveryman = await Deliveryman.findByPk(deliveryman_id);
        if (!existDeliveryman) {
            return res
                .status(400)
                .json({ Error: 'Deliveryman does not exists' });
        }

        // const data = { existRecipient, existDeliveryman };

        console.log('REQ.BODY', req.body);
        //   await NewOrderMail.handle({ data });

        const teste = await Order.create(req.body);
        return res.status(200).json();
    }
}

export default new OrderController();
