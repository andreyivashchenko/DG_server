import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import passport from 'passport'
import authRouter from './routes/auth.routes'
import userRouter from './routes/user.routes'
import { authJwt } from './services/auth.service'

config()

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())
app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRouter)
app.use('/api', authJwt, userRouter)

app.listen(PORT, () => {
	console.log(`server started on port ${PORT}`)
})
