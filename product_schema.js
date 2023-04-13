const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
    "pname": {
        required: true,
        type: String,
    },
    "pprice": {
        required: true,
        type: String,
    },
    "pdesc": {
        required: true,
        type: String,
    }
});

module.exports = mongoose.model("products", productSchema);