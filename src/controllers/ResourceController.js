const Web3Service = require('../services/web3');
const unixToDate = require("../utils/date");
const { isPatientValid } = require('../utils/resources/patientValidator');

const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        const { patient = null } = request.params;
        const key = request.headers.authorization;
        console.log(patient);
        console.log(key);

        const web3 = new Web3Service();

        if (patient === null)
            return response.status(400).json({ error: 'id must be passed' });

        if (key === null)
            return response.status(400).json({ error: 'key must be passed' });

        let resourcesArray = await web3.contract.methods.listReferencesThird(patient, key).call().catch(e => {
            return response.status(400)
                .json({ error: e });
        });

        let resources = [];
        for (let resource of resourcesArray) {
            resources.push({
                id: resource[0],
                description: resource[1],
                type: resource[2],
                date: unixToDate(resource[3])
            });
        }

        return response.json(resources);
    },

    async createRequests(request, response) {
        const { address = null } = request.params;

        if (address === null)
            return response.status(400).json({ error: 'address must be passed' });

        let id = address.toLowerCase();

        let requests = await connection('resources')
            .where('created', false).andWhere('patient', id)
            .select('*');

        return response.json(requests);
    },

    async create(request, response) {
        const {
            patient = null,
            description = null,
            type = null,
            fields = null,
            from = null
        } = request.body;

        if (patient === null)
            return response.status(400).json({ error: 'patient must be passed' });

        if (description === null)
            return response.status(400).json({ error: 'description must be passed' });

        if (type === null)
            return response.status(400).json({ error: 'type must be passed' });

        if (fields === null)
            return response.status(400).json({ error: 'fields must be passed' });

        if (from === null)
            return response.status(400).json({ error: 'from must be passed' });

        switch (type.toLowerCase()) {
            case 'patient':
                if (!isPatientValid(fields))
                    return response.status(400).json({ error: 'fields are not valid' });
                break;

            default:
                return response.status(400).json({ error: 'resource type not defined' });
        }

        let [id] = await connection('resources').insert({
            patient: patient.toLowerCase(),
            description: description,
            type: type,
            fields: fields,
            from: from
        });

        return response.json({ success: 'resource request sent to patient', id: id });
    },

    async setCreated(request, response) {
        const { id = null } = request.params;

        if (id === null)
            return response.status(400).json({ error: 'id must be passed' });

        await connection('requests')
            .update({ created: true })
            .where('id', id);

        return response.json({});
    }
}