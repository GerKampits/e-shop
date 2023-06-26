const User = require('../models/user.model');

exports.findOne = function (req, res) {
   // Διαβάζει απο το path parameter το username που είναι πάνω στην κλήση "router.get('/findone/:username', userProductController.findOne);"
    const username = req.params.username;

    // χρησιμοποιείται το μοντέλο user που υπάρχει στο mongoose
    // επιστρέφει ένα document, με το χρήστη που έχει περαστεί ως παράμετρος και βγαζει όλα τα πεδία, 
    //εκτός από το username και το product
    User.findOne({username:username}, {_id:0, username:1, products:1}, (err, result)=> {
        if (err) {
            res.json({ status: false, data: err })
        } else {
            res.json ({ status:true, data: result })
        }
    });
}

exports.create = function (req, res) {

    //στέλνει στο body του request το username
    const username = req.body.username;
    const products = req.body.products

    User.updateOne(
        { username: username },
        {
            $push: {
                products: products // document μέσα σε ένα array
            }
        },
        (err, result) => {
            if (err) {
                res.json({ status: false, data: err});
            } else {
                res.json({status: true, data: result });
            }
              
        }
         
    )
}

exports.update = function (req, res) {

    const username = req.body.username;     // handling a user request to purchase a product, with the user's name, 
    const product = req.body.products.product; // the product name, and the quantity of the product being extracted 
    const quantity = req.body.products.quantity; // from the request body and stored in variables for further processing.

    User.updateOne(
        {
            username: username,
            'products.product' : product
        },
        {
            $set: {
                "products.$.quantity" : quantity
            }
        },
        (err, result) => {
            if (err) {
                res.json({ status: false, data: err});
            } else {
                res.json({status: true, data: result });
            }
              
        }
    )
}


exports.delete = function (req, res) {   // διαδικασία τύπου delete

    const username = req.params.username;  
    const product = req.params.product;

    // Ωστόσο δεν διαγράφουμε το document
    User.updateOne(             // Ψάχνει το document που έχει username το username που έχει σταλεί στο path param
        { username: username },
        { 
            $pull: {        // αφαιρεί από ένα array
                products: { product: product } // που υπαρχει στη μεταβλητή prodcucts
            }              //key      value: η μεταβλητη poduct
        },
        (err, result) => {
            if (err) {
                res.json({ status: false, data: err});
            } else {
                res.json({status: true, data: result });
            }
              
        }
    )
}

exports.stats1 = function (req, res) {
    const username= req.params.username

    User.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $unwind: "$products"
        },
        {
            $project: {
                _id: 1,
                username: 1,
                products: 1
            }
        },
        {
            $group: {
                _id: {
                    username: "$username",
                    product: "$products.product"
                },
                totalAmount: {
                    $sum: {
                        $multiply: [ "$products.cost", "$products.quantity"]
                    }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {"_id.product": 1 }
        }
    ],
    (err, result) => {
        if (err) {
            res.json({ status: false, data: err});
        } else {
            res.json({status: true, data: result });
        }   
    }
    )
}