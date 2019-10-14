const Abi = require('web3-eth-abi')

/**
* @typedef {Object} Log
* @property {number} blockNumber
* @property {string} blockHash
* @property {number} transactionIndex
* @property {boolean} removed
* @property {number} transactionLogIndex
* @property {string} address
* @property {string} data
* @property {string[]} topics
* @property {string} transactionHash
* @property {number} logIndex
*/

/**
* @typedef {Object} Input 
* @property {string} internalType
* @property {string} name
* @property {string} type
* @property {boolean} indexed
*/

/**
* @typedef {Object} Output 
* @property {string} internalType
* @property {string} name
* @property {string} type
* @property {boolean} indexed
*/

/**
* @typedef {Object} ContractAbi
* @property {boolean} constant
* @property {Input[]} inputs
* @property {string} name
* @property {Output[]} outputs
* @property {number} payable
* @property {string} stateMutability
* @property {string} type
* @property {boolean} anonymous
*/

/**
* @typedef {Object} ContractAbi
* @property {boolean} constant
* @property {Input[]} inputs
* @property {string} name
* @property {Output[]} outputs
* @property {number} payable
* @property {string} stateMutability
* @property {string} type
* @property {boolean} anonymous
*/

/**
* Indexed type
*
* @param {string} type type
* @returns {string} indexed type
*/
const indexedType = (type) => {
    const availableTypes = ['uint', 'int', 'byte', 'bool', 'address', '[]'];
    for (const availableType of availableTypes) {
        if (type.includes(availableType)) {
            return type;
        }
    }
    return "bytes32";
};

/**
* Decode parameters
*
* @param {string[]} names log names
* @param {string[]} types log types
* @param {string} data log data
* @returns {Object} decoded parameters
*/
const decodeParameters = (names, types, data) => {
    const decoded = {};
    if (names.length && names.length === types.length) {
        const result = Abi.decodeParameters(types, data);
        for (let i = 0; i < types.length; i++) {
            decoded[names[i]] = result[i];
        }
    }
    return decoded;
}

/**
* Arguments parser
*
* @param {Log} log Ethereum log
* @param {Input[]} inputs ABI item Inputs 
* @returns {Array} Parsed logs
*/
const argsParser = (log, inputs) => {
    const indexedNames = [];
    const indexedTypes = [];
    const nonIndexedNames = [];
    const nonIndexedTypes = [];

    inputs.forEach(({ indexed, name, type }) => {
        if (indexed) {
            indexedNames.push(name);
            indexedTypes.push(indexedType(type));
        } else {
            nonIndexedNames.push(name);
            nonIndexedTypes.push(type);
        }
    });

    const { topics, data } = log;
    const indexedData = topics.slice(1).map(t => t.slice(2)).join('');
    const nonIndexedData = data.slice(2);
    return {
        ...decodeParameters(indexedNames, indexedTypes, indexedData),
        ...decodeParameters(nonIndexedNames, nonIndexedTypes, nonIndexedData),
    };
}

/**
* Parse logs to readable form
* 
* @param {Log[]} logs Ethereum logs
* @param {ContractAbi[]} abi Contract ABI
* @returns {Array} Parsed logs
*/
const parseLogs = (logs, abi) => {
    const events = abi
        .filter((i) => !i.anonymous)
        .map(item => {
            const inputs = item.inputs || [];
            return {
                name: item.name,
                signature: Abi.encodeEventSignature(`${item.name}(${inputs.map((i) => i.type).join(",")})`),
                args: argsParser(inputs),
            };
        });

    const result = logs.reduce((values1, log) => {
        const value1 = events.reduce((values2, event) => {
            if (log.topics[0] !== event.signature) { return values2; };
            const value2 = {
                name: event.name,
                address: log.address,
                blockNumber: log.blockNumber,
                blockHash: log.blockHash,
                transactionHash: log.transactionHash,
                args: event.args(log),
                source: log,
            };
            values2.push(value2);
            return values2;
        }, []);
        values1.push(...value1);
        return values1;
    }, []);
    return result;
}

module.exports = {
    parseLogs,
};