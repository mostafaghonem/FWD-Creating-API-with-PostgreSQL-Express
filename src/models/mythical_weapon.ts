import Client from '../database'; //this the connection to the database

export type Weapon = {
    name: string;
    type: string;
    weight: string;
};

export class MythicalWeaponStore {
    async index(): Promise<Weapon[]> {
        try {
            const con = await Client.connect();
            
            const sql = 'SELECT * FROM mythical_weapons';
            
            const result = await con.query(sql);
            
            con.release(); //close the connection
            
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get Weapons ${err}`);
        }
    }

    async create(weapon: Weapon): Promise<Weapon> {
        try {
            
            const conn = await Client.connect();
            
            const sql =
                'INSERT INTO mythical_weapons (name, type , weight) VALUES($1, $2 , $3) RETURNING *';

            const result = await conn.query(sql, [
                weapon.name,
                weapon.type,
                weapon.weight
            ]);

            const weapon_ = result.rows[0];
            // console.log(weapon_)
            conn.release();

            return weapon_;
        } catch (err) {
            throw new Error(
                `Could not add article ${weapon.name}. Error: ${err}`
            );
        }
    }
}
