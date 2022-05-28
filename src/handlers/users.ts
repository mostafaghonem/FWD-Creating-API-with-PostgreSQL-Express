import express, { Request, Response } from 'express';
const router = express.Router();
import { User, User_ } from '../models/user';

const createUser = async (req: Request, res: Response) => {
    const u: User = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
    };
    try {
        const u_ = new User_();
        const result = await u_.create(u);
        res.send(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const authUser = async (req: Request, res: Response) => {
    try {
        const u_ = new User_();
        const result = await u_.authenticate(
            req.body.username,
            req.body.password
        );
        res.send(result);

    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const users_routes = (app: express.Application) => {
    app.post('/users', createUser);
    app.post('/users/authenticate', authUser);

};

export default users_routes;
