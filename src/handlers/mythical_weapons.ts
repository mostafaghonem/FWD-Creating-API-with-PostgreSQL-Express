import express , {Request , Response} from 'express'
import {Weapon , MythicalWeaponStore} from '../models/mythical_weapon'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

const store = new MythicalWeaponStore();

const index = async(_req :Request , res : Response)=>{
    const weapons = await store.index();
    res.json(weapons);
    // res.send('Hello from Products...')
}

const create = async(_req:Request , res:Response)=>{
    const weapon : Weapon ={
        name : _req.body.name,
        type : _req.body.type,
        weight : _req.body.weight
    }
    try{
        const authorizationHeader:string = _req.header('authorization') as string;
        jwt.verify(authorizationHeader , process.env.JWT_SECRET as string );
    }catch(err){
        res.status(401)
        res.json(`Invalid token ${err}`);
        return
    }
    try{
        const newWeapon = await store.create(weapon);
        res.json(newWeapon)

    }catch(err){
        res.status(400)
        res.json(err)
    }
}

const mythical_weapon_routes = (app:express.Application)=>{
    app.get('/products' , index);
    app.post('/products' , create)
}

export default mythical_weapon_routes