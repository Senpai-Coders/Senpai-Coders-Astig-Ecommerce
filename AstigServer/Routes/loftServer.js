const express = require("express");
const router = express.Router();
var XLSX = require('xlsx');

const Courier = require("../models/Courier")
const Categories = require("../models/Categories")
const Products = require("../models/Product")
const Orders = require("../models/Orders")

router.get("/profile/:imageName", (req, res) => {
    return res.download(`./static/profile/${req.params.imageName}`)
})

router.get("/userImage/:imageName", (req, res) => {
    return res.download(`./static/profile/${req.params.imageName}`)
})

router.get("/assets/:imageName", (req, res) => {
    return res.download(`./static/assets/${req.params.imageName}`)
})

router.get('/export_couriers', async (req, res) => {
    try {
        const processed = await Courier.find({ dat: null }, {
            _id: 1,
            courier_name: 1,
            courier_email: 1,
            courier_contact: 1,
            total_delivered_orders: 1,
            cat: 1,
            cby: 1
        });

        let records = []

        records = processed.map((i, idx) => {
            return {
                "COURIER ID" : i._id,
                "COURIER NAME": i.courier_name,
                "COURIER EMAIL": i.courier_email,
                "COURIER CONTACT" : i.courier_contact,
                "NO OF DELIVERED ORDERS" : i.total_delivered_orders,
                "DATE CREATED": new Date(i.cat).toLocaleDateString(),
                "CREATED BY": i.cby
            }
        })

        var wb = XLSX.utils.book_new(); //new workbook
        const sheet_name = "Couriers"

        var temp = JSON.stringify(records);
        temp = JSON.parse(temp);
        var ws = XLSX.utils.json_to_sheet(temp);

        var down = `./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, down);
        res.download(`./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`);
    } catch (e) { console.log(e) }
});

router.get('/export_categories', async (req, res) => {
    try {
        const processed = await Categories.find({ dat: null }, {
            category_name: 1,
            associated_products: 1,
            cat: 1,
            cby: 1,
            uat: 1,
            uby: 1
        });

        let records = []

        records = processed.map((i, idx) => {
            return {
                "CATEGORY ID": i._id,
                "CATEGORY NAME": i.category_name,
                "TOTAL ASSOCIATED PRODUCTS": i.associated_products.length,
                "DATE CREATED": new Date(i.cat).toLocaleDateString(),
                "CREATED BY": i.cby,
                "DATE UPDATED": new Date(i.cat).toLocaleDateString(),
                "UPDATED BY": i.uby
            }
        })

        var wb = XLSX.utils.book_new(); //new workbook
        const sheet_name = "Categories"

        var temp = JSON.stringify(records);
        temp = JSON.parse(temp);
        var ws = XLSX.utils.json_to_sheet(temp);

        var down = `./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, down);
        res.download(`./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`);
    } catch (e) { console.log(e) }
});

