const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const { id = null } = request.params;

        if (id === null)
            return response.status(400).json({ error: 'id must be passed' });

        let requests = await connection('requests')
            .where('pending', true)
            .select('*');

        return response.json(requests);
    },

    async create(request, response) {
        const { patient = null, name = null } = request.body;

        if (patient === null)
            return response.status(400).json({ error: 'patient must be passed' });

        if (name === null)
            return response.status(400).json({ error: 'name must be passed' });

        const [id] = await connection('requests').insert({
            patient,
            name
        });

        return response.json({ id });
    },

    async answer(request, response) {
        const { id = null, answer = null } = request.body;

        if (answer === null)
            return response.status(400).json({ error: 'answer must be passed' });

        if (id === null)
            return response.status(400).json({ error: 'id must be passed' });

        await connection('requests')
            .update({ pending: false, accepted: answer })
            .where('id', id);

        return response.json({});
    }
}