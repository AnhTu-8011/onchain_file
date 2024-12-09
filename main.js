
const connectButton = document.getElementById("connect-button");

connectButton.addEventListener("click", async () => {
  // Check if MetaMask is installed
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Acccounts now exposed
      web3.eth.getAccounts().then(console.log);
    } catch (error) {
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
    // Acccounts always exposed
    web3.eth.getAccounts().then(console.log);
  }
  // Non-dapp browsers...
  else {
    console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
  }
});

