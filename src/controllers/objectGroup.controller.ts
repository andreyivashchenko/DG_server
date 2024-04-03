import {config} from 'dotenv';
import {Request, Response} from 'express';
import {pool} from '../db';
config();

class ObjectGroupController {
    async getObjectGroupsByClientId(req: Request<{id: number}>, res: Response) {
        try {
            const clientId = req.params.id;

            if (Number.isNaN(clientId)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid clientId.'
                });
            }

            const objectGroups = await pool.query('SELECT * FROM objectgroup WHERE client_id=$1', [clientId]);

            res.status(200).json({message: 'ok!', data: objectGroups.rows});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }

    async createObjectGroup(req: Request<{}, {}, {client_id: number}>, res: Response) {
        try {
            const {client_id} = req.body;

            if (!client_id || Number.isNaN(+client_id)) {
                return res.status(400).send({
                    success: false,
                    message: 'Incorrect body parameters.'
                });
            }

            await pool.query('insert into objectgroup (client_id) values ($1) returning object_group_id', [client_id]);

            res.status(200).json({message: 'ok!'});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }

    async deleteObjectGroupById(req: Request<{id: number}>, res: Response) {
        try {
            const objectGroupId = req.params.id;

            if (Number.isNaN(objectGroupId)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid objectGroupId.'
                });
            }

            const deleteCount = (await pool.query('DELETE FROM objectgroup WHERE object_group_id=$1', [objectGroupId]))
                .rowCount;

            if (!deleteCount) {
                return res.status(400).send({
                    success: false,
                    message: 'Nothing to delete.'
                });
            }

            res.status(200).json({message: 'ok!'});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }
}
export default new ObjectGroupController();
