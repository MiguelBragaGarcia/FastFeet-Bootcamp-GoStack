import Recipient from '../models/Recipient';
import * as Yup from 'yup';

class RecipientController {
    //Cadastra a encomenda
    async store(req, res) {
        const schema = Yup.object().shape({
            nome: Yup.string().required(),
            cidade: Yup.string().required(),
            rua: Yup.string().required(),
            numero: Yup.string().required(),
            complemento: Yup.string(),
            estado: Yup.string().required(),
            cep: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                Error: 'Validation fails',
            });
        }

        const { nome } = req.body;
        const existRecipient = await Recipient.findOne({
            where: { nome },
        });

        if (existRecipient) {
            return res.status(401).json({
                Error: 'Recipient already registered ',
            });
        }

        //Como não tem como adicionar adms pela aplicação todas as pessoas que estão na tabela por padrão sao ADM

        const recipient = await Recipient.create(req.body);
        return res.status(200).json({ recipient });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            nome: Yup.string().required(),
            cidade: Yup.string().required(),
            rua: Yup.string().required(),
            numero: Yup.string().required(),
            complemento: Yup.string(),
            estado: Yup.string().required(),
            cep: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                Error: 'Validation fails',
            });
        }

        const { nome } = req.body;

        const existRecipient = await Recipient.findOne({
            where: { nome },
        });

        if (!existRecipient) {
            return res.status(401).json({
                Error: 'Recipient not exists ',
            });
        }

        const updatedRecipient = await existRecipient.update(req.body);

        return res.status(200).json({
            updatedRecipient,
        });
    }

    //Busca as encomnedas pelo nome do destinatário realmente precisa disso?
    async index(req, res) {
        const schema = Yup.object().shape({
            nome: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                Error: 'Validation fails',
            });
        }

        const { nome } = req.body;
        const existRecipient = await Recipient.findOne({
            where: { nome },
        });

        if (!existRecipient) {
            return res.status(400).json({
                Error: 'Recipient not found! ',
            });
        }

        return res.status(200).json({
            existRecipient,
        });
    }
}

export default new RecipientController();
