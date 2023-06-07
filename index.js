// // Import the Shopify library.
// const { log } = require('console');
// const Shopify = require('shopify');

// const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
// // Create a new Shopify client.
// const client = new Shopify({
//   accessToken: shopifyAccessToken,
// });

// // Get the current shop.
// const shop = await client.getShop();

// // Subscribe to the item_added event.
// Shopify.Events.on('item_added', itemAdded);

// // Function to handle the item added event.
// function itemAdded(event) {
//   // Get the item that was added to the order.
//   var item = event.data.item;

//   // Check if the item has a price of $0.00.
//   if (item.price == 0) {
//     // Set the maximum number of free items allowed in the order.
//     var maxFreeItems = event.data.paidItems * 2;

//     // Check if the number of free items in the order is greater than the maximum allowed.
//     if (event.data.freeItems > maxFreeItems) {
//       // Throw an error.
//     //   throw new Error("The maximum number of free items has been exceeded.");
//         const eventPayload = {
//             message: "The maximum number of free items has been exceeded.",
//         };
      
//       // Trigger a custom Shopify event named "custom_error_event".
//         Shopify.Events.trigger('custom_error_event', eventPayload);

//     } else {
//       // Show the user the error.
//     //   alert("The maximum number of free items has been exceeded.");
//         console.log("order ok",event.data);
//     }
//   }
// }

// // Do something with the shop.
// console.log(shop);



// Import the Shopify SDK
import shopify from 'shopify-buy';

// Set the accessToken property
shopify.accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

// Get the products
async function getProducts() {
    try {
      const products = await shopify.getProducts();
  
      // Render the products
      for (const product of products) {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = product.name;
        document.getElementById('products').appendChild(productDiv);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  // Listen for an item add to order event
  shopify.on('itemAddedToOrder', async (event) => {
    // Check if the item is free
    if (event.product.price === 0) {
      // Check if the max free item amount has been reached
      const maxFreeItemCount = event.order.items.filter(item => item.price > 0).length * 2;
      if (event.order.freeItems.length >= maxFreeItemCount) {
        // Show the customer an error
        shopify.renderError('The maximum number of free items has been reached.', 500);
      } else {
        // Do nothing
      }
    } else {
      // Do nothing
    }
  });
  
  // Get the products
  getProducts();
  
