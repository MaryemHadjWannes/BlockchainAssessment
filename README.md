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

- API POST /send-transaction
  ```bash
  ```
  
### Task 2: Interacting with the Odyssey chain Network (Infinet Simulation)
### Task 3: Backend API for Odyssey chain Asset Transfer


