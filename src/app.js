import express from 'express'
import ProductManager from './file/productManager.js'
const path = './file/Productos.json'

const app = express()
// para poder leer los json
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// http://localhost:8080  /
app.get('/', (req, res)=>{    
    res.status(200).send('<h1>Products Manager</h1>')
})



const Products = new ProductManager(path)

const main = async () =>{
    Products
}

main()

// trae todos los productos
app.get('/products', async (req, res) => {
    let limit = req.query.limit? req.query.limit : ''
    const result = await Products.getProducts(limit)
    if(  result.status == "error" ) return res.status(404).send({status: 'error', error: result.msg })
    res.send(result)
})

// enpoint para crear un producto
app.post('/products',  async (req, res) => {
    const result = await Products.addProduct(req.body)  
    if(  result.status == "error" ) return res.status(404).send({status: 'error', error: result.msg })
    res.status(200).send({ status: 'success', payload: result })
})

// endpoint para traer un producto por id
app.get('/products/:pid', async (req, res)=>{
    const {pid} = req.params
    const result = await Products.getProductById({pid})
    if(  result.status == "error" ) return res.status(404).send({status: 'error', error: result.msg })
    res.send({status: 'success', payload: result})
    
})

// Endpoint para actualizar un producto
app.put('/products/:pid', async (req, res) => {
    const { pid } = req.params
    const userToUpdate = req.body
    const result = await Products.updateProduct({ pid }, userToUpdate)
    if(  result.status == "error" ) return res.status(404).send({status: 'error', error: result.msg })
    res.send({status: 'success', payload: result})
})

// endpoint para eliminar un producto
app.delete('/products/:pid', async (req, res) => {
    const { pid } = req.params
    const result = await Products.deleteProduct({pid})
    if(  result.status == "error" ) return res.status(404).send({status: 'error', error: result.msg })
    res.send({status: 'success', payload: result})
})



app.listen(8080, error => {
    if(error) console.log(error)
    console.log('Server escuchando en el puerto 8080')
})