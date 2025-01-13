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
  ```bash
  ```
  
### Task 2: Interacting with the Odyssey chain Network (Infinet Simulation)
### Task 3: Backend API for Odyssey chain Asset Transfer


