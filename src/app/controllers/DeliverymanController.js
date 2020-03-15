import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
    async store(req, res) {
        const schema = Yup.object().shape({
            nome: Yup.string().required(),
            email: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ Error: 'Validation Fails' });
        }

        const { nome } = req.body;

        const userExists = await Deliveryman.findOne({
            where: { nome },
        });

        if (userExists) {
            return res
                .status(400)
                .json({ Error: 'Deliveryman already registred' });
        }

        const { id, email, avatar_id } = await Deliveryman.create(req.body);

        return res.status(200).json({ id, nome, email, avatar_id });
    }

    async index(req, res) {
        const allDeliveryman = await Deliveryman.findAll({
            attributes: ['id', 'nome', 'email', 'avatar_id'],
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path', 'url'],
                },
            ],
        });

        return res.status(201).json({ allDeliveryman });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            nome: Yup.string().required(),
            email: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ Error: 'Validation Fails' });
        }

        const deliveryman = await Deliveryman.findByPk(req.params.id);
        if (!deliveryman) {
            return res
                .status(400)
                .json({ Error: 'Deliveryman does not exists' });
        }

        const { id, nome, email } = await deliveryman.update(req.body);

        return res.status(201).json({ id, nome, email });
    }

    async delete(req, res) {
        const deliveryman = await Deliveryman.findByPk(req.params.id);

        if (!deliveryman) {
            return res
                .status(400)
                .json({ Error: 'Deliveryman does not exists' });
        }

        await deliveryman.destroy();

        return res.status(200).json({
            Message: `The deliveryman has been deleted`,
        });
    }
}

export default new DeliverymanController();
