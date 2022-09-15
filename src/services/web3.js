const Web3 = require('web3');
const configuration = require('../abis/References.json');

class Web3Service {
    constructor() {
        this.configuration = configuration;
        this.contract_address = configuration.networks['5777'].address;
        this.contract_abi = configuration.abi;

        this.web3 = new Web3(
            Web3.givenProvider || 'http://localhost:7545'
        );

        this.contract = new this.web3.eth.Contract(
            this.contract_abi, this.contract_address
        );
    }
}

module.exports = Web3Service;