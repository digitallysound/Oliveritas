async function callContractMethod(methodABI, params, elementId, formatOutput) {
    try {
        const result = await thor.account(contractAddress).method(methodABI).call(...params);
        const output = formatOutput(result.decoded);
        document.getElementById(elementId).innerHTML = output;
        console.log(output);
    } catch (error) {
        console.error(`Error calling ${methodABI.name}:`, error);
    }
}

export {
    callContractMethod
};