import {Request, Response} from 'express';
import {pool} from '../db';
import {User} from '../models/user.model';
import {insertUser} from '../utils/registerUser';
import {transformCoordinates} from '../utils/transformCoordinates';

class UserController {
    async getUsers(req: Request, res: Response) {
        const allUsers = await pool.query('SELECT * FROM USERS');
        res.json(allUsers.rows);
    }

    async getClientByUserId(req: Request, res: Response) {
        try {
            const userId = +req.params.id;

            if (Number.isNaN(userId)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid userId.'
                });
            }

            const data = await pool.query('select * from clients where user_id = $1', [userId]);

            const clientId = data.rows[0];

            if (!clientId) {
                return res.status(404).send({
                    success: false,
                    message: 'Client not found.'
                });
            }

            res.status(200).json({message: 'ok!', data: clientId});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }

    async getDriverByUserId(req: Request<{id: number}>, res: Response) {
        try {
            const userId = +req.params.id;

            if (Number.isNaN(userId)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid userId.'
                });
            }

            const data = await pool.query('select * from drivers where user_id = $1', [userId]);

            const driver = data.rows[0];

            if (!driver) {
                return res.status(404).send({
                    success: false,
                    message: 'Driver not found.'
                });
            }

            const transformedDriver = {...driver, coordinates: transformCoordinates(driver.coordinates)};

            res.status(200).json({message: 'ok!', data: transformedDriver});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }
}

export default new UserController();
