import Web3 from "web3";
import SupplyChain from "./contracts/SupplyChain.json";

let web3;
let contract;
let accounts;
let networkId;

async function init() {
  if (contract && web3 && accounts) return { web3, contract, accounts, networkId };

  if (!window.ethereum) {
    throw new Error("MetaMask not detected. Install MetaMask extension and connect it to Ganache.");
  }

  web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: "eth_requestAccounts" });
  accounts = await web3.eth.getAccounts();
  networkId = await web3.eth.net.getId();

  const deployed = SupplyChain.networks[networkId];
  if (!deployed) {
    const avail = Object.entries(SupplyChain.networks)
      .map(([id, info]) => `${id} -> ${info.address}`)
      .join("\n");
    throw new Error(
      `Contract not deployed on network ${networkId}. Deployed networks:\n${avail}\n\n` +
      `Make sure MetaMask is connected to Ganache and you copied the latest build/contracts/SupplyChain.json.`
    );
  }

  contract = new web3.eth.Contract(SupplyChain.abi, deployed.address);
  return { web3, contract, accounts, networkId };
}

export const connectWallet = async () => {
  try {
    await init();
    return accounts;
  } catch (err) {
    console.error(err);
    alert(err.message);
    return [];
  }
};

export const getAccounts = async () => {
  if (!accounts) await init();
  return accounts;
};

async function ensureContract() {
  if (!contract) await init();
  if (!contract) throw new Error("Contract not initialized.");
  return contract;
}

// ✅ Functions
export const createProduct = async (name, from) => {
  const c = await ensureContract();
  return await c.methods.createProduct(name).send({ from });
};

export const fetchProduct = async (sku) => {
  const c = await ensureContract();
  const res = await c.methods.fetchProduct(sku).call();
  return { sku: res[0], name: res[1], owner: res[2], state: parseInt(res[3]) };
};

export const getProductCounter = async () => {
  const c = await ensureContract();
  return await c.methods.productCounter().call();
};

export const markForSale = async (sku, from) => {
  const c = await ensureContract();
  return await c.methods.markForSale(sku).send({ from });
};

export const shipProduct = async (sku, toAddress, from) => {
  const c = await ensureContract();
  return await c.methods.shipProduct(sku, toAddress).send({ from });
};

export const receiveProduct = async (sku, from) => {
  const c = await ensureContract();
  return await c.methods.receiveProduct(sku).send({ from });
};

export const sellProduct = async (sku, from) => {
  const c = await ensureContract();
  return await c.methods.sellProduct(sku).send({ from });
};
