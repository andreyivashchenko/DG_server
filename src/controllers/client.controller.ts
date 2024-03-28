import {config} from 'dotenv';
import {Request, Response} from 'express';
import {pool} from '../db';
config();

class ClientController {
    async getAllClients(req: Request, res: Response) {
        try {
            const clients = await pool.query(
                'select cl.client_id, us.name, us.email from clients as cl \
                join users as us on cl.user_id = us.id'
            );
            const clientsRows = clients.rows;
            res.status(200).json({message: 'ok!', data: clientsRows});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
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

            const data = await pool.query('select client_id from clients where user_id = $1', [userId]);

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
}
export default new ClientController();
