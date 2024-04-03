import {pool} from '../db';
import {IUser, IUserRequest, Roles} from '../types/user.types';

export const insertUser = async (data: IUserRequest) => {
    if ((data.role as Roles) === 'client') {
        const {nameOrg, email, role, pass} = data;
        const user: IUser = await (
            await pool.query(`INSERT INTO users ( pass, email, role) VALUES($1, $2, $3) RETURNING *`, [
                pass,
                email,
                role
            ])
        ).rows[0];
        await pool.query('INSERT INTO clients (user_id, name_org) VALUES ($1, $2)', [user.id, nameOrg]);
        return user;
    } else if ((data.role as Roles) === 'driver') {
        const {fullName, nameOrg, email, role, pass} = data;
        const user: IUser = await (
            await pool.query(`INSERT INTO users ( pass, email, role) VALUES($1, $2, $3) RETURNING *`, [
                pass,
                email,
                role
            ])
        ).rows[0];
        await pool.query(
            "INSERT INTO drivers (user_id, name_org, full_name, coordinates) VALUES ($1, $2, $3, '(31.3, 32.1)')",
            [user.id, nameOrg, fullName]
        );
        return user;
    } else {
        const {email, role, pass} = data;
        const user: IUser = await (
            await pool.query(`INSERT INTO users ( pass, email, role) VALUES($1, $2, $3) RETURNING *`, [
                pass,
                email,
                role
            ])
        ).rows[0];
        return user;
    }
};
