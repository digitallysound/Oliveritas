import {
    displayElements,
    outputTypes,
    balanceOfABI,
    rolesABI,
    batchCoresABI,
    batchDetailsABI
} from './abis.js';

import {
    callContractMethod
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
                console.error(`Error calling ${result.method} method:`, result.error);
            } else {
                const { method, elementId, output } = result;
                // console.log("Full output:", output);
                if (output && output.decoded) {
                    document.getElementById(elementId).innerHTML = output.decoded[0];
                    console.log(`${method}:`, output.decoded[0]);
                } else {
                    console.error("Unexpected output structure:", output);
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

////////////////////////////////////QR CHECK/////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const batchId = urlParams.get('batchId');
    const accountAddress = urlParams.get('accountAddress');
    const secretSentence = urlParams.get('secretSentence');
  
    if (batchId) {
      document.getElementById('viewBatchId').value = batchId;
      document.getElementById('viewBatchIdQR').value = batchId;
    }
  
    if (accountAddress) {
      document.getElementById('accountQuery').value = accountAddress;
    }

    if (secretSentence) {
      document.getElementById('viewQRsecretSentence').value = secretSentence;
    }

    if (batchId && secretSentence) {
      setTimeout(() => {
        document.getElementById('checkBatchDetailsQRBnt').click();
      }, 1000); // Delay to ensure elements are fully loaded
    }
  });

////////////////////////////////////QR CHECK/////////////////////////////////////
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


document.addEventListener('DOMContentLoaded', () => {
    // Get reference to the buttons
    const checkBatchDetailsQRBnt = document.getElementById('checkBatchDetailsQRBnt');

    if (checkBatchDetailsQRBnt) {
        checkBatchDetailsQRBnt.addEventListener('click', async () => {
            try {
                // 1. Get input values
                const batchNumber = document.getElementById('viewBatchIdQR').value;
                const secretSentence = document.getElementById('viewQRsecretSentence').value;

                // 2. Generate hash of secret sentence
                if (!window.crypto || !window.crypto.subtle) {
                    throw new Error("Web Crypto API is not available");
                }

                const encoder = new TextEncoder();
                const data = encoder.encode(secretSentence);
                const hashBuffer = await crypto.subtle.digest("SHA-256", data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                let secretSentenceHashHex = hashArray.map(b => 
                    b.toString(16).padStart(2, '0')).join('');
                    
                secretSentenceHashHex = "0x" + secretSentenceHashHex;
                // 4. Handle blockchain transaction

                const batchId = document.getElementById('viewBatchIdQR').value;
                await callContractMethod(batchDetailsABI, [batchId], 'checkAuthenticity', decoded => `
                    Batch ID: ${batchId}<br>
                    Batch Number: ${decoded[0]}<br>
                    Secret Phrase in QR: ${secretSentence}<br>
                    Secret Phrase Hash: ${secretSentenceHashHex}<br>
                    Secret Phrase Hash in the blockchain: ${decoded[4]}<br>
                    Are they the same: ${secretSentenceHashHex === decoded[4]}<br>
                    Batch Harvest/Creation: ${new Date(decoded[1] * 1000).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }
                    )}<br>
                    Olive Variety: ${decoded[2].name}<br>
                    Quality Category: ${getQualityDescription(decoded[3])}<br>
                    Origin: ${decoded[5]}`);

            } catch (error) {
                console.error('Error in batch details processing:', error);
                // Display error to user
                if (document.getElementById('batchCreation')) {
                    document.getElementById('batchCreation').textContent = 
                        `Error processing batch details: ${error.message}`;
                }
            }
        });

        // Automatically call the function if URL parameters are present
        const urlParams = new URLSearchParams(window.location.search);
        const batchId = urlParams.get('batchId');
        const secretSentence = urlParams.get('secretSentence');
        if (batchId && secretSentence) {
            setTimeout(() => {
                checkBatchDetailsQRBnt.click();
            }, 1000); // Delay to ensure elements are fully loaded
        }
    } else {
        console.error('Check Batch Details button not found');
    }
});

//////////////////QR handling////////////////////
document.getElementById('scanQrCodeBtn').addEventListener('click', function() {
    const video = document.getElementById('qrVideo');
    video.style.display = 'block';
  
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
    });
  
    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvasElement = document.createElement('canvas');
        const canvas = canvasElement.getContext('2d');
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
  
        if (code) {
          video.pause();
          video.srcObject.getTracks().forEach(track => track.stop());
          video.style.display = 'none';
          handleQrCodeData(code.data);
        } else {
          requestAnimationFrame(tick);
        }
      } else {
        requestAnimationFrame(tick);
      }
    }
  });
  
  function handleQrCodeData(data) {
    const qrData = JSON.parse(data);
    document.getElementById('viewBatchId').value = qrData.batchId;
    document.getElementById('accountQuery').value = qrData.accountAddress;
  }