import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

//use JWT to ensure that users can only edit their own user settings
const authorization = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader: string = req.header(
            'authorization'
        ) as string;

        const decoded = jwt.verify(
            authorizationHeader,
            process.env.JWT_SECRET as string
        ) as JwtPayload;
        if (decoded.username !== req.body.username) {
            throw new Error();
        }

        next()

    } catch (err) {
        res.status(401);
        res.json(
            'User username does not match: username desnot match the token payload username...'
        );
        return;
    }
};

export default authorization;