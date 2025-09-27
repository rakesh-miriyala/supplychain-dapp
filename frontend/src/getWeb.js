import Web3 from "web3";
import SupplyChain from "./contracts/SupplyChain.json";

const getWeb3 = async () => {
  // 1. connect MetaMask
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // 2. get accounts
    const accounts = await web3.eth.getAccounts();

    // 3. find the network where contract is deployed
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = SupplyChain.networks[networkId];

    if (!deployedNetwork) {
      alert("Contract not deployed on this network. Please run `truffle migrate --reset`.");
      return;
    }

    // 4. make contract instance
    const contract = new web3.eth.Contract(
      SupplyChain.abi,
      deployedNetwork.address
    );

    return { web3, accounts, contract };
  } else {
    alert("Please install MetaMask!");
  }
};

export default getWeb3;
