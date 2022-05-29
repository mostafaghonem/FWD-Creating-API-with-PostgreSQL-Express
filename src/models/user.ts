import bcrypt from 'bcrypt';
import Client from '../database';
import dotenv from 'dotenv';

dotenv.config(); //to Loads .env file contents into `process.env`

const { SALT_ROUNDS, BCRYPT_PASSWORD } = process.env;
const pepper = BCRYPT_PASSWORD;

export type User = {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
};

export class Store {
    async create(u: User): Promise<User> {
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql =
                'INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING *';

            // const salt = await bcrypt.genSaltSync(
            //     parseInt(SALT_ROUNDS as string)
            // ); //generate salt to add it before each password

            // const hash = await bcrypt.hashSync(u.password, salt); //hash each password with a different salt

            //the same result of the above code : BCRYPT_PASSWORD is the pepper value

            const hash = bcrypt.hashSync(
                u.password + pepper,
                parseInt(SALT_ROUNDS as string)
            );

            const result = await conn.query(sql, [u.username, hash]);
            const user = result.rows[0];

            conn.release(); //close the connection

            return user;
        } catch (err) {
            throw new Error(`unable create user (${u.username}): ${err}`);
        }
    }

    async authenticate(
        username: string,
        password: string
    ): Promise<User | string> {
        const conn = await Client.connect();
        const sql = 'SELECT username , password_digest FROM users WHERE username=($1)';

        const result = await conn.query(sql, [username]);

        if (result.rows.length) {
            //Means if the username is correct
            const user = result.rows[0];

            console.log(user);

            if (
                bcrypt.compareSync(
                    password + pepper, //plain password
                    user.password_digest //hashed password from the db
                )
            ) {
                return user;
            }
        }

        return "Inavalid username or password";
    }
}
