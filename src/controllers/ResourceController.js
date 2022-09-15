const Web3Service = require('../services/web3');

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

        let resources = web3.contract.methods.listReferencesThird(patient, key).call().catch(e => {
            return response.status(400)
                .json({ error: e });
        });

        return response.json(resources);
    }
}