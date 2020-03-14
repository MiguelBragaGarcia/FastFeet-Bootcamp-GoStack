import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';

class DeliveryProblemController {
    async store(req, res) {
        const schemma = Yup.object().shape({
            description: Yup.string().required(),
        });

        if (!(await schemma.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const delivery_id = req.params.id;
        const problem = await DeliveryProblem.create(delivery_id, req.body);
        return res.json(problem);
    }

    async index(req, res) {
        const findAll = await DeliveryProblem.findAll({
            where: { delivery_id: req.params.id },
        });

        return res.json(findAll);
    }

    async update(req, res) {
        const problemResolve = await Order.findByPk(req.params.id);

        if (!problemResolve) {
            return res.status(400).json({ error: 'Order does not exists' });
        }
        await problemResolve.update({ canceled_at: new Date() });

        return res.json(problemResolve);
    }
}
export default new DeliveryProblemController();