router.get('/export_products', async (req, res) => {
    try {
        const processed = await Products.find({ dat: null }, {
            name: 1,
            categories: 1,
            likes: 1,
            total_stock: 1,
            is_hot: 1,
            replacement_day: 1,
            Images: 1,
            description: 1,
            variants: 1,
            n_ratings: 1,
            n_no_ratings: 1,
            total_item_sold: 1,
            generated_sale: 1,
            cat: 1,
            cby: 1,
            uat: 1,
            uby: 1,
            dat: 1
        });

        let records = []

        records = processed.map((i, idx) => {
            let COPY = {
                "PRODUCT ID": i._id,
                NAME: i.name,
                "TOTAL STOCK": i.total_stock,
                "REPLACEMENT DAY": i.replacement_day,
                "TOTAL RATINGS": i.n_ratings,
                SOLD: i.total_item_sold,
                "GENERATED SALE": i.generated_sale,
                "NUMBER OF RATINGS": i.n_no_ratings,
                "COMPUTED RATINGS": (Number.parseInt(i.n_ratings) / Number.parseInt(i.n_no_ratings)),
                LIKES: i.likes,
                FEATURED: i.is_hot ? "Yes" : "No",
                "TOTAL NUMBER OF VARIETY": i.variants.length,
                "NUMBER OF IMAGES": i.Images.length,
                "PRODUCT DESCRIPTION": i.description,
                "DATE CREATED": new Date(i.cat).toLocaleDateString(),
                "CREATED BY": !i.cby ? "System" : i.cby,
                "DATE UPDATED": new Date(i.uat).toLocaleDateString(),
                "UPDATED BY": i.uby
            }

            return COPY
        })
        var wb = XLSX.utils.book_new(); //new workbook
        const sheet_name = "Products"

        var temp = JSON.stringify(records);
        temp = JSON.parse(temp);
        var ws = XLSX.utils.json_to_sheet(temp);

        var down = `./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, down);
        res.download(`./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`);
    } catch (e) { console.log(e) }
});

router.get('/export_cancelled_orders', async (req, res) => {
    try {
        const sheet_name = "Cancelled Orders"

        const processed = await Orders.find({ dat: null, order_status: -1 }, {
            user_ID: 1,
            user_mobile: 1,
            n_items: 1,
            total_cost: 1,
            payment_mode: 1,
            reason : 1,
            order_status:1, // 0 pending, 1 processing, 2 shipped, 3 delivered, -1 cancelled
            courier: 1,
            items: 1,
            address: 1,
            cat: 1,
            uat: 1
        });

        let records = []

        const orderToString = (orders) => {
            let items = ""
            orders.forEach((it, idx)=> items += it.product_name + ', ' )
            return items
        }

        const mobileToString = (mobiles) => {
            let mobile = ""
            mobiles.forEach((it, idx)=> mobile += it+ ', ' )
            return mobile
        }

        records = processed.map((i, idx) => {
            return {
                "ORDER ID" : i._id,
                "USER ID" : i.user_ID,
                "USER CONTACT" : mobileToString(i.user_mobile),
                "TOTAL ITEMS" : i.n_items,
                "TOTAL COST" : i.total_cost,
                "MODE OF PAYMENT" : i.payment_mode,
                "STATUS" : "Cancelled",
                "REASON FOR CANCELLATION" : i.reason ,
                "COURIER" : i.courier.courier_name,
                "COURIER CONTACT" : i.courier.courier_contact,
                "ITEMS" : orderToString(i.items),
                "DELIVERY ADDRESS" : i.address.address,
                "DATE PLACED" : new Date(i.cat).toLocaleDateString()
            }
        })

        var wb = XLSX.utils.book_new(); //new workbook

        var temp = JSON.stringify(records);
        temp = JSON.parse(temp);
        var ws = XLSX.utils.json_to_sheet(temp);

        var down = `./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, down);
        res.download(`./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`);
    } catch (e) { console.log(e) }
});

