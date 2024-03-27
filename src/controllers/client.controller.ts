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
}
export default new ClientController();
