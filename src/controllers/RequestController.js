const uuid = require('uuid');
const crypto = require('crypto');

const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const { id = null } = request.params;

        if (id === null)
            return response.status(400).json({ error: 'id must be passed' });

        let requests = await connection('requests')
            .where('pending', true).andWhere('patient', id)
            .select([
                'id',
                'patient',
                'name',
                'description',
                'pending'
            ]);

        return response.json(requests);
    },

    async create(request, response) {
        const {
            patient = null,
            name = null,
            description = null
        } = request.body;

        if (patient === null)
            return response.status(400).json({ error: 'patient must be passed' });

        if (name === null)
            return response.status(400).json({ error: 'name must be passed' });

        if (description === null)
            return response.status(400).json({ error: 'description must be passed' });

        let key = uuid.v4();

        let salt = crypto.randomBytes(16).toString('hex');
        let hash = crypto.pbkdf2Sync(key, salt, 1000, 64, `sha512`).toString(`hex`);

        const [id] = await connection('requests').insert({
            patient: patient,
            name: name,
            description: description,
            key: hash,
            salt: salt
        });

        return response.json({ id: id, key: key });
    },

    async answer(request, response) {
        const {
            id = null,
            answer = null
        } = request.body;

        if (answer === null)
            return response.status(400).json({ error: 'answer must be passed' });

        if (id === null)
            return response.status(400).json({ error: 'id must be passed' });

        await connection('requests')
            .update({ pending: false, accepted: answer })
            .where('id', id);

        return response.json({});
    },

    async checkAnswer(request, response) {
        const { id = null } = request.body;

        const key = request.headers.authorization;

        if (id === null)
            return response.status(400).json({ error: 'id must be passed' });

        if (key === null)
            return response.status(400).json({ error: 'key must be passed' });

        let sharingRequest = await connection('requests')
            .where('id', id)
            .select('*');

        let hash = crypto.pbkdf2Sync(key, sharingRequest.salt, 1000, 64, `sha512`).toString(`hex`);

        if (hash !== sharingRequest.key)
            return response.status(401).json({ error: 'incorrect key for accessing this request' });

        if (sharingRequest.pending)
            return response.json({ error: 'this request is still pending' });

        return response.json({ id: id, token: sharingRequest.token });
    }
}