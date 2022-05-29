import express, { Request, Response } from 'express';
const router = express.Router();
import { User, Store } from '../models/user';
import jwt from 'jsonwebtoken';

const store = new Store();

const createUser = async (req: Request, res: Response) => {
    const u: User = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
    };
    try {
        const newUser = await store.create(u);
        var token = jwt.sign({username:u.username} , process.env.JWT_SECRET as string);
        // res.json(newUser);
        res.json(token);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};


const authUser = async (req: Request, res: Response) => {
    try {
        const store = new Store();
        const result = await store.authenticate(
            req.body.username,
            req.body.password
        );
        res.json(result);

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
