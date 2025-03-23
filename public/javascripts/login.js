import {
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
    burnTokensABI,
    adminABI
} from './abis.js';

import {
    callContractMethod,
} from './contractCallsFn.js';

/////////////////////////BLOCKCHAIN CONNECTION & SMART CONTRACT ADDRESS///////////////////////////
// Initialize Connex
const connex = new Connex({
    node: "https://vethor-node-test.vechaindev.com",
    network: "test"
});
  
// Define thor
const thor = connex.thor;

// Define contract address
const contractAddress = "0x0b099F681aCC132cd70Cdb3cC7c9bDe7dbED3189";

//////////////////////////WALLET CONNECTION//////////////////////////
window.addEventListener('load', async () => {
    const address = await getAddress();
    const role = await getRole(address);

    // Render functions based on the role
    renderFunctions(role);
    if (role === 'producer') {
        renderProducerFunctions();
        console.log('Producer');
    } else if (role === 'lab') {
        renderLabFunctions();
        console.log('Lab');
    } else if (role === 'mill') {
        renderMillFunctions();
    } else if (role === 'partner') {
        renderPartnerFunctions();
    } else if (role === 'admin') {
        renderAdminFunctions();    
        console.log('Admin');
    } else {
        renderGuestFunctions();
    }
});

async function getAddress() {
    const statusDiv = document.getElementById('checkConnBtn');
  
    // Check for VeWorld provider explicitly
    const provider = window.vechain || window.ethereum;
  
    if (!provider) {
      statusDiv.textContent = 'VeWorld wallet not detected.';
      redirectIfNotConnected(); // Redirect here if no provider
      return;
    }
  
    try {
      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });
  
      // Connection successful
      statusDiv.textContent = `Connected: ${accounts[0]}`;
  
      // Set up event listener AFTER initial connection
      if (provider.on) {
        provider.on('accountsChanged', handleAccountsChanged);
      }
        return accounts[0];
  
    } catch (error) {
      // Detailed error handling
      statusDiv.textContent = `Connection failed: ${error.message}`;
      console.error('Wallet connection error:', error);
      redirectIfNotConnected(); // Redirect on connection failure
    }
};
  
function handleAccountsChanged(accounts) {
const statusDiv = document.getElementById('checkConnBtn');
if (!accounts || accounts.length === 0) {
    // No accounts available (likely locked or disconnected)
    statusDiv.textContent = 'Wallet disconnected or locked.';
    redirectIfNotConnected();
} else {
    // Accounts are available
    statusDiv.textContent = `Connected: ${accounts[0]}`;
}
}

async function redirectIfNotConnected() {
    const statusDiv = document.getElementById('checkConnBtn');
    const statusText = statusDiv.textContent;

    // Check if the status indicates a connection failure, no account information, or locked wallet
    if (statusText.startsWith('Connection failed:') ||
        statusText.startsWith('VeWorld wallet not detected.') ||
        statusText.startsWith('Wallet disconnected or locked.') ||
        !statusText.startsWith('Connected:')) {
        window.location.href = '/';
    }
}

async function getRole(address) {
   
    // Retrieve the role based on the address
    try {
        const result = await thor.account(contractAddress).method(rolesABI).call(address);
        const roles = result.decoded;
        if (roles[0]) {
            return 'producer';
        } else if (roles[1]) {
            return 'lab';
        } else if (roles[2]) {
            return 'mill';
        } else if (roles[3]) {
            return 'partner';
        } else {
            const adminResult = await thor.account(contractAddress).method(adminABI).call();
            const adminAddress = adminResult.decoded[0]; 
            if (adminAddress.toLowerCase() === address.toLowerCase()) {
                return 'admin';
            } else {
                return 'guest';
            }
        }
    } catch (error) {
        console.error('Error calling roles:', error);
        return 'guest';
    }
}

////////////////////////////////////CONTRACT INFO/////////////////////////////////////
async function updateContractInfo() {
    const promises = Object.entries(displayElements).map(([method, elementId]) => {
        const methodABI = {
            constant: true,
            inputs: [],
            name: method,
            outputs: [{ name: "", type: outputTypes[method] }],
            payable: false,
            stateMutability: "view",
            type: "function"
        };

        return thor.account(contractAddress).method(methodABI).call()
            .then(output => ({ method, elementId, output }))
            .catch(error => ({ method, elementId, error }));
    });

    Promise.all(promises).then(results => {
        results.forEach(result => {
            if (result.error) {
            } else {
                const { method, elementId, output } = result;
                if (output && output.decoded) {
                    document.getElementById(elementId).innerHTML = output.decoded[0];
                } else {
                }
            }
        });
    });
}

// Initialize contract info when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await updateContractInfo();
    } catch (error) {
        console.error('Error initializing contract info:', error);
    }
});

document.getElementById('checkBalance').addEventListener('click', async () => {
    const address = document.getElementById('accountQuery').value;
    await callContractMethod(balanceOfABI, [address], 'viewFunction', decoded => `The balance of ${address} is ${decoded[0]}`);
});

