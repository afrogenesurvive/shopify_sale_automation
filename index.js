// const express = require('express');
// const ShopifyAPI = require("@shopify/shopify-api");
// console.log('hello');
// const client = new ShopifyAPI({
//   shopUrl: "https://shopthriftnature.com/",
//   accessToken: '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'
// });

// const app = express();

// async function checkFreeItems(orderId) {
//     const order = await client.getOrder(orderId);
//     const freeItems = order.lineItems.filter((lineItem) => lineItem.price === 0);
//     const maxFreeItems = freeItems.length * 2;
  
//     if (freeItems.length === maxFreeItems) {
//         client.flashError("You have reached the maximum number of free items.");
//     } else {
//       // Do nothing.
//     }
//   }
  
//   // Listen for the `order:updated` event and call `checkFreeItems()` when it is fired.
//   client.on("order:updated", checkFreeItems);
  

// const dotenv = require('dotenv');
// const express = require('express');
// const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
// const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
// const session = require('koa-session');
// const { verifyRequest } = require('@shopify/koa-shopify-auth');
// const { Context } = require('@shopify/shopify-api');

// dotenv.config();
// const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, HOST } = process.env;
// // change host to heroku url for prod

// const app = express();

// app.use(session({ secure: true, sameSite: 'none' }, app));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   createShopifyAuth({
//     apiKey: SHOPIFY_API_KEY,
//     secret: SHOPIFY_API_SECRET,
//     scopes: ['read_products', 'write_products'],
//     async afterAuth(ctx) {
//       const { shop, accessToken } = ctx.session;

//       // Register "item added to order" webhook
//       const registration = await registerWebhook({
//         address: `${HOST}/webhooks/orders/create`,
//         topic: 'ORDERS_CREATE',
//         accessToken,
//         shop,
//         apiVersion: '2021-07',
//       });

//       if (registration.success) {
//         console.log('Webhook registered successfully!');
//       } else {
//         console.log('Webhook registration failed:', registration.result);
//       }

//       ctx.redirect('/');
//     },
//   })
// );

// // Webhook route for "item added to order" event
// app.post('/webhooks/orders/create', receiveWebhook, (ctx) => {
//   const { body } = ctx.request;

//   if (body && body.line_items && body.line_items.length > 0) {
//     const newItem = body.line_items[0];

//     if (newItem.price === '0.00') {
//       const orderTotal = body.total_price;

//       const nonFreeItemsCount = body.line_items.reduce((count, item) => {
//         if (item.price !== '0.00') {
//           count += item.quantity;
//         }
//         return count;
//       }, 0);

//       const maxFreeItems = nonFreeItemsCount * 2;

//       const freeItemsCount = body.line_items.reduce((count, item) => {
//         if (item.price === '0.00') {
//           count += item.quantity;
//         }
//         return count;
//       }, 0);

//       if (freeItemsCount > maxFreeItems) {
//         // Remove the newly added item from the order
//         // ...

//         // Send an error response to the Shopify website
//         ctx.status = 400;
//         ctx.body = 'Maximum number of free items exceeded';
//         return;
//       }
//     }
//   }

//   ctx.status = 200;
// });

// app.use(verifyRequest());

// // Start the server
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

const express = require('express');
const ShopifyAPI = require('@shopify/shopify-api');

const app = express();

app.use(express.json());

app.post('/item-added', async (req, res) => {
  // Get the order from the request body.
  const order = req.body.order;

  // Check if the item costs $0.00.
  const isFreeItem = order.line_items.some(lineItem => lineItem.price === 0);

  // If the item is free, check the maximum number of free items.
  if (isFreeItem) {
    // Get the count of items in the order that cost more than $0.00 * 2.
    const maxFreeItems = order.line_items
      .filter(lineItem => lineItem.price > 0)
      .length / 2;

    // If the order's free items, including the newly added item, is greater than the max number of free items, remove the newly added item from the order and show the user an error.
    if (order.line_items.filter(lineItem => lineItem.price === 0).length > maxFreeItems) {
      order.line_items.remove(
        order.line_items.findIndex(lineItem => lineItem.id === req.body.lineItemId)
      );
      res.status(400).send('The maximum number of free items has been exceeded.');
    } else {
      res.status(200).send('The item has been added to the order.');
    }
  } else {
    res.status(200).send('The item has been added to the order.');
  }
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
