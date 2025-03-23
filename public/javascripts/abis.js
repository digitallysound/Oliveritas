const displayElements = {
    'name': 'nameDisplay',
    'symbol': 'symbolDisplay',
    'totalSupply': 'totalSupplyDisplay',
    'paused': 'pausedDisplay',
};

const outputTypes = {
    'name': 'string',
    'symbol': 'string',
    'totalSupply': 'uint256',
    'paused': 'bool',
};

const balanceOfABI = {
    "inputs": [
        {
            "internalType": "address",
            "name": "account",
            "type": "address"
        }
    ],
    "name": "balanceOf",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
};

const rolesABI = {
    "inputs": [
        {
            "internalType": "address",
            "name": "account",
            "type": "address"
        }
    ],
    "name": "roles",
    "outputs": [
        {
            "internalType": "bool",
            "name": "isProducer",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "isLab",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "isMill",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "isPartner",
            "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function"
};

const batchCoresABI = {
    "inputs": [
        {
            "internalType": "uint256",
            "name": "batchId",
            "type": "uint256"
        }
    ],
    "name": "batchCores",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "batchNumber",
            "type": "uint256"
        },
        {
            "internalType": "address",
            "name": "producer",
            "type": "address"
        },
        {
            "internalType": "address",
            "name": "lab",
            "type": "address"
        },
        {
            "internalType": "address",
            "name": "mill",
            "type": "address"
        },
        {
            "internalType": "uint8",
            "name": "oilPercentage",
            "type": "uint8"
        },
        {
            "internalType": "uint128",
            "name": "oliveKg",
            "type": "uint128"
        },
        {
            "internalType": "uint128",
            "name": "oilQuantity",
            "type": "uint128"
        },
        {
            "internalType": "bool",
            "name": "approvedByMill",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "tokensMinted",
            "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function"
};

const batchDetailsABI = {
    "inputs": [
        {
            "internalType": "uint256",
            "name": "batchId",
            "type": "uint256"
        }
    ],
    "name": "batchDetails",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "batchNumber",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "dateBatchCreation",
            "type": "uint256"
        },
        {
            "components": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "internalType": "struct OliveOilSupplyChain.OliveVariety",
            "name": "olivesVariety",
            "type": "tuple"
        },
        {
            "internalType": "enum OliveOilSupplyChain.OliveOilQuality",
            "name": "qualityCategory",
            "type": "uint8"
        },
        {
            "internalType": "bytes32",
            "name": "secretPhraseHash",
            "type": "bytes32"
        },
        {
            "internalType": "string",
            "name": "origin",
            "type": "string"
        }
    ],
    "stateMutability": "view",
    "type": "function"
};

const pauseABI = {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
};

const unpauseABI = {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
};

const assignRoleABI = {
    "inputs": [
    {
        "internalType": "address",
        "name": "_address",
        "type": "address"
    },
    {
        "internalType": "enum OliveOilSupplyChain.Role",
        "name": "_role",
        "type": "uint8"
    }
    ],
    "name": "assignRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
};

const revokeRoleABI = {
    "inputs": [
    {
        "internalType": "address",
        "name": "_address",
        "type": "address"
    },
    {
        "internalType": "enum OliveOilSupplyChain.Role",
        "name": "_role",
        "type": "uint8"
    }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
};

const createBatchABI = {
    inputs: [
        {
            internalType: "address",
            name: "_producer",
            type: "address"
        },
        {
            internalType: "address",
            name: "_mill",
            type: "address"
        },
        {
            internalType: "enum OliveOilSupplyChain.OliveOilQuality",
            name: "_qualityCategory",
            type: "uint8"
        },
        {
            internalType: "uint8",
            name: "_oilPercentage",
            type: "uint8"
        }
    ],
    name: "createBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
};

const addBatchDetailsABI = {
    "inputs": [
        {
            "internalType": "uint256",
            "name": "_batchNumber",
            "type": "uint256"
        },
        {
            "internalType": "uint128",
            "name": "_oliveKg",
            "type": "uint128"
        },
        {
            "internalType": "bytes32",
            "name": "_secretPhraseHash",
            "type": "bytes32"
        },
        {
            "internalType": "string",
            "name": "_origin",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "_olivesVariety",
            "type": "string"
        }
    ],
    "name": "addQuantityAndHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
};

const approveBatchDetailsABI ={
    "inputs": [
        {
            "internalType": "uint256",
            "name": "_batchNumber",
            "type": "uint256"
        }
    ],
    "name": "approveBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}

const mintTokensABI = {
    "inputs": [
        {
            "internalType": "uint256",
            "name": "_batchNumber",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "_packageSize",
            "type": "uint256"
        }
    ],
    "name": "mintTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}

const transferTokensABI = {
    "inputs": [
        {
            "internalType": "address",
            "name": "_to",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
        }
    ],
    "name": "transfer",
    "outputs": [
        {
            "internalType": "bool",
            "name": "success",
            "type": "bool"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}

const approveTokensABI = {
    "inputs": [
        {
            "internalType": "address",
            "name": "spender",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
        }
    ],
    "name": "approve",
    "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}

const transferFromTokensABI = {
    "inputs": [
        {
            "internalType": "address",
            "name": "from",
            "type": "address"
        },
        {
            "internalType": "address",
            "name": "to",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
        }
    ],
    "name": "transferFrom",
    "outputs": [
        {
            "internalType": "bool",
            "name": "success",
            "type": "bool"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}

const burnTokensABI = {
    "inputs": [
        {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }
    ],
    "name": "burnTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}


const adminABI = {
    "inputs": [],
    "name": "owner",
    "outputs": [
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}

export {
    displayElements,
    outputTypes,
    balanceOfABI,
    rolesABI,
    batchCoresABI,
    batchDetailsABI,
    pauseABI,
    unpauseABI,
    assignRoleABI,
    revokeRoleABI,
    createBatchABI,
    addBatchDetailsABI,
    approveBatchDetailsABI,
    mintTokensABI,
    transferTokensABI,
    approveTokensABI,
    transferFromTokensABI,
    burnTokensABI,
    adminABI
};