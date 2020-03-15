import File from '../models/File';
import Deliveryman from '../models/Deliveryman';

class FileController {
    async store(req, res) {
        const { originalname: name, filename: path } = req.file;

        const file = await File.create({
            name,
            path,
        });

        const { id } = req.params;
        const updatedDeliveryman = await Deliveryman.findByPk(id);
        await updatedDeliveryman.update({ avatar_id: file.id });

        return res.json(file);
    }
}

export default new FileController();
