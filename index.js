const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const Product = require('./product_schema');

const app = express();

app.use(express.json());
app.use(cors());

var url = process.env.MongoURL;

// db

const productData = [];

app.use(express.urlencoded({
    extended: true
}));


// Connect to the database using promises
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {

        console.log('Connected to MongoDB');

        // post api
        app.post("/api/add_product", async (req, res) => {

            console.log("Result: ", req.body);

            let data = Product(req.body);

            try {
                let dataToStore = await data.save();
                res.status(200).json(dataToStore);
            } catch (error) {
                res.status(400).json({
                    "status": error.message
                })
            }

            // const pData = {
            //     "id": productData.length + 1,
            //     "pname": req.body.pname,
            //     "pprice": req.body.pprice,
            //     "pdesc": req.body.pdesc,
            // };

            // productData.push(pData);

            // console.log("Final", pData);

            // res.status(200).send({
            //     "status_code": 200,
            //     "message": "Product added successfully",
            //     "product": pData,
            // })

        })

        // get api
        app.get("/api/get_product/", async (req, res) => {
            try {
                let data = await Product.find();

                res.status(200).json(data);
            } catch (error) {
                res.status(500).json({
                    "status": error.message
                })
            }
            // if (productData.length > 0) {
            //     res.status(200).send({
            //         "status_code": 200,
            //         "products": productData
            //     });
            // } else {
            //     res.status(200).send({
            //         "status_code": 200,
            //         "products": []
            //     });
            // }
        })

        // update api using patch
        app.patch("/api/update/:id", async (req, res) => {

            let id = req.params.id;
            let updatedData = req.body;

            let options = { new: true };

            try {
                const data = await Product.findByIdAndUpdate(id, updatedData, options);

                res.send(data);
            } catch (error) {
                res.send(error.message);
            }
            // let id = req.params.id * 1;
            // let productToUpdate = productData.find(prod => prod.id === id);
            // let idx = productData.indexOf(productToUpdate);

            // productData[idx] = req.body;

            // res.status(200).send({ "status": "success", "message": "Product updated" })
        })

        // delete api
        app.delete("/api/delete/:id", async (req, res) => {
            let id = req.params.id;

            try {
                const data = await Product.findByIdAndDelete(id);
                  res.json({
                    "status_code": 204,
                    "status": `Deleted the product ${data.pname} with id ${data.id} from db`,
                });
            } catch (error) {
                res.json(error.message);
            }
            // let id = req.params.id * 1;
            // let productToDelete = productData.find(prod => prod.id === id);
            // let idx = productData.indexOf(productToDelete);

            // productData.splice(idx, 1);

            // res.status(204).send({ "status": "success", "message": "Product Deleted" })
        })
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });


app.listen(3000, () => {
    console.log("Connected to server at 3000 or hosted on reder");
})
