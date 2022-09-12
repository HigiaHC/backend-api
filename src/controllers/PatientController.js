const connection = require('../database/connection');
const Web3Service = require('../services/web3');

module.exports = {
    async index(request, response) {
        const web3 = new Web3Service();

        let patientsArray = await web3.contract.methods.listPatients().call().catch(e => {
            return response.status(400)
                .json({ error: e });
        });

        let patients = [];
        for (let patient of patientsArray) {
            patients.push({
                id: patient[0],
                name: patient[1],
                accountType: patient[2]
            });
        }

        return response.json(patients);
    }
}