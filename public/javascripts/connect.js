window.onload = async function() {
    const statusDiv = document.getElementById('checkConnButton');
  
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
  
    } catch (error) {
      // Detailed error handling
      statusDiv.textContent = `Connection failed: ${error.message}`;
      console.error('Wallet connection error:', error);
      redirectIfNotConnected(); // Redirect on connection failure
    }
  };
  
  function handleAccountsChanged(accounts) {
    const statusDiv = document.getElementById('checkConnButton');
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
    const statusDiv = document.getElementById('checkConnButton');
    const statusText = statusDiv.textContent;
  
    // Check if the status indicates a connection failure, no account information, or locked wallet
    if (statusText.startsWith('Connection failed:') ||
        statusText.startsWith('VeWorld wallet not detected.') ||
        statusText.startsWith('Wallet disconnected or locked.') ||
        !statusText.startsWith('Connected:')) {
      window.location.href = '/';
    }
  }