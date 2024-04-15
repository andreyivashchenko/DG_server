import cors from 'cors';
import {config} from 'dotenv';
import express from 'express';
import passport from 'passport';
import authRouter from './routes/auth.routes';
import clientRouter from './routes/client.routes';
import driverRouter from './routes/driver.routes';
import objectRouter from './routes/object.routes';
import objectGroupRouter from './routes/objectGroup.routes';
import routeRouter from './routes/route.routes';
import userRouter from './routes/user.routes';
import adminRouter from './routes/admin.routes';
import {authJwt} from './services/auth.service';

config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({extended: true}));

app.use('/auth', authRouter);
app.use('/user', authJwt, userRouter);
app.use('/route', authJwt, routeRouter);
app.use('/client', authJwt, clientRouter);
app.use('/object', authJwt, objectRouter);
app.use('/object-group', authJwt, objectGroupRouter);
app.use('/driver', driverRouter);
app.use('/admin', authJwt, adminRouter);

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
