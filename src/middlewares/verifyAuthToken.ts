import jwt from 'jsonwebtoken'
import { NextFunction , Request , Response} from 'express'

const verifyAuthToken = (req:Request , res:Response , next:NextFunction)=>{
    try{
        const authorizationHeader:string = req.header('authorization') as string;
        jwt.verify(authorizationHeader , process.env.JWT_SECRET as string );
        next()
    }catch(err){
        res.status(401)
        res.json(`Access denied, Invalid token ${err}`);
    }
}

export default verifyAuthToken;