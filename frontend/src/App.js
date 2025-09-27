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
} from "./BlockchainService";

function App() {
  const [account, setAccount] = useState("");
  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");

  const stateLabels = ["Produced", "ForSale", "Shipped", "Received", "Sold"];

  // auto-populate if already connected
  useEffect(() => {
    (async () => {
      try {
        const accs = await getAccounts();
        if (accs && accs.length) setAccount(accs[0]);
      } catch (err) {
        console.log("Not auto-connected:", err.message);
      }
    })();
  }, []);

  const handleConnect = async () => {
    const accs = await connectWallet();
    if (accs && accs.length) setAccount(accs[0]);
  };

  const handleCreate = async () => {
    if (!productName) { alert("Enter product name"); return; }
    try {
      await createProduct(productName, account);
      alert("✅ Product Created!");
      setProductName("");
    } catch (err) {
      console.error(err);
      alert("Create failed: " + (err.message || err));
    }
  };

  const handleFetch = async () => {
    try {
      const d = await fetchProduct(1);
      setProductDetails(`SKU: ${d.sku}, Name: ${d.name}, Owner: ${d.owner}, State: ${stateLabels[d.state]}`);
    } catch (err) {
      console.error(err);
      alert("Fetch failed: " + (err.message || err));
    }
  };

  const handleMarkForSale = async () => {
    try { await markForSale(1, account); alert("Marked for sale"); } catch (e){ alert(e.message || e) }
  };
  const handleShip = async () => {
    const buyer = prompt("Buyer address to ship to:");
    if (!buyer) return;
    try { await shipProduct(1, buyer, account); alert("Shipped"); } catch (e){ alert(e.message || e) }
  };
  const handleReceive = async () => {
    try { await receiveProduct(1, account); alert("Received"); } catch (e){ alert(e.message || e) }
  };
  const handleSell = async () => {
    try { await sellProduct(1, account); alert("Sold"); } catch (e){ alert(e.message || e) }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🚚 Supply Chain DApp</h1>
      <button onClick={handleConnect}>Connect MetaMask</button>
      <p>Connected: {account || "not connected"}</p>

      <hr />
      <h3>Create Product</h3>
      <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Product name"/>
      <button onClick={handleCreate}>Create Product</button>

      <h3>Fetch Product</h3>
      <button onClick={handleFetch}>Fetch Product #1</button>
      <p>{productDetails}</p>

      <h3>Manage Product #1</h3>
      <button onClick={handleMarkForSale}>Mark For Sale</button>
      <button onClick={handleShip}>Ship</button>
      <button onClick={handleReceive}>Receive</button>
      <button onClick={handleSell}>Sell</button>
    </div>
  );
}

export default App;
