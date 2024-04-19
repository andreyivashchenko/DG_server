import {config} from 'dotenv';
import {Request, Response} from 'express';
import {pool} from '../db';
config();

class ClientController {
    async getClientsWithName(req: Request, res: Response) {
        try {
            const clients = (await pool.query('SELECT client_id, name_org FROM clients')).rows;
            if (!clients) {
                return res.status(400).send({
                    success: false,
                    message: 'Clients not found.'
                });
            }
            res.status(200).json({message: 'ok!', data: clients});
        } catch (err) {
            res.status(500).json({message: `DB error`, err: err});
        }
    }
}
export default new ClientController();
