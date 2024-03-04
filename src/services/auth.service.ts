import { config } from 'dotenv'
import passport from 'passport'
import {
	ExtractJwt,
	Strategy as JwtStrategy,
	WithSecretOrKey,
} from 'passport-jwt'
import { User } from '../models/user.model'
import { IUser } from '../types/user.types'

config()

// Jwt strategy
const jwtOpts: WithSecretOrKey = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET as string,
}

passport.use(
	new JwtStrategy(jwtOpts, function (jwt_payload, done) {
		User.getUserById(jwt_payload._id, function (err, user: IUser) {
			if (err) {
				return done(err, false)
			}
			if (user) {
				return done(null, user)
			} else {
				return done(null, false)
				// or you could create a new account
			}
		})
	})
)

export const authJwt = passport.authenticate('jwt', {
	session: false,
})
