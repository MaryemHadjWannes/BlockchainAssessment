# Blockchain Assessment

## Part 1: Understanding Infinets and Blockchain

## Part 2: Hands-on with Odyssey.js
### Task 1: Setting Up a Node.js Backend with Odyssey.js

- odyessey.js Installation
  
  Clone the OdysseyJS repository:
  
  `git clone https://github.com/DioneProtocol/odysseyjs.git`

  Then build it:
  
  `npm run build`

  Import The OdysseyJS library to the Node.js project:

  ```javascript
  const odyssey = require("./odysseyjs");
  ```

  Create an instance of OdysseyJS connected to Odyssey Chain Testnet.
  ```javascript
  // Initialize Odyssey connection
  const ip = 'testnode.dioneprotocol.com';
  const portOdyssey = 443;
  const protocol = 'https';
  const networkID = 131313;
  const odyssey = new Odyssey(ip, portOdyssey, protocol, networkID);
  const dchain = odyssey.DChain() ; // Using D-Chain
  ```

  API Base URL : D-Chain
  ```javascript
  const API_BASE_URL = 'https://api.odysseyscan.com/api/v2/'; // API base URL - Infinet (D-Chain)
  ```

- API GET /latest-block
  ```javascript
  // Endpoint to get the latest block data
  app.get('/latest-block', async (req, res) => {
  
  
    try {
      const response = await axios.get(`${API_BASE_URL}/blocks`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
  
      console.log(response.data); // Debugging line to check the response structure
      const latestBlock = response.data.items[0]; // Get the latest block (first item in the array)
      res.json({
        message: `The Latest Block is: ${latestBlock.height}`,
        blockData: latestBlock
      });
  
    } catch (error) {
      console.error(error); // Debugging line to check the error
      res.status(500).json({ error: error.message });
    }
  
  });
  ```
  ![image](https://github.com/user-attachments/assets/03f1e0b7-1431-4fb6-8463-1ec60edbfb8b)


- API POST /send-transaction
  
  Using Odyssey.js (Failed)
  ```javascript
  // Attempt to send a transaction using Odyssey.js
  const u = await dchain.getUTXOs(addresses); // Retrieve UTXOs
  const utxos = u.utxos;  
  
  const dioneAssetID = await dchain.getDIONEAssetID(); // Get DIONE asset ID
  console.log(dioneAssetID);
  
  const sendAmount = new BN(100); // Amount to send in BN format
  const friendsAddress = "D-dione15swhcjrjujwfctr0863slfytde2y2u3sfa800f"; // Bech32 address format
  
  const unsignedTx = await dchain.buildBaseTx(
    utxos,
    sendAmount,
    [friendsAddress],
    addressStrings,
    addressStrings,
    dioneAssetID
  );
  
  const signedTx = dchain.signTx(unsignedTx); // Sign the transaction
  const txid = await dchain.issueTx(signedTx); // Issue the transaction
  
  // Get transaction status
  const status = await dchain.getTxStatus(txid);
  ```
  Using Web3.js (Alternative Approach - just to get the tx hash and see it in the https://testnet.odysseyscan.com/)
  ```javascript
  // Successful implementation using Web3.js
  const privateKey = "f27ee3fa4362a2d7557729fb1fc1e0a814a7023abaeb25683e73590d1c1e9f4f"; // Sender's private key
  const senderAddress = "0x866f3469B51aE034C03eaD6702dfd8D5ca523429"; // Sender's address
  const recipientAddress = "0xE0Cc47D634C9855B40bdD6a48F897e5F6cF87025"; // Recipient's address
  const amount = web3.utils.toWei("1", "ether"); // 1 DIONE in wei
  
  (async () => {
    try {
      const nonce = await web3.eth.getTransactionCount(senderAddress, "pending");
      const currentGasPrice = await web3.eth.getGasPrice();
      const gasPrice = BigInt(currentGasPrice) + BigInt(50000000000);
  
      const txObject = {
        from: senderAddress,
        to: recipientAddress,
        value: amount,
        gas: 21000, // Standard gas limit
        gasPrice: gasPrice.toString(),
        nonce: nonce,
        chainId: 131313, // Odyssey testnet chain ID
      };
  
      const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
      console.log("Transaction successful with hash:", receipt.transactionHash);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  })();
  ```
  the transaction hash is logged to the console.
  
  `
  Transaction successful with hash: 0x7aad694e5c1375842b1ebaea5723b2eac1cf4e14f89791bd3a59e76f50c7241d
  `

  The transaction has been successfully recorded on OdysseyScan https://testnet.odysseyscan.com/tx/0x7aad694e5c1375842b1ebaea5723b2eac1cf4e14f89791bd3a59e76f50c7241d .
  ![image](https://github.com/user-attachments/assets/ae6e43f5-4e79-4e45-aa3c-2d43f8983747)

  
### Task 2: Interacting with the Odyssey chain Network (Infinet Simulation)
1. backend function to Query the status of a subnet.
  ```javascript
  // Function to query subnet status
  async function querySubnetStatus(subnetId) {
    let apiUrl = '';
  
    // Determine the correct URL based on the subnetId
    switch (subnetId) {
      case 'D':
        apiUrl = 'https://api.odysseyscan.com/api/v2/stats';
        break;
      case 'A':
        apiUrl = 'https://api.odysseyscan.com/api/v2/A/stats';
        break;
      case 'O':
        apiUrl = 'https://api.odysseyscan.com/api/v2/O/stats';
        break;
      default:
        throw new Error('Invalid subnet ID. Please use "D", "A", or "O" as valid subnet identifiers.');
    }
  
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error(`Error querying subnet status for ${subnetId}:`, error);
      throw new Error('Unable to fetch subnet status');
    }
  }
  ```

  API endpoint to get the status of a subnet
  ```javascript
  //API endpoint to get the status of a subnet
  app.get('/subnet-status/:subnetId', async (req, res) => {
    const subnetId = req.params.subnetId;
  
    try {
      const status = await querySubnetStatus(subnetId);
      res.json({
        message: `Status of subnet ${subnetId}`,
        data: status,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  ```
  ![image](https://github.com/user-attachments/assets/84671e57-428b-4c59-b44f-c92ee81a2677)
  ![image](https://github.com/user-attachments/assets/13bb2955-d752-4e99-bec1-83c9a549402e)
  ![image](https://github.com/user-attachments/assets/fd3d8900-2ba1-4d72-a48b-6347a3210547)

2. Send a transaction to an address on a subnet.
   
  
  ```javascript
  // Function to Send a transaction to an address on a subnet
  async function sendDIONE(networkHost, networkID, senderPrivateKey, recipientAddress, amount, assetID) {
    const odyssey = new Odyssey(networkHost, 9650, "http", networkID);
    const achain = odyssey.AChain();
    
    const keychain = achain.keyChain();
    const senderKey = keychain.importKey(Buffer.from(senderPrivateKey, "hex"));
    
    const senderAddresses = keychain.getAddressStrings();
    const utxos = (await achain.getUTXOs(senderAddresses)).utxos;
    
    const sendAmount = new BN(amount); // amount to send in base units
    const unsignedTx = await achain.buildBaseTx(
        utxos,
        sendAmount,
        [recipientAddress],
        senderAddresses,    
        senderAddresses,    
        assetID             
    );
    
    const signedTx = unsignedTx.sign(keychain);
    const txID = await achain.issueTx(signedTx);
    
    console.log("Transaction sent! TX ID:", txID);
    return txID;
  }
  ```


- A backend service that uses the Odyssey chain JavaScript SDK to interact with two different Odyssey chain subnets.
- 
  In this case we can use the export/import functions !! 
  ```javascript
  // Endpoint: Transfer DIONE between subnets
  app.post('/transfer', async (req, res) => {
    const { fromSubnet, toSubnet, amount } = req.body;
  
    try {
      const senderAddresses = achain.keyChain().getAddressStrings();
      const recipientAddresses = dchain.keyChain().getAddressStrings();
      const dioneAssetID = achain.getDIONEAssetID();
  
      const alphaUTXOResponse = await achain.getUTXOs(senderAddresses);
      const utxoSet = alphaUTXOResponse.utxos;
      const exportTx = await achain.buildExportTx(
        utxoSet,
        new BN(amount),
        toSubnet === 'D' ? dchain.getBlockchainID() : achain.getBlockchainID(),
        recipientAddresses,
        senderAddresses,
        senderAddresses
      );
  
      const signedTx = exportTx.sign(aKeychain);
      const txId = await achain.issueTx(signedTx);
      res.json({ message: `Transaction successful! TXID: ${txId}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  ```



### Task 3: Backend API for Odyssey chain Asset Transfer


