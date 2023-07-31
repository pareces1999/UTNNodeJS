const express = require('express');
const app = express();

// Set up the endpoint to handle the POST request
app.post('/calculateDiscount', (req, res) => {
  let prices = [];

  req.on('data', (chunk) => {
    // Convert the received data to string and split by newline character
    const data = chunk.toString().split('\n');

    // Loop through the received data and add the prices to the array
    data.forEach((price) => {
      const parsedPrice = parseFloat(price);
      if (!isNaN(parsedPrice)) {
        prices.push(parsedPrice);
      }
    });
  });

  req.on('end', () => {
    // Call the calculateDiscount function with the received prices
    const results = calculateDiscount(prices);

    // Send the results back as a JSON response
    res.json({
      itemsToSubtract: results[0],
      totalPrice: results[1],
      totalDiscount: results[2],
      netPrice: results[3],
    });
    

    // Log the JSON response to the console
    console.log(JSON.stringify({
        itemsToSubtract: results[0],
        totalPrice: results[1],
        totalDiscount: results[2],
        netPrice: results[3],    
    }));
  });
});

app.get('/calculateDiscount', (req, res) => {
    res.send('GET request received. the calculateDiscount logic will only be executed when a POST request is sent to the /calculateDiscount endpoint');
  });

// Function to calculate the discount
function calculateDiscount(prices) {
  // Sort the prices in descending order
  const sortedPrices = prices.sort((a, b) => b - a);
  
  // Calculate the number of triples in the list
  const numTriples = Math.floor(prices.length / 3);
  
  // Initialize variables for the total price, total discount, and items to subtract
  let totalPrice = prices.reduce((acc, val) => acc + val, 0);
  let totalDiscount = 0;
  const itemsToSubtract = [];
  
  // Iterate over the triples in the list
  for (let i = 0; i < numTriples; i++) {
    // Calculate the index of the items to subtract
    const index1 = i * 3;
    const index2 = index1 + 2;
  
    // Calculate the price of the items to subtract
    const price1 = sortedPrices[index1];
    const price2 = sortedPrices[index2];
  
    // Add the prices of the items to subtract to the total discount
    totalDiscount += Math.min(price1, price2);
  
    // Add the items to subtract to the list
    itemsToSubtract.push(Math.min(price1, price2));
  }
  
  // Calculate the net price
  const netPrice = totalPrice - totalDiscount;
  
  // Return the results
  return [itemsToSubtract, totalPrice, totalDiscount, netPrice];
}

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