router.get('/export_pending_orders', async (req, res) => {
    try {
        const sheet_name = "Pending Orders"

        const processed = await Orders.find({ dat: null, order_status: 0 }, {
            user_ID: 1,
            user_mobile: 1,
            n_items: 1,
            total_cost: 1,
            payment_mode: 1,
            order_status:1, // 0 pending, 1 processing, 2 shipped, 3 delivered, -1 cancelled
            courier: 1,
            items: 1,
            address: 1,
            cat: 1,
            uat: 1
        });

        let records = []

        const orderToString = (orders) => {
            let items = ""
            orders.forEach((it, idx)=> items += it.product_name + ', ' )
            return items
        }

        const mobileToString = (mobiles) => {
            let mobile = ""
            mobiles.forEach((it, idx)=> mobile += it+ ', ' )
            return mobile
        }

        records = processed.map((i, idx) => {
            return {
                "ORDER ID" : i._id,
                "USER ID" : i.user_ID,
                "USER CONTACT" : mobileToString(i.user_mobile),
                "TOTAL ITEMS" : i.n_items,
                "TOTAL COST" : i.total_cost,
                "MODE OF PAYMENT" : i.payment_mode,
                "STATUS" : "Pending",
                "COURIER" : i.courier.courier_name,
                "COURIER CONTACT" : i.courier.courier_contact,
                "ITEMS" : orderToString(i.items),
                "DELIVERY ADDRESS" : i.address.address,
                "DATE PLACED" : new Date(i.cat).toLocaleDateString()
            }
        })

        console.log(records)

        var wb = XLSX.utils.book_new(); //new workbook

        var temp = JSON.stringify(records);
        temp = JSON.parse(temp);
        var ws = XLSX.utils.json_to_sheet(temp);

        var down = `./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, down);
        res.download(`./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`);
    } catch (e) { console.log(e) }
});

router.get('/export_orders_in_progress', async (req, res) => {
    try {
        const sheet_name = "Orders In Progress"

        const processed = await Orders.find({ dat: null, order_status: { $in: [1, 2] } }, {
            user_ID: 1,
            user_mobile: 1,
            n_items: 1,
            total_cost: 1,
            payment_mode: 1,

            order_status:1, // 0 pending, 1 processing, 2 shipped, 3 delivered, -1 cancelled
            courier: 1,
            items: 1,
            address: 1,
            cat: 1,
            uat: 1
        });

        let records = []

        const orderToString = (orders) => {
            let items = ""
            orders.forEach((it, idx)=> items += it.product_name + ', ' )
            return items
        }

        const mobileToString = (mobiles) => {
            let mobile = ""
            mobiles.forEach((it, idx)=> mobile += it+ ', ' )
            return mobile
        }

        records = processed.map((i, idx) => {
            return {
                "ORDER ID" : i._id,
                "USER ID" : i.user_ID,
                "USER CONTACT" : mobileToString(i.user_mobile),
                "TOTAL ITEMS" : i.n_items,
                "TOTAL COST" : i.total_cost,
                "MODE OF PAYMENT" : i.payment_mode,
                "STATUS" : i.order_status === 1 ? "Processing" : "Shipped",
                "COURIER" : i.courier.courier_name,
                "COURIER CONTACT" : i.courier.courier_contact,
                "ITEMS" : orderToString(i.items),
                "DELIVERY ADDRESS" : i.address.address,
                "DATE PLACED" : new Date(i.cat).toLocaleDateString()
            }
        })

        var wb = XLSX.utils.book_new(); //new workbook

        var temp = JSON.stringify(records);
        temp = JSON.parse(temp);
        var ws = XLSX.utils.json_to_sheet(temp);

        var down = `./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, down);
        res.download(`./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`);
    } catch (e) { console.log(e) }
});

router.get('/export_completed_orders', async (req, res) => {
    try {
        const sheet_name = "Completed Orders"

        const processed = await Orders.find({ dat: null, order_status : 3 }, {
            user_ID: 1,
            user_mobile: 1,
            n_items: 1,
            total_cost: 1,
            payment_mode: 1,

            order_status:1, // 0 pending, 1 processing, 2 shipped, 3 delivered, -1 cancelled
            courier: 1,
            items: 1,
            address: 1,
            cat: 1,
            uat: 1
        });

        let records = []


        const orderToString = (orders) => {
            let items = ""
            orders.forEach((it, idx)=> items += it.product_name + ', ' )
            return items
        }

        const mobileToString = (mobiles) => {
            let mobile = ""
            mobiles.forEach((it, idx)=> mobile += it+ ', ' )
            return mobile
        }

        records = processed.map((i, idx) => {
            return {
                "ORDER ID" : i._id,
                "USER ID" : i.user_ID,
                "USER CONTACT" : mobileToString(i.user_mobile),
                "TOTAL ITEMS" : i.n_items,
                "TOTAL COST" : i.total_cost,
                "MODE OF PAYMENT" : i.payment_mode,
                "STATUS" : "COMPLETED",
                "COURIER" : i.courier.courier_name,
                "COURIER CONTACT" : i.courier.courier_contact,
                "ITEMS" : orderToString(i.items),
                "DELIVERY ADDRESS" : i.address.address,
                "DATE PLACED" : new Date(i.cat).toLocaleDateString()
            }
        })

        console.log(records)

        var wb = XLSX.utils.book_new(); //new workbook

        var temp = JSON.stringify(records);
        temp = JSON.parse(temp);
        var ws = XLSX.utils.json_to_sheet(temp);

        var down = `./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, down);
        res.download(`./static/exports/${sheet_name} - ${new Date().toLocaleDateString().replaceAll('/', '-')}.xlsx`);
    } catch (e) { console.log(e) }
});

module.exports = router;