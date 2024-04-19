import {config} from 'dotenv';
import {Request, Response} from 'express';
import {pool} from '../db';
import {Point} from '../types/map.types';
import {transformCoordinates} from '../utils/transformCoordinates';
config();

class ObjectController {
    async getObjectsByObjectGroupId(req: Request<{id: number}>, res: Response) {
        try {
            const objectGroupId = req.params.id;

            if (Number.isNaN(objectGroupId)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid objectGroupId.'
                });
            }

            const objects = await pool.query('SELECT * FROM objects WHERE object_group_id=$1', [objectGroupId]);
            const transformedData = objects.rows.map((object) => ({
                ...object,
                coordinates: transformCoordinates(object.coordinates)
            }));

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
}

export default new ObjectController();