document.getElementById('checkRolesBtn').addEventListener('click', async () => {
    const address = document.getElementById('accountQuery').value;
    await callContractMethod(rolesABI, [address], 'viewFunction', decoded => `
        The roles of ${address} are:
        Producer: ${decoded[0]},
        Lab: ${decoded[1]},
        Mill: ${decoded[2]},
        Partner: ${decoded[3]}
    `);
});

document.getElementById('checkBatchCoresBtn').addEventListener('click', async () => {
    const batchId = document.getElementById('viewBatchId').value;
    await callContractMethod(batchCoresABI, [batchId], 'viewBatchCoreDetails', decoded => `
        Batch ID: ${batchId}<br>
        Batch Number: ${decoded[0]}<br>
        Producer: ${decoded[1]}<br>
        Lab: ${decoded[2]}<br>
        Mill: ${decoded[3]}<br>
        Oil Percentage: ${decoded[4]}%<br>
        Olive Kg: ${decoded[5]}<br>
        Oil Quantity: ${decoded[6]}<br>
        Approved By Mill: ${decoded[7]}<br>
        Tokens Minted: ${decoded[8]}
    `);
});

// Helper function to convert quality category number to description
function getQualityDescription(categoryNumber) {
    const categories = {
        '0': 'Early Harvest',
        '1': 'Organic Extra Virgin',
        '2': 'Extra Virgin'
    };
    return categories[categoryNumber] || 'Unknown Category';
}

document.getElementById('checkBatchDetailsBtn').addEventListener('click', async () => {
    const batchId = document.getElementById('viewBatchId').value;
    await callContractMethod(batchDetailsABI, [batchId], 'viewBatchCoreDetails', decoded => `
        Batch ID: ${batchId}<br>
        Batch Number: ${decoded[0]}<br>
        Batch Harvest/Creation: ${new Date(decoded[1] * 1000).toLocaleString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
        )}<br>
        Olive Variety: ${decoded[2].name}<br>
        Quality Category: ${getQualityDescription(decoded[3])}<br></br>
        Secret Phrase Hash: ${decoded[4]}<br>
        Origin: ${decoded[5]}
    `);
});

////////////////////////////////////////RENDER FUNCTIONS ACCORDING TO ROLE//////////////////////////////////////////
function renderFunctions(activeRole) {
    const roles = ['admin', 'producer', 'lab', 'mill', 'partner', 'guest'];
    roles.forEach(role => {
        const element = document.getElementById(role);
        if (element) {
            element.style.display = role === activeRole ? 'block' : 'none';
        }
    });
}

function renderAdminFunctions() {
    renderFunctions('admin');
}

function renderProducerFunctions() {
    renderFunctions('producer');
}

function renderLabFunctions() {
    renderFunctions('lab');
}

function renderMillFunctions() {
    renderFunctions('mill');
}

function renderPartnerFunctions() {
    renderFunctions('partner');
}

function renderGuestFunctions() {
    renderFunctions('guest');
}

////////////////////////////////////////ACTION FUNCTION//////////////////////////////////////////
async function handleTransaction(methodABI, params, statusElementId, successMessage, errorMessage) {
    try {
        const result = await signAndSendTransaction(methodABI, params);
        console.log('Transaction signed:', result.txid);
        document.getElementById(statusElementId).textContent = `${successMessage} Transaction ID: ${result.txid}`;
    } catch (error) {
        console.error('Signing failed:', error);
        document.getElementById(statusElementId).textContent = `${errorMessage} ${error.message}`;
    }
}

async function signAndSendTransaction(methodABI, params) {
    const accounts = await getVeWorldAccounts();
    const clause = connex.thor.account(contractAddress).method(methodABI).asClause(...params);
    const signingService = connex.vendor.sign('tx', [clause]);
    signingService.signer(accounts[0]);
    return await signingService.request();
}

async function getVeWorldAccounts() {
    if (typeof window.vechain === 'undefined') {
        throw new Error('Wallet not detected.');
    }
    const accounts = await window.vechain.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
        throw new Error('No accounts found.');
    }
    return accounts;
}

document.getElementById('pauseBnt').addEventListener('click', () => handleTransaction(pauseABI, [], 'pausestatus', 'Contract paused.', 'Failed to pause the contract:'));
document.getElementById('unpauseBnt').addEventListener('click', () => handleTransaction(unpauseABI, [], 'pausestatus', 'Contract unpaused.', 'Failed to pause the contract:'));
document.getElementById('assignRoleBnt').addEventListener('click', () => handleTransaction(assignRoleABI, [document.getElementById('roleAddress').value, document.getElementById('roleType').value], 'assignedRole', 'Role assigned.', 'Failed to assign role:'));
document.getElementById('revokeRoleBnt').addEventListener('click', () => handleTransaction(revokeRoleABI, [document.getElementById('roleAddress').value, document.getElementById('roleType').value], 'assignedRole', 'Role revoked.', 'Failed to revoke role:'));
document.getElementById('createBatchBnt').addEventListener('click', () => handleTransaction(createBatchABI, [document.getElementById('createBatchProducer').value, document.getElementById('createBatchMill').value, document.getElementById('createBatchQualityType').value, document.getElementById('createBatchOilPercent').value], 'batchCreation', 'Batch Creation done.', 'Batch Creation failed:'));

