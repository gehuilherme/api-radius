const { error } = require('console');
const database = require('../database/connection');

class FindController {
    async findUserData(req, res) {
        try {
            const { mac } = req.body;

            const usernameResult = await database
                .select("username")
                .from("radcheck")
                .where({ "attribute": "Calling-Station-Id", "op": "=", "value": mac })
                .first();

            if (!usernameResult) {
                return res.status(404).json({ error: 'MAC não encontrado' });
            }

            const login = usernameResult.username;

            const passwordResult = await database
                .select("value")
                .from("radcheck")
                .where({ "username": login, "attribute": "User-Password" })
                .first();

            if (!passwordResult) {
                return res.status(404).json({ error: 'Senha não encontrada' });
            }

            const senha = passwordResult.value;

            res.json({ login, senha });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new FindController();
