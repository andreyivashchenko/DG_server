import { compareSync } from 'bcrypt-nodejs'
import { error } from 'console'
import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import { pool } from '../db'
import { IUser } from '../types/user.types'
config()

export class User {
	_id?: number
	_name: string
	_email?: string
	_pass: string

	constructor({ id, name, email, pass }: IUser) {
		this._id = id ? id : undefined
		this._name = name
		this._email = email ? email : undefined
		this._pass = pass
	}

	static async getUserByEmail(email: string): Promise<IUser> {
		const user = await pool.query('SELECT * FROM users WHERE email = $1', [
			email,
		])
		return user.rows[0]
	}

	static async getUserById(
		id: number,
		callback: (err: any, user: IUser) => void
	) {
		const user: IUser = await (
			await pool.query('SELECT * FROM users WHERE id = $1', [id])
		).rows[0]
		if (!user) throw error
		callback(null, user)
	}

	authenticateUser(password: string) {
		return compareSync(password, this._pass)
	}
	createToken() {
		return jwt.sign(
			{
				_id: this._id,
				name: this._name,
				email: this._email,
			},
			process.env.JWT_SECRET as string,
			{ expiresIn: '1d' }
		)
	}
	toJSON() {
		return {
			_id: this._id,
			userName: this._name,
			userEmail: this._email,
			token: `Bearer ${this.createToken()}`,
		}
	}
}
