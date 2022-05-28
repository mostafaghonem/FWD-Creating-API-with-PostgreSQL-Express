import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mythical_weapon_routes from './handlers/mythical_weapons';
import article_routes from './handlers/articles';
import users_routes from './handlers/users';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(bodyParser.json());
//Middlewares
app.use(morgan('tiny'));

//routes handler
mythical_weapon_routes(app);

article_routes(app);

users_routes(app);

app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
