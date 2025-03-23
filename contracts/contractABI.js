export const contractABI = [
    {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "BatchAlreadyApproved",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "BatchNotApproved",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CalculationOverflow",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidOliveKg",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidPackageSize",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidRole",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotAuthorized",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotLab",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotMill",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotOwner",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotPartner",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotProducer",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OlivesVarietyAlreadyExists",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OriginAlreadyExists",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "QuantityAlreadyExists",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "SenderNotAuthorized",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "TokensAlreadyMinted",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "batchNumber",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "mill",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint128",
                "name": "oilQuantity",
                "type": "uint128"
            }
        ],
        "name": "BatchApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "batchNumber",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "lab",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "producer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "mill",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "dateBatchCreation",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum OliveOilSupplyChain.OliveOilQuality",
                "name": "qualityCategory",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "oilPercentage",
                "type": "uint8"
            }
        ],
        "name": "BatchCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferStarted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "batchNumber",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "producer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint128",
                "name": "oliveKg",
                "type": "uint128"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "secretPhraseHash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "origin",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "olivesVariety",
                "type": "string"
            }
        ],
        "name": "QuantityAndHashAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "role",
                "type": "uint8"
            }
        ],
        "name": "RoleAssigned",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "role",
                "type": "uint8"
            }
        ],
        "name": "RoleRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokensBurned",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "batchNumber",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "producer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "packageSize",
                "type": "uint256"
            }
        ],
        "name": "TokensMinted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokensTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "acceptOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
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
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "burnTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_producer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_mill",
                "type": "address"
            },
            {
                "internalType": "enum OliveOilSupplyChain.OliveOilQuality",
                "name": "_qualityCategory",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "_oilPercentage",
                "type": "uint8"
            }
        ],
        "name": "createBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
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
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
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
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pendingOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
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
    },
    {
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
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
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
    },
    {
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
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];