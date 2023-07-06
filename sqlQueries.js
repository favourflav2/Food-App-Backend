

export async function popularQuery(){
    //Neapolitan Pizza & Greek Pizza
    const pizza1 = 'SELECT * FROM pizza WHERE type = $1 OR type = $2 '
    const pizzaValue = ['Neapolitan Pizza','Greek Pizza']
    const pizzaData = await client.query(pizza1,pizzaValue)

    //Greek Pizza
    // const pizza2 = 'SELECT * FROM pizza WHERE type = $1 '
    // const pizzaValue2 = ['Greek Pizza']
    // const pizzaData2 = await client.query(pizza1,pizzaValue)

    //Pesto Penne Pasta
    const pasta1 = 'SELECT * FROM pasta WHERE type = $1 '
    const pastaValue = ['Pesto Penne Pasta']
    const pastaData = await client.query(pasta1,pastaValue)

    // Mediterranean Orzo Pasta Salad
    const salad1 = 'SELECT * FROM salad WHERE type = $1 '
    const saladValue = ['Mediterranean Orzo Pasta Salad']
    const saladData = await client.query(salad1,saladValue)

     return {
         pizzaData,
         pastaData,
         saladData
     }
}

export async function pizzaQuery(client){
    const text = 'SELECT * FROM pizza'
    return client.query(text)
}

export async function pastaQuery(client){
    const text = 'SELECT * FROM pasta'
    return client.query(text)
}

export async function saladQuery(client){
    const text = 'SELECT * FROM salad'
    return client.query(text)
}

export async function desertQuery(client){
    const text = 'SELECT * FROM desert'
    return client.query(text)
}