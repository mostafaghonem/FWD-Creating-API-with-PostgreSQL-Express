import express, { Request, Response } from 'express';
const router = express.Router();
import { Article, ArticleStore } from '../models/article';

const index = (_req: Request, res: Response) => {
    try {
        res.send('this is the INDEX route');
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

const show = (_req: Request, res: Response) => {
    try {
        res.send('this is the SHOW route');
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

const create  = (req: Request, res: Response) => {
    const article: Article = {
        title: req.body.title,
        content: req.body.content,
    };
    try {
        res.send('this is the CREATE route');
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

const update = (req: Request, res: Response) => {
    const article: Article = {
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
    };
    try {
        res.send('this is the EDIT route');
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

const destroy = (_req: Request, res: Response) => {
    try {
        res.send('this is the DELETE route');
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

const article_routes = (app:express.Application)=>{
    app.get('/articles' , index);
    app.get('/articles/:id' , show);
    app.post('/articles' , create);
    app.put('/articles/:id' , update);
    app.delete('/articles/:id' , destroy);
}

export default article_routes;
