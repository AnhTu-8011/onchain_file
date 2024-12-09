function getWalletInfo() {
    const web3 = new Web3(window.ethereum);
    web3.eth.getAccounts().then(accounts => {
      const address = accounts[0];
      const walletAddress = document.getElementById("wallet-address");
      walletAddress.innerHTML = address;
      web3.eth.getBalance(address).then(balance => {
        const walletBalance = document.getElementById("wallet-balance");
        walletBalance.innerHTML = web3.utils.fromWei(balance, 'ether');
      });
    });
  }
