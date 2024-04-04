import {config} from 'dotenv';
import {Request, Response} from 'express';
import {pool} from '../db';
import {transformInfoData} from '../utils/transformInfoData';
config();

class AdminController {
    async getAllInfo(req: Request, res: Response) {
        try {
            const allObjects = await pool.query(
                'select cl.client_id, objg.object_group_id, objg.optimal_object_id, obj.object_id, obj.coordinates , obj.status from clients as cl \
                join objectgroup as objg on objg.client_id = cl.client_id \
                join objects as obj on obj.object_group_id = objg.object_group_id'
            );

            const transformedData = transformInfoData(allObjects.rows);
            res.status(200).json({message: 'ok!', data: transformedData});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }

    async changeObjStatus(
        req: Request<{}, {}, {object_id: number; status: 'working' | 'waiting' | 'repair'}>,
        res: Response
    ) {
        try {
            const {object_id, status} = req.body;
            await pool.query('UPDATE objects SET status = $1 WHERE object_id = $2', [status, object_id]);

            res.status(200).json({message: 'ok!'});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }
}
export default new AdminController();
