import {config} from 'dotenv';
import {Request, Response} from 'express';
import {pool} from '../db';
import {transformInfoData} from '../utils/transformInfoData';
config();

class AdminController {
    async getAllInfo(req: Request, res: Response) {
        try {
            const allObjects = await pool.query(
                'select cl.client_id,cl.name_org, objg.object_group_id, objg.optimal_object_id, obj.object_id, obj.coordinates , obj.status from clients as cl \
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
    async setDriverData(
        req: Request<{}, {}, {driverId: number; objectGroupId: number; status: string}>,
        res: Response
    ) {
        try {
            const {driverId, objectGroupId, status} = req.body;
            console.log(req.body);

            if (Number.isNaN(driverId)) {
                return res.status(400).json({
                    succes: false,
                    message: 'Invalid driver id'
                });
            }
            if (Number.isNaN(objectGroupId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid objectGroupId'
                });
            }
            const optimalObjectId = await pool.query(
                'select optimal_object_id from objectgroup where object_group_id = $1',
                [objectGroupId]
            );
            if (!optimalObjectId) {
                return res.status(500).json({
                    success: false,
                    message: 'Optimal object is not found'
                });
            }
            const optimalObjectCoordinates = await pool.query('select coordinates from objects where object_id = $1', [
                optimalObjectId.rows[0]
            ]);
            await pool.query(
                'UPDATE drivers\
                set object_group_id = $2, status = $3, coordinates = $4 \
                where driver_id = $1',
                [driverId, objectGroupId, status, optimalObjectCoordinates.rows[0]]
            );
            res.status(200).send({
                success: true,
                message: 'Ok!'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'DB error',
                error: error
            });
        }
    }
    async getClientsWithDrivers(req: Request, res: Response) {
        try {
            const clients = (await pool.query('select c.client_id , c.name_org  from clients c ')).rows;
            const clientsWithGroups = await Promise.all(
                clients.map(async (client: {client_id: number; name_org: string}) => {
                    const objectGroups = (
                        await pool.query(
                            'select object_group_id , optimal_object_id  from objectgroup o  \
                where client_id = $1',
                            [client.client_id]
                        )
                    ).rows;
                    const objectGroupsWithDrivers = await Promise.all(
                        objectGroups.map(async (objectGroup: {object_group_id: number; optimal_object_id: number}) => {
                            const drivers = (
                                await pool.query(
                                    'select driver_id, full_name  from drivers d  \
                        where object_group_id  = $1',
                                    [objectGroup.object_group_id]
                                )
                            ).rows;
                            return {...objectGroup, drivers: drivers};
                        })
                    );

                    return {...client, groups: objectGroupsWithDrivers};
                })
            );
            res.status(200).json({
                success: true,
                message: 'ok!',
                data: clientsWithGroups
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'DB error',
                error: error
            });
        }
    }
}

export default new AdminController();
