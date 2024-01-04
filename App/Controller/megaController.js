import Mega from '../Model/megaModel.js';

class MegaController {
    static async insert(req, res) {
        try {
            const { num1, num2, num3, num4, num5, num6 } = req.body;
            const mega = new Mega(num1, num2, num3, num4, num5, num6);
            const insertId = await mega.save();
            res.status(200).send({ message: "Dados inseridos com sucesso", id: insertId });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default MegaController;
