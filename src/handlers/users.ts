import express, { Request, Response } from 'express';
const router = express.Router();
import { User, UserStore } from '../models/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import verifyAuthToken from '../middlewares/verifyAuthToken';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    const users = await store.index();
    res.json(users);
};

const show = async (_req: Request, res: Response) => {
    const user = await store.show(_req.params.id);
    res.json(user);
};

const create = async (req: Request, res: Response) => {
    const u: User = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
    };
    try {
        const newUser = await store.create(u);

        var token = jwt.sign(
            { username: u.username },
            process.env.JWT_SECRET as string
        );

        res.json(token);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const destroy = async (_req: Request, res: Response) => {
    const deleted = await store.delete(_req.params.id);
    res.json(deleted);
};

const authenticate = async (req: Request, res: Response) => {
    try {
        const store = new UserStore();
        const result = await store.authenticate(
            req.body.username,
            req.body.password
        );

        if (result !== null) {
            var token = jwt.sign(
                { username: result.username },
                process.env.JWT_SECRET as string
            );

            res.json(token);
        } else res.json('Inavalid username or password');
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

//use JWT to protect the user route so that user can only edit their own user settings:
const update = async (req: Request, res: Response) => {
    try {
        const authorizationHeader: string = req.header(
            'authorization'
        ) as string;

        const decoded = jwt.verify(authorizationHeader, process.env.JWT_SECRET as string) as JwtPayload;
        if (decoded.username !== req.body.username) {
            throw new Error();
        }

    } catch (err) {
        res.status(401);
        res.json('User username does not match: username desnot match the token payload username...');
        return;
    }

    try {
        const updated = await store.update(
            req.body.username,
            req.body.password
        );
        res.json(updated);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const users_routes = (app: express.Application) => {
    app.get('/users', index);
    app.get('/users/:id', show);
    app.post('/users', create); //SignUp
    app.post('/users/login', authenticate); //SignIn
    app.put('/users', verifyAuthToken, update);
    app.delete('/users/:id', verifyAuthToken, destroy);
};

export default users_routes;
