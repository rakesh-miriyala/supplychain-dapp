import React, { useState, useEffect } from "react";
import {
  connectWallet,
  getAccounts,
  createProduct,
  fetchProduct,
  markForSale,
  shipProduct,
  receiveProduct,
  sellProduct,
  getProductCounter
} from "./BlockchainService";

function App() {
  const [account, setAccount] = useState("");
  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);

  const stateLabels = ["Produced", "ForSale", "Shipped", "Received", "Sold"];
  const stateColors = ["bg-gray-400", "bg-yellow-400", "bg-blue-400", "bg-green-400", "bg-red-400"];

  useEffect(() => {
    (async () => {
      try {
        const accs = await getAccounts();
        if (accs && accs.length) {
          setAccount(accs[0]);
          await loadProducts();
        }
      } catch (err) {
        console.log("Not auto-connected:", err.message);
      }
    })();
  }, []);

  const handleConnect = async () => {
    const accs = await connectWallet();
    if (accs && accs.length) {
      setAccount(accs[0]);
      await loadProducts();
    }
  };

  const handleCreate = async () => {
    if (!productName) { alert("Enter product name"); return; }
    try {
      await createProduct(productName, account);
      setProductName("");
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert("Create failed: " + (err.message || err));
    }
  };

  const loadProducts = async () => {
    try {
      const counter = await getProductCounter();
      let all = [];
      for (let i = 1; i <= counter; i++) {
        const p = await fetchProduct(i);
        all.push(p);
      }
      setProducts(all);
    } catch (err) {
      console.error("Load failed:", err);
    }
  };

  // product action handlers
  const handleMarkForSale = async (sku) => { await markForSale(sku, account); await loadProducts(); };
  const handleShip = async (sku) => {
    const buyer = prompt("Buyer address to ship to:");
    if (!buyer) return;
    await shipProduct(sku, buyer, account);
    await loadProducts();
  };
  const handleReceive = async (sku) => { await receiveProduct(sku, account); await loadProducts(); };
  const handleSell = async (sku) => { await sellProduct(sku, account); await loadProducts(); };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        🚚 Supply Chain DApp
      </h1>
      <button 
        onClick={handleConnect} 
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Connect MetaMask
      </button>
      <p className="mt-2 text-gray-700">Connected: <span className="font-mono">{account || "not connected"}</span></p>

      <hr className="my-6" />
      <h3 className="text-xl font-semibold mb-2">Create Product</h3>
      <div className="flex gap-2">
        <input
          value={productName}
          onChange={e => setProductName(e.target.value)}
          placeholder="Product name"
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <button 
          onClick={handleCreate} 
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Create
        </button>
      </div>

      <hr className="my-6" />
      <h3 className="text-xl font-semibold mb-4">All Products</h3>
      {products.length === 0 ? (
        <p className="text-gray-600">No products yet</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.sku} className="bg-white p-4 rounded-xl shadow">
              <h4 className="text-lg font-bold">{p.name}</h4>
              <p><span className="font-semibold">SKU:</span> {p.sku}</p>
              <p><span className="font-semibold">Owner:</span> <span className="font-mono">{p.owner}</span></p>
              <p>
                <span className="font-semibold">State:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-white text-sm ${stateColors[p.state]}`}>
                  {stateLabels[p.state]}
                </span>
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button 
                  disabled={p.state !== 0} 
                  onClick={() => handleMarkForSale(p.sku)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded disabled:opacity-50"
                >
                  For Sale
                </button>
                <button 
                  disabled={p.state !== 1} 
                  onClick={() => handleShip(p.sku)}
                  className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Ship
                </button>
                <button 
                  disabled={p.state !== 2} 
                  onClick={() => handleReceive(p.sku)}
                  className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                >
                  Receive
                </button>
                <button 
                  disabled={p.state !== 3} 
                  onClick={() => handleSell(p.sku)}
                  className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                >
                  Sell
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