// Declare qrCodeImage in wider scope so it's accessible
let qrCodeImage;

async function generateQRCode() {
    try {
        const url = ("http://192.168.238.234:3000/authenticityCheck?batchId=" + document.getElementById('batchNumberDetails').value + "&secretSentence=" + document.getElementById('secretSentence').value);
        qrCodeImage = await QRCode.toDataURL(url); // Now it updates the outer variable
        const qrCodeElement = document.getElementById('qrcode');
        
        if (!qrCodeElement) {
            throw new Error('QR code element not found');
        }
        
        qrCodeElement.innerHTML = `<img src="${qrCodeImage}" alt="QR Code"/>`;
        console.log('QR code generated successfully');
    } catch (err) {
        console.error('Error generating QR code:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Get reference to the buttons
    const addBatchDetailsBtn = document.getElementById('addBatchDetailsBnt');
    const downloadQRBtn = document.getElementById('downloadQRBtn');

    if (addBatchDetailsBtn) {
        addBatchDetailsBtn.addEventListener('click', async () => {
            try {
                // 1. Get input values
                const batchNumber = document.getElementById('batchNumberDetails').value;
                const secretSentence = document.getElementById('secretSentence').value;
                const oliveKg = document.getElementById('oliveKg').value;
                const origin = document.getElementById('origin').value;
                const variety = document.getElementById('variety').value;

                // 2. Generate hash of secret sentence
                if (!window.crypto || !window.crypto.subtle) {
                    throw new Error("Web Crypto API is not available");
                }

                const encoder = new TextEncoder();
                const data = encoder.encode(secretSentence);
                const hashBuffer = await crypto.subtle.digest("SHA-256", data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const secretSentenceHashHex = hashArray.map(b => 
                    b.toString(16).padStart(2, '0')).join('');

                // 3. Generate QR Code
                await generateQRCode();

                // 4. Handle blockchain transaction
                await handleTransaction(
                    addBatchDetailsABI, 
                    [
                        batchNumber,
                        oliveKg,
                        "0x" + secretSentenceHashHex,
                        origin,
                        variety
                    ],
                    'batchCreation', 
                    'Batch Creation done.', 
                    'Batch Creation failed:'
                );

            } catch (error) {
                console.error('Error in batch details processing:', error);
                // Display error to user
                if (document.getElementById('batchCreation')) {
                    document.getElementById('batchCreation').textContent = 
                        `Error processing batch details: ${error.message}`;
                }
            }
        });
    } else {
        console.error('Add Batch Details button not found');
    }

    // Download QR code button logic
    if (downloadQRBtn) {
        downloadQRBtn.addEventListener('click', () => {
            const qrImg = document.querySelector('#qrcode img');
            const imageSource = qrCodeImage || (qrImg ? qrImg.src : null);
            
            if (!imageSource) {
                console.error('No QR code image found to download');
                return;
            }
            
            const link = document.createElement('a');
            link.href = imageSource;
            link.download = 'qrcode.png';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});

document.getElementById('approveBatchBnt').addEventListener('click', () => handleTransaction(approveBatchDetailsABI, [document.getElementById('approveBatchId').value], 'approveBatch', 'Batch approved.', 'Failed to approve the batch:'));
document.getElementById('mintTokensBnt').addEventListener('click', () => handleTransaction(mintTokensABI, [document.getElementById('mintBatch').value, document.getElementById('packageSizeChoice').value], 'mintTokens', 'Tokens minted.', 'Failed to mint tokens:'));
document.getElementById('transferTokensBnt').addEventListener('click', () => handleTransaction(transferTokensABI, [document.getElementById('transferTo').value, document.getElementById('transferAmount').value], 'transferTokens', 'Tokens transferred.', 'Failed to transfer tokens:'));
document.getElementById('transferTokensBntPartner').addEventListener('click', () => handleTransaction(transferTokensABI, [document.getElementById('transferToPartner').value, document.getElementById('transferAmountPartner').value], 'transferTokensPartner', 'Tokens transferred.', 'Failed to transfer tokens:'));
document.getElementById('burnTokensBnt').addEventListener('click', () => handleTransaction(burnTokensABI, [document.getElementById('burnAmount').value], 'burnTokens', 'Tokens burned.', 'Failed to burn tokens:'));
document.getElementById('burnTokensBntPartner').addEventListener('click', () => handleTransaction(burnTokensABI, [document.getElementById('burnAmountPartner').value], 'burnTokensPartner', 'Tokens burned.', 'Failed to burn tokens:'));
document.getElementById('burnTokensBntGuest').addEventListener('click', () => handleTransaction(burnTokensABI, [document.getElementById('burnAmountGuest').value], 'burnTokensGuest', 'Tokens burned.', 'Failed to burn tokens:'));
