import {config} from 'dotenv';
import {Request, Response} from 'express';
import {pool} from '../db';
config();

class ObjectGroupController {
    async createObjectGroup(req: Request<{}, {}, {client_id: number}>, res: Response) {
        try {
            const {client_id} = req.body;

            if (!client_id || Number.isNaN(+client_id)) {
                return res.status(400).send({
                    success: false,
                    message: 'Incorrect body parameters.'
                });
            }

            const result = await pool.query(
                'insert into objectgroup (client_id) values ($1) returning object_group_id',
                [client_id]
            );

            const object_group_id = result.rows[0]['object_group_id'];

            res.status(200).json({message: 'ok!', data: object_group_id});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }
}
export default new ObjectGroupController();
