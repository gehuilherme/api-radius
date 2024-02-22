const { error } = require('console');
const database = require('../database/connection');
const redis = require('redis');
const cache = redis.createClient();

class FindController {
    async findUserData(req, res) {
        try {
            const { mac } = req.body;

            const usernameCache = await cache.get(mac + "_" + login)

            if(!usernameCache){
                const usernameResult = await database
                    .select("username")
                    .from("radcheck")
                    .where({ "attribute": "Calling-Station-Id", "op": "=", "value": mac })
                    .first()
                    
                    if (!usernameResult) {
                        return res.status(404).json({ error: 'MAC não encontrado' });
                    }
                    
                const login = usernameResult.username;
                await cache.set(mac + "_" + login, login, { EX: 36000 })
            }

            const passwordCache = await cache.get(mac + "_" + login)

            if(!passwordCache){
                const passwordResult = await database
                    .select("value")
                    .from("radcheck")
                    .where({ "username": login, "attribute": "User-Password" })
                    .first()

                if (!passwordResult) {
                    return res.status(404).json({ error: 'Senha não encontrada' });
                }

                const senha = passwordResult.value;
                await cache.set(mac + "_" + senha, senha, { EX: 36000 })
            }
            if(usernameCache && passwordCache){
                login = usernameCache
                senha = passwordCache
                res.json({ login, senha });
            }
            res.json({ login, senha });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new FindController();
