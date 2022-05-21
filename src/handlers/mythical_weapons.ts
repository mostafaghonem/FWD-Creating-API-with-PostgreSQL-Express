import express , {Request , Response} from 'express'
import {Weapon , MythicalWeaponStore} from '../models/mythical_weapon'

const store = new MythicalWeaponStore();

const index = async(_req :Request , res : Response)=>{
    const weapons = await store.index();
    res.json(weapons);
    // res.send('Hello from Products...')
}

const mythical_weapon_routes = (app:express.Application)=>{
    app.get('/products' , index);
}

export default mythical_weapon_routes