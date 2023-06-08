import express from 'express';
import ShopifyAPI from"@shopify/shopify-api";

const client = new ShopifyAPI({
  shopUrl: "https://shopthriftnature.com/",
  accessToken: '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'
});

const app = express();

async function checkFreeItems(orderId) {
    const order = await client.getOrder(orderId);
    const freeItems = order.lineItems.filter((lineItem) => lineItem.price === 0);
    const maxFreeItems = freeItems.length * 2;
  
    if (freeItems.length === maxFreeItems) {
        client.flashError("You have reached the maximum number of free items.");
    } else {
      // Do nothing.
    }
  }
  
  // Listen for the `order:updated` event and call `checkFreeItems()` when it is fired.
  client.on("order:updated", checkFreeItems);
  
