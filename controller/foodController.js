import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
//import Stripe from "stripe";
const { Client } = pg;
//const stripe = new Stripe(process.env.STRIPE_KEY);
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_KEY);

import {
  desertQuery,
  pastaQuery,
  pizzaQuery,
  popularQuery,
  saladQuery,
} from "../sqlQueries.js";

const environment = process.env.NODE_ENV || 'development';

export async function get_Popular(req, res) {
  const client = new Client(process.env.DB_PASSWORD);
  await client.connect();

  try {
    // Pizza
    const pizza1 = "SELECT * FROM pizza WHERE type = $1 OR type = $2 ";
    const pizzaValue = ["Neapolitan Pizza", "Greek Pizza"];
    const pizzaData = await client.query(pizza1, pizzaValue);

    // Mediterranean Orzo Pasta Salad
    const salad1 = "SELECT * FROM salad WHERE type = $1 ";
    const saladValue = ["Mediterranean Orzo Pasta Salad"];
    const saladData = await client.query(salad1, saladValue);

    // Pasta
    const pasta1 = "SELECT * FROM pasta WHERE type = $1 ";
    const pastaValue = ["Pesto Penne Pasta"];
    const pastaData = await client.query(pasta1, pastaValue);

    const concatArray = pizzaData.rows.concat(saladData.rows, pastaData.rows);
    res.send(concatArray);
    client.end();
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export async function get_Pizza(req, res) {
  const client = new Client(process.env.DB_PASSWORD);
  await client.connect();

  try {
    const data = await pizzaQuery(client);
    const changeToNum = data.rows.map((item, index) => {
      return {
        id: item.id,
        type: item.type,
        desc: item.desc,
        price: Number(item.price),
        foodtype: item.foodtype,
      };
    });
    //console.log(changeToNum)
    res.status(200).json(changeToNum);
    client.end();
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export async function get_Pasta(req, res) {
  const client = new Client(process.env.DB_PASSWORD);
  await client.connect();

  try {
    const data = await pastaQuery(client);
    res.status(200).json(data.rows);
    //console.log(data.rows);
    client.end();
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export async function get_Salad(req, res) {
  const client = new Client(process.env.DB_PASSWORD);
  await client.connect();

  try {
    const data = await saladQuery(client);
    res.status(200).json(data.rows);
    //console.log(data.rows);
    client.end();
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export async function get_Desert(req, res) {
  const client = new Client(process.env.DB_PASSWORD);
  await client.connect();

  try {
    const data = await desertQuery(client);
    res.status(200).json(data.rows);
    //console.log(data.rows);
    client.end();
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
}

export function getOrderDate(req,res){
  try{
    const {date} = req.body
    res.send("sent Date")
    return date
    

  }catch(e){
    console.log(e)
    res.status(400).json({ msg: e.message });
  }
}

export async function stripe_Payment(req, res) {
  // Connection to backend to get the price of item
  //* Not supposed to take price from frontend

  try {

    const {date} = req.body
    const cart = req.body.cart;
    
    
    const backendPrice = cart.map((item) => {
      if (item.typeOfModal === "pizzaCart") {
        let price = 10.99;
        for (const [key, value] of Object.entries(item.state)) {
          if (value === true) {
            price += 1.5;
          }
        }
        const otherState = item.state
        return {
          id: item.id,
          type: item.type,
          desc: item.desc,
          price: Number(price.toFixed(2)),
          count: item.count,
          state: JSON.stringify(otherState),
          cart: item.cart,
          textAera: item.textAera,
          typeOfModal: item.typeOfModal,
        };
      } else if (item.typeOfModal === "saladCart") {
        return {
          id: item.id,
          type: item.type,
          desc: item.desc,
          price: item.state === "Full" ? 12.99 : 7.99,
          count: item.count,
          state: item.state,
          cart: item.cart,
          textAera: item.textAera,
          typeOfModal: item.typeOfModal,
        };
      } else if (item.typeOfModal === "desertCart") {
        const price =
          item.type === "Triple-Chocolate Buttermilk Pound Cake"
            ? Number((9.99).toFixed(2))
            : item.type === "Strawberry Shortcake Pizookie"
            ? Number((8.59).toFixed(2))
            : item.type === "Monkey Bread Pizookie"
            ? Number((7.99).toFixed(2))
            : Number((6.99).toFixed(2));

        return {
          id: item.id,
          type: item.type,
          desc: item.desc,
          price: price,
          count: item.count,
          //state: item.state,
          cart: item.cart,
          textAera: item.textAera,
          typeOfModal: item.typeOfModal,
        };
      } else {
        return {
          id: item.id,
          type: item.type,
          desc: item.desc,
          price: 14.99,
          count: item.count,
          state: item.state,
          cart: item.cart,
          textAera: item.textAera,
          typeOfModal: item.typeOfModal,
        };
      }
    });

   

    const line_items = backendPrice.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data:{
            name:item.type,
            description: item.desc,
            metadata:{
              id:24,
              state:item.state,
              textAera: item.textAera,
              orderDate:date
            }
            
          },
          unit_amount: item.price * 100
        },
        quantity: item.count
      }
    })


     const session = await stripe.checkout.sessions.create({
       payment_method_types: ["card"],
       shipping_address_collection: { allowed_countries: ["US", "CA"] },
       line_items,
       payment_intent_data:{
        metadata:{
          //data: JSON.stringify(small),
          orderDate: date
        }
       },
       metadata:{
        //data: JSON.stringify(backendPrice),
        // small: JSON.stringify(backendPrice.map(item =>{
        //   return {
        //     type:item.type,
        //     state:item.state
        //   }
        // })),
        orderDate: date
       },
       mode: "payment",
       success_url: environment === "development" ? "http://localhost:3000/success" : "frontendpage",
       cancel_url: environment === "development" ? "http://localhost:3000/error" : "frontendpage",
     });
     res.json({ url: session.url });
     //res.send("hello")
  } catch (e) {
    console.log(e);
    console.log({ msg: e.message });
  }
}



