import Signature from '../models/Signature';
import Order from '../models/Order';

class SignatureController {
    async store(req, res) {
        const { originalname: name, filename: path } = req.file;

        const signature = await Signature.create({ name, path });

        const { order_id: id } = req.params;
        const updatedOrder = await Order.findByPk(id);
        await updatedOrder.update({ signature_id: signature.id });

        return res.status(200).json(signature);
    }
}

export default new SignatureController();
