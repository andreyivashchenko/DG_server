import {compareSync} from 'bcrypt-nodejs';
import {error} from 'console';
import {config} from 'dotenv';
import jwt from 'jsonwebtoken';
import {pool} from '../db';
import {IUser, Roles} from '../types/user.types';
config();

export class User {
    _id?: number;
    _email?: string;
    _pass: string;
    _role: Roles;

    constructor({id, email, pass, role}: IUser) {
        this._id = id ? id : undefined;
        this._email = email ? email : undefined;
        this._pass = pass;
        this._role = role;
    }

    static async getUserByEmail(email: string): Promise<IUser> {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return user.rows[0];
    }

    static async getUserById(id: number, callback: (err: any, user: IUser) => void) {
        const user: IUser = await (await pool.query('SELECT * FROM users WHERE id = $1', [id])).rows[0];
        if (!user) throw error;
        callback(null, user);
    }

    authenticateUser(password: string) {
        return compareSync(password, this._pass);
    }
    createToken() {
        return jwt.sign(
            {
                id: this._id,
                email: this._email,
                role: this._role
            },
            process.env.JWT_SECRET as string,
            {expiresIn: '1d'}
        );
    }
    toJSON() {
        return {
            id: this._id,
            email: this._email,
            role: this._role,
            token: `Bearer ${this.createToken()}`
        };
    }
}
