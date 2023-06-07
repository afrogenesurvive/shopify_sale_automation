// Import the Shopify library.
const { log } = require('console');
const Shopify = require('shopify');

const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
// Create a new Shopify client.
const client = new Shopify({
  accessToken: shopifyAccessToken,
});

// Get the current shop.
const shop = await client.getShop();

// Subscribe to the item_added event.
Shopify.Events.on('item_added', itemAdded);

// Function to handle the item added event.
function itemAdded(event) {
  // Get the item that was added to the order.
  var item = event.data.item;

  // Check if the item has a price of $0.00.
  if (item.price == 0) {
    // Set the maximum number of free items allowed in the order.
    var maxFreeItems = event.data.paidItems * 2;

    // Check if the number of free items in the order is greater than the maximum allowed.
    if (event.data.freeItems > maxFreeItems) {
      // Throw an error.
    //   throw new Error("The maximum number of free items has been exceeded.");
        const eventPayload = {
            message: "The maximum number of free items has been exceeded.",
        };
      
      // Trigger a custom Shopify event named "custom_error_event".
        Shopify.Events.trigger('custom_error_event', eventPayload);
        
    } else {
      // Show the user the error.
    //   alert("The maximum number of free items has been exceeded.");
        console.log("order ok",event.data);
    }
  }
}

// Do something with the shop.
console.log(shop);
