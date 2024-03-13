export interface IUser {
	id?: number
	name: string
	email?: string
	pass: string
	role: 'admin' | 'client' | 'driver'
}
