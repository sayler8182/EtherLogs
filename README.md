Ethereum logs decoder
==========

Ethereum logs decoder decode logs to readable form.

## Recommended

- node v10.16.0
- npm 6.9.0

## Installation

* Copy **logs.js** file to your project
* ```npm install web3-eth-abi```

## Example

``` js
{ 
    blockNumber: 44,
    blockHash: '0x61a0a1580ede0084872c818c10e0be819834d899b824524b4793982e67e05b5b',
    transactionIndex: 0,
    address: '0x378f5dCC12E37941859ae94D0ccddad4aB443A16',
    data: '0x0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000005d76032e',
    topics: [ 
        '0x5094b9d13a44bfd1835d61856e3b07b771110a7e457378a59c72fc8bb71ab526',
        '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563',
        '0x000000000000000000000000b5142c3ca4b1466c90f7b0933171de1f3d34cdfe' 
    ],
    transactionHash: '0x13bc4a9dcd67106627c4c8ab72598e3aa747e437e87bbc57494f9517799d29f4',
    logIndex: 0 
}  
```

**is converted to:**

``` js
{ 
    name: 'EscrowStatusChanged',
    args: { 
        escrowId: '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563',
        sender: '0xb5142c3Ca4b1466c90f7b0933171de1F3D34CDFE',
        status: '3',
        blocktime: '1568015150' 
    },
    source: { 
        blockNumber: 44,
        blockHash: '0x61a0a1580ede0084872c818c10e0be819834d899b824524b4793982e67e05b5b',
        transactionIndex: 0,
        address: '0x378f5dCC12E37941859ae94D0ccddad4aB443A16',
        data: '0x0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000005d76032e',
        topics: [ 
            '0x5094b9d13a44bfd1835d61856e3b07b771110a7e457378a59c72fc8bb71ab526',
            '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563',
            '0x000000000000000000000000b5142c3ca4b1466c90f7b0933171de1f3d34cdfe' 
        ],
        transactionHash: '0x13bc4a9dcd67106627c4c8ab72598e3aa747e437e87bbc57494f9517799d29f4',
        logIndex: 0 
    } 
}
```
## Usage

``` js
    const query = {
        fromBlock: 0,
        address: "0xContractAddress",
        topics: [
            "someSignature",
            "someParameter",
        ],
    };
    const provider = new JsonRpcProvider({ url: `localhost:port` });
    const logs = await provider.getLogs(query);
    const eventsLogs = parseLogs(logs, SomeContract.abi);
    console.log(eventsLogs);
```