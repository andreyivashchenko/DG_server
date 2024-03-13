import { hashSync } from 'bcrypt-nodejs'
import { Request, Response } from 'express'
import { pool } from '../db'
import { User } from '../models/user.model'
import { IUser } from '../types/user.types'

class UserController {
	async getUsers(req: Request, res: Response) {
		const allUsers = await pool.query('SELECT * FROM USERS')
		res.json(allUsers.rows)
	}

	async createUser(req: Request, res: Response) {
		const user = {
			name: req.body.name,
			pass: hashSync(req.body.pass),
			email: req.body.email,
			role: req.body.role,
		}
		try {
			const userCredentials: IUser = await (
				await pool.query(
					`INSERT INTO users (name, pass, email, role) VALUES($1, $2, $3, $4) RETURNING *`,
					[user.name, user.pass, user.email, user.role]
				)
			).rows[0]
			const newUser = new User(userCredentials)
			res.send({
				success: true,
				message: 'User created successfully.',
				user: newUser.toJSON(),
			})
		} catch (err) {
			res.send({
				success: false,
				message: 'Something went wrong',
				error: err,
			})
		}
	}

	async loginUser(req: Request, res: Response) {
		const user = await User.getUserByEmail(req.body.email)

		if (!user) {
			return res.status(401).send({
				success: false,
				message: 'Could not find the user.',
			})
		} else {
			const currentUser = new User(user)
			if (!currentUser.authenticateUser(req.body.pass)) {
				return res.status(401).send({
					success: false,
					message: 'Incorrect password',
				})
			}

			return res.status(200).send({
				success: true,
				message: 'User is successfully authorized',
				user: currentUser.toJSON(),
			})
		}
	}
}

export default new UserController()
