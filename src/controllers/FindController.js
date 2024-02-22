const { error } = require('console');
const database = require('../database/connection');
const redis = require('redis');

require('dotenv').config()

const cache = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

class FindController {
    async findUserData(req, res) {
        try {
            cache.on('error', err => console.log('Redis Client Error - ', err));
            await cache.connect();

            let login = "";
            let senha = "";
            const { mac } = req.body;

            const usernameResult = await database
                .select("username")
                .from("radcheck")
                .where({ "attribute": "Calling-Station-Id", "op": "=", "value": mac })
                .first()

            if (!usernameResult) {
                return res.status(404).json({ error: 'MAC não encontrado' });
            }
                login = usernameResult.username;
                console.log("[LOG Login] " + login)

            let passwordCache = await cache.get(mac + "_password")

            if(!passwordCache){
                const passwordResult = await database
                    .select("value")
                    .from("radcheck")   
                    .where({ "username": login, "attribute": "User-Password" })
                    .first()

                if (!passwordResult) {
                    return res.status(404).json({ error: 'Senha não encontrada' });
                }

                senha = passwordResult.value;
                console.log("[LOG Senha Banco] " + senha)
                await cache.set(mac + "_password", senha, { EX: 36000 })
            } else {
                senha = passwordCache;
                console.log("[LOG Senha Cache] " + senha)
            }

            res.json({ login, senha });
            await cache.disconnect();
        } catch (err) {
            await cache.disconnect();
            res.status(500).json({ error: 'Internal Server Error - ' + err});
        }
    }
}

module.exports = new FindController();
