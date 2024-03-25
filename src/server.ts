import cors from 'cors';
import {config} from 'dotenv';
import express from 'express';
import passport from 'passport';
import adminRouter from './routes/admin.routes';
import authRouter from './routes/auth.routes';
import routeRouter from './routes/route.routes';
import userRouter from './routes/user.routes';
import {authJwt} from './services/auth.service';

config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({extended: true}));

app.use('/auth', authRouter);
app.use('/api', authJwt, userRouter);
app.use('/route', routeRouter);
app.use('/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
