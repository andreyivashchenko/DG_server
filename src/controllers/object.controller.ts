import {config} from 'dotenv';
import {Request, Response} from 'express';
import {pool} from '../db';
import {transformObjectData} from '../utils/transformObjectData';
import {Point} from '../types/map.types';
config();

class ObjectController {
    async getAllObjects(req: Request, res: Response) {
        try {
            const allObjects = await pool.query(
                'select cl.client_id, objg.object_group_id, obj.object_id, obj.coordinates , obj.status from clients as cl \
                join objectgroup as objg on objg.client_id = cl.client_id \
                join objects as obj on obj.object_group_id = objg.object_group_id'
            );

            const transformedData = transformObjectData(allObjects.rows);
            res.status(200).json({message: 'ok!', data: transformedData});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }

    async getObjectsByClientId(req: Request, res: Response) {
        try {
            const clientId = +req.params.id;

            if (Number.isNaN(clientId)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid clientId.'
                });
            }

            const objects = await pool.query(
                `select cl.client_id, objg.object_group_id, obj.object_id, obj.coordinates , obj.status from clients as cl
                join objectgroup as objg on objg.client_id = cl.client_id
                join objects as obj on obj.object_group_id = objg.object_group_id
                where cl.client_id = $1`,
                [clientId]
            );

            const transformedData = transformObjectData(objects.rows);
            res.status(200).json({message: 'ok!', data: transformedData});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }

    async createObject(req: Request<{}, {}, {coordinates: Point; object_group_id: number}>, res: Response) {
        try {
            const {coordinates, object_group_id} = req.body;

            const initialObjectStatus = 'working';

            await pool.query('INSERT INTO objects (coordinates, object_group_id, status) VALUES ($1, $2, $3)', [
                `(${coordinates.join(',')})`,
                object_group_id,
                initialObjectStatus
            ]);

            res.status(200).json({message: 'ok!'});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }

    async deleteObjectById(req: Request, res: Response) {
        try {
            const objectId = +req.params.id;
            if (Number.isNaN(objectId)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid objectId.'
                });
            }

            const deleteCount = (await pool.query('DELETE FROM objects WHERE object_id=$1', [objectId])).rowCount;

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
export default new ObjectController();
