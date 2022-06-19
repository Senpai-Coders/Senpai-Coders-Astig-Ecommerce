```
db.users.updateOne(
    {email_address : "louellagracechua1@gmail.com"},
    { $push : { 
            "cart.items" : {
            "product_ID":"61a89b7629aa283e194201d9",
            "qty":1,
            "variant":"Var 1",
            "variant_price":250.45,
            "rated":false
            }
        } 
    }
)
```






NOTE:
```
db.users.findOne({email_address: "louellagracechua1@gmail.com" ,  "cart.items" : {$all : [{
    "product_ID": ObjectId("61a89b8729aa283e194201db"),
    "qty":1,
    "variant":"Var 2",
    "variant_price":120.45,
    "rated":false
}]}})
```

```
db.users.findOne({email_address: "louellagracechua1@gmail.com" ,  "cart.items" : {$all : [{
    "product_ID": ObjectId("61a89b8729aa283e194201db"),
    "qty":1,
    "variant":"Var 2",
    "variant_price":120.45,
    "rated":false
}]}})
```

```
db.users.findOne({email_address: "louellagracechua1@gmail.com" ,  "cart.items" : {$all : [{
    "product_ID": ObjectId("61a89b8729aa283e194201db"),
    "qty":1,
    "variant":"Var 2",
    "variant_price":120.45,
    "rated":false
}]}})
```


```
db.users.findOne({email_address: "louellagracechua1@gmail.com" ,  "cart.items" : { $elemMatch : { product_ID : ObjectId("61a89b8729aa283e194201db") } } })

//Hinahanap nya lods kung yung specific item is nasa db
```

FIXME: Possible Flaw in my cart - Prices & Var Name should not be stored because when updated by admin 
    it will not going to update on cart

TODO: Implement checking of user cart data
NOTE: Solution when user query his/her cart, then the mycart route should query the details of multiple items
    in the cart, if the variation or the price of that product changed then update it before returning
    the letest cart data

NOTE: ISO9126 - Test (Sftwre Qlty Chrchtrstc)
NOTE: ISO25010 - (Latest)


Wag na mag traditional so wala na comparison bali test nalang ng web based ordering - Maam Em

OBJ - Maam Em
    1 - To be able to evaluate by IT professional the pruposed system
    2 - To be able to evaluate by the Loft16 Owner/Admin & Customer

SOP - Maam Em
    1 -  How does the IT expert will evaluate the pruposed system in terms of the ff : Accuracy, Efficiency, Userfriendly... etc.
    2 - How does the Owner/Admin & Customer will evaluate the proposed system in terms of : user friendliness, accuracy etc..