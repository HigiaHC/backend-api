const Web3Service = require('../services/web3');
const unixToDate = require("../utils/date");
const { isPatientValid } = require('../utils/resources/patientValidator');

const connection = require('../database/connection');
const fhirApi = require('../services/fhir');
const { isObservationValid } = require('../utils/resources/observationValidator');
const { isDiagnosticValid } = require('../utils/resources/diagnosticValidator');
const { isMedicationRequestValid } = require('../utils/resources/medicationRequestValidator');

module.exports = {
    async index(request, response) {
        const { patient = null } = request.params;
        const key = request.headers.authorization;

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
                type: resource[3],
                date: unixToDate(resource[4]),
                from: resource[2]
            });
        }
        console.log(resources);

        return response.json(resources);
    },

    async show(request, response) {
        const { patient = null, type = null, id = null } = request.params;
        const key = request.headers.authorization;

        const web3 = new Web3Service();

        if (patient === null)
            return response.status(400).json({ error: 'id must be passed' });

        if (key === null)
            return response.status(400).json({ error: 'key must be passed' });

        if (type === null)
            return response.status(400).json({ error: 'type must be passed' });

        if (id === null)
            return response.status(400).json({ error: 'id must be passed' });

        let isValid = await web3.contract.methods.validateToken(patient, key).call().catch(e => {
            return response.status(400)
                .json({ error: e });
        });
        console.log(isValid);
        if (isValid) {
            try {
                const resource = await fhirApi.get(`/${type}/${id}`);
                if (resource.data !== undefined) {
                    return response.json(resource.data);
                }
            } catch (error) {
                return response.json({error});
            }
        }
        return response.json({});
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
                    return response.status(400).json({ error: 'patient fields are not valid' });
                break;

            case 'observation':
                if (!isObservationValid(fields))
                    return response.status(400).json({ error: 'observation fields are not valid' });
                break;

            case 'diagnosticreport':
                if (!isDiagnosticValid(fields))
                    return response.status(400).json({ error: 'diagnostic fields are not valid' });
                break;
            case 'medicationrequest':
                if (!isMedicationRequestValid(fields))
                    return response.status(400).json({ error: 'medication request fields are not valid' });
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

        await connection('resources')
            .update({ created: true })
            .where('id', id);

        return response.json({});
    },

    async update(request, response) {
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
                    return response.status(400).json({ error: 'patient fields are not valid' });
                break;

            case 'observation':
                if (!isObservationValid(fields))
                    return response.status(400).json({ error: 'observation fields are not valid' });
                break;

            case 'diagnosticreport':
                if (!isDiagnosticValid(fields))
                    return response.status(400).json({ error: 'diagnostic fields are not valid' });
                break;
            case 'medicationrequest':
                if (!isMedicationRequestValid(fields))
                    return response.status(400).json({ error: 'medication request fields are not valid' });
                break;
    
            default:
                return response.status(400).json({ error: 'resource type not defined' });
        }
        console.log(fields)
        try {
            let res = await fhirApi.put(`/${type}/${fields.id}`, fields);
            return response.json({ success: 'resource updated'});
        } catch (error) {
            return
            return response.json({ error });
        }
    },
}