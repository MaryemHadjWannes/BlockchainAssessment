const express = require('express');
const axios = require('axios');
const { Odyssey, BinTools, Buffer, BN, OdysseyCore, keystore } = require('./odysseyjs/dist');
const { Web3 } = require('web3');

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Web3 connection
const web3 = new Web3('https://testnode.dioneprotocol.com/ext/bc/D/rpc'); // RPC URL for Odyssey Chain Testnet

// Initialize Odyssey connection
const ip = 'testnode.dioneprotocol.com';
const portOdyssey = 443;
const protocol = 'https';
const networkID = 131313;
const odyssey = new Odyssey(ip, portOdyssey, protocol, networkID);
const dchain = odyssey.DChain(); // Using D-Chain
const achain = odyssey.AChain();
const info = odyssey.Info();


const API_BASE_URL = 'https://api.odysseyscan.com/api/v2/'; // API base URL - Infinet (D-Chain)
const API_KEY = '0a99528a-46b4-4749-8181-dd14625f5645'; // My API key




/**
 * Endpoint: Get the latest block data.
 */
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



/**
 * Endpoint: Send a transaction.
 */
app.post('/send-transaction', async (req, res) => {
  
  console.log('This is the POST API: /send-transaction');

   // Initialize Keychain for D-Chain
   const keyChain = dchain.keyChain(); 

  // Address 1 - Import private key and create key pair
  const mypk1 = new Buffer(
    "f27ee3fa4362a2d7557729fb1fc1e0a814a7023abaeb25683e73590d1c1e9f4f", // Address1 : 0x866f3469B51aE034C03eaD6702dfd8D5ca523429
    "hex"
    ); 
  const newAddress1 = keyChain.importKey(mypk1);

  // Retrieve addresses managed by the keychain
  const addresses = keyChain.getAddresses();

  // Check if the first address is managed by the keychain
  const exists = keyChain.hasKey(addresses[0]);

  // Get all address strings managed by the keychain
  const addressStrings = dchain.keyChain().getAddressStrings(); 

  // Get KeyPair for Address 1 and extract address and public key
  const keypair1 = keyChain.getKey(addresses[0]); 
  const address1 = keypair1.getAddress(); 
  const addressString1 = keypair1.getAddressString(); 
  const pubkstr1 = keypair1.getPublicKeyString();

  // Verify initial balances for Address 1 and Address 2 
  const balance1 = await web3.eth.getBalance("0x866f3469B51aE034C03eaD6702dfd8D5ca523429");  // returns 1994 DIONE for Address1
  const balance2 = await web3.eth.getBalance("0xE0Cc47D634C9855B40bdD6a48F897e5F6cF87025");  // returns 1 DIONE for Address1

  

  // The commented-out section below used for transaction preparation but it failed -_-
  /*
  const u = await dchain.getUTXOs(addresses); // not working !!!
  const utxos = u.utxos;  

  const dioneAssetID =  await dchain.getDIONEAssetID(); //returns DIONE asset ID     HEX : "dioneAssetID": "b48fd7e3b2d00f98b1078586d8a696d11e2d9c151c44e7919b641423a1d06267"
  console.log(dioneAssetID);  
  
  const sendAmount = new BN(100) // amounts are in BN format
  const friendsAddress = "D-dione15swhcjrjujwfctr0863slfytde2y2u3sfa800f" // address format is Bech32

  const unsignedTx = await dchain.buildBaseTx(
    utxos,
    sendAmount,
    [friendsAddress],
    addressStrings,
    addressStrings,
    assetID
  )
  const signedTx = dchain.signTx(unsignedTx)
  const txid = await dchain.issueTx(signedTx)

  //Get the status of the transaction
  const status = await achain.getTxStatus(txid)

  */ 
 
  // Logic 2 

  // Sender's private key and address
  const privateKey = "f27ee3fa4362a2d7557729fb1fc1e0a814a7023abaeb25683e73590d1c1e9f4f"; // Replace with your private key
  const senderAddress = "0x866f3469B51aE034C03eaD6702dfd8D5ca523429"; // Replace with the sender's address

  // Recipient's address
  const recipientAddress = "0xE0Cc47D634C9855B40bdD6a48F897e5F6cF87025"; // Replace with the recipient's address

  // Amount to send (in wei, smallest unit of DIONE)
  const amount = web3.utils.toWei("1", "ether"); // Sending 1 DIONE  

  (async () => {
    try {
      // Get the current nonce for the sender's address
      const nonce = await web3.eth.getTransactionCount(senderAddress, "pending");

      const currentGasPrice = await web3.eth.getGasPrice(); 
      const gasPrice = BigInt(currentGasPrice) + BigInt(50000000000); 
      console.log("Adjusted gas price:", gasPrice.toString());
  
      // Construct the transaction object
      const txObject = {
        from: senderAddress,
        to: recipientAddress,
        value: amount,
        gas: 21000, // Standard gas limit for simple transfers
        gasPrice: gasPrice.toString(), // Use adjusted gas price
        nonce: nonce,
        chainId: 131313, // the Odyssey testnet chain ID
      };
  
      // Sign the transaction
      const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
  
      // Send the signed transaction
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
      console.log("Transaction successful with hash:", receipt.transactionHash);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  })();

  const balance = await web3.eth.getBalance(senderAddress);
  console.log("Balance in DIONE:", web3.utils.fromWei(balance, "ether"));


  // Respond with the transaction data in JSON format
  res.json({ 
    message: 'POST API accessed successfully!',
    //newAddress1, 
    //addresses,
    //exists,  
    //address1,
    //addressString1, //"2CA6j5zYzasynPsFeNoqWkmTCt3VScMvXUZHbfDJ8k3oGzAPtU-custom15swhcjrjujwfctr0863slfytde2y2u3sn45fwl"
    //pubkstr1,
    //balance1: balance1.toString().substring(0, 17),
    //dioneAssetID: dioneAssetID.toString('hex'),
  });

});


/**
 * Function to query subnet status
 */
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

/**
 * API endpoint to get the status of a subnet
 */
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


/**
 * Function to Send a transaction to an address on a subnet
 */
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

/**
 * Endpoint: Transfer DIONE between subnets
 */
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


// API route to transfer DIONE
app.post("/transfer-dione", async (req, res) => {
  const { senderPrivateKey, senderAddress, recipientAddress, amountInDione } = req.body;

  if (!senderPrivateKey || !senderAddress || !recipientAddress || !amountInDione) {
    return res.status(400).json({
      error: "Missing required fields: senderPrivateKey, senderAddress, recipientAddress, or amountInDione.",
    });
  }

  try {
    // Convert amount to Wei (smallest unit of DIONE)
    const amount = web3.utils.toWei(amountInDione.toString(), "ether");

    // Validate sender's balance
    const balanceWei = await web3.eth.getBalance(senderAddress);
    const balance = web3.utils.fromWei(balanceWei, "ether");

    if (parseFloat(balance) < parseFloat(amountInDione)) {
      return res.status(400).json({
        error: "Insufficient balance.",
        senderBalance: balance,
      });
    }

    // Get current nonce for the sender's address
    const nonce = await web3.eth.getTransactionCount(senderAddress, "pending");

    // Adjust gas price
    const currentGasPrice = await web3.eth.getGasPrice();
    const adjustedGasPrice = BigInt(currentGasPrice) + BigInt(50000000000); // Add 50 Gwei for faster processing

    // Construct transaction object
    const txObject = {
      from: senderAddress,
      to: recipientAddress,
      value: amount,
      gas: 21000, // Standard gas limit for simple transfers
      gasPrice: adjustedGasPrice.toString(),
      nonce: nonce,
      chainId: 131313,
    };

    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(txObject, senderPrivateKey);

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    return res.status(200).json({
      message: "Transaction successful!",
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error("Error during transaction:", error);
    return res.status(500).json({
      error: "Transaction failed.",
      details: error.message,
    });
  }
});



// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});