import {config} from 'dotenv';
import {Request, Response} from 'express';
import {pool} from '../db';
import {transformCoordinates} from '../utils/transformCoordinates';
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

            const objectGroups = await pool.query(
                'SELECT * FROM objectgroup WHERE client_id=$1 ORDER BY objectgroup.object_group_id ASC',
                [clientId]
            );

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

    async setOptimalObject(req: Request<{}, {}, {object_group_id: number; optimal_object_id: number}>, res: Response) {
        try {
            const {object_group_id, optimal_object_id} = req.body;

            if (!object_group_id || Number.isNaN(+object_group_id)) {
                return res.status(400).send({
                    success: false,
                    message: 'Incorrect body parameters.'
                });
            }

            if (optimal_object_id !== null && (!optimal_object_id || Number.isNaN(+optimal_object_id))) {
                return res.status(400).send({
                    success: false,
                    message: 'Incorrect body parameters.'
                });
            }

            await pool.query('UPDATE objectgroup SET optimal_object_id = $1 WHERE object_group_id = $2', [
                optimal_object_id,
                object_group_id
            ]);

            res.status(200).json({message: 'ok!'});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }

    async getOptimalObject(req: Request<{id: number}>, res: Response) {
        try {
            const object_group_id = req.params.id;

            if (!object_group_id || Number.isNaN(+object_group_id)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid object_group_id.'
                });
            }

            const optimalObjectId = (
                await pool.query('SELECT optimal_object_id from objectgroup where object_group_id = $1', [
                    object_group_id
                ])
            ).rows?.[0]?.optimal_object_id;

            if (!optimalObjectId) {
                return res.status(400).send({
                    success: false,
                    message: `Object group don't have optimal object.`
                });
            }

            const data = await pool.query('SELECT * FROM objects WHERE object_id = $1', [optimalObjectId]);

            const object = data.rows[0];

            const transformedObject = {...object, coordinates: transformCoordinates(object.coordinates)};

            res.status(200).json({message: 'ok!', data: transformedObject});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }
}
export default new ObjectGroupController();
