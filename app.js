import '@shopify/shopify-api/adapters/node';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import express from 'express';

const shopify = shopifyApi({
  // The next 4 values are typically read from environment variables for added security
//   apiKey: 'APIKeyFromPartnersDashboard',
//   apiSecretKey: 'APISecretFromPartnersDashboard',
//   scopes: ['read_products', 'write_orders'],
//   hostName: 'ngrok-tunnel-address',
//   ...
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
});

const app = express();

async function getProducts() {
    const products = await shopify.getProducts();
    return products;
  }
  
  app.get('/', async (req, res) => {
    const products = await getProducts();
    console.log('products',products);
    // Render the products to the browser
    res.render('index', { products });
  });
  
  // Listen for an item add to order event
  shopify.on('itemAddedToOrder', async (event) => {
    // Check if the item is free
    if (event.product.price === 0) {
      // Check if the max free item amount has been reached
      const maxFreeItemCount = event.order.items.filter(item => item.price > 0).length * 2;
      if (event.order.freeItems.length >= maxFreeItemCount) {
        // Show the customer an error
        console.log('error',event);
        res.render('error', { message: 'The maximum number of free items has been reached.' });
      } else {
        // Do nothing
        console.log('order',event);
      }
    } else {
      // Do nothing
    }
  });
  

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
