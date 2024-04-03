import {Request, Response} from 'express';
import {pool} from '../db';
import {User} from '../models/user.model';
import {insertUser} from '../utils/registerUser';

class UserController {
    async getUsers(req: Request, res: Response) {
        const allUsers = await pool.query('SELECT * FROM USERS');
        res.json(allUsers.rows);
    }

    async createUser(req: Request, res: Response) {
        try {
            const user = await insertUser(req.body);

            const newUser = new User(user!);
            res.status(200).send({
                success: true,
                message: 'User created successfully.',
                user: newUser.toJSON()
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Something went wrong',
                error: err
            });
        }
    }

    async loginUser(req: Request, res: Response) {
        const user = await User.getUserByEmail(req.body.email);

        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'Could not find the user.'
            });
        } else {
            const currentUser = new User(user);
            if (!currentUser.authenticateUser(req.body.pass)) {
                return res.status(401).send({
                    success: false,
                    message: 'Incorrect password'
                });
            }

            return res.status(200).send({
                success: true,
                message: 'User is successfully authorized',
                user: currentUser.toJSON()
            });
        }
    }
}

export default new UserController();
