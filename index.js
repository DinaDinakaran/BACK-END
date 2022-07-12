require('dotenv').config();
const port = process.env.PORT || 5000;
const mongooes = require("mongoose")
const express= require("express")
const request = require("request")
const cheerio = require("cheerio");
const cors = require("cors")
// const validationschema = require("./schema/datavalidschama") 


const url1 = "https://www.flipkart.com/search?q=iphone&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&as-pos=1&as-type=HISTORY"
const url2= "https://www.snapdeal.com/products/electronics-headphones?sort=plrty";
const url3 ="https://www.amazon.in/s?i=electronics&bbn=1388921031&rh=n%3A976419031%2Cn%3A976420031%2Cn%3A1388921031%2Cp_36%3A100000-200000%2Cp_85%3A10440599031%2Cp_72%3A1318477031&pf_rd_i=1388921031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=d7371736-a4be-4d3b-9605-2c0bfe1e66c5&pf_rd_r=XNX2C1WT4FRSWS4A8NZ4&pf_rd_s=merchandised-search-8&pf_rd_t=30901&ref=hpbudget1_3"

const app = express()
app.use(express.json());
app.use(cors({
    origin : "*"
}))

app.listen(port,()=> console.log(`this server runs at ${port}`))
mongooes.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@machiii.ks4yx.mongodb.net/?retryWrites=true&w=majority`
,{
    useNewUrlParser :true,
    useUnifiedTopology:true
},(err)=>{
    if(!err){
        console.log("connection is estabileshed")
    }else{
        console.log(err)
    }
})



const validationFlipkart = mongooes.Schema( {
    title:String,
    image:String,
    rating:String,
    price:String
})
const mongomodelflipkart = mongooes.model("flipkart",validationFlipkart)


    request(url1,(err,res,html)=>{
        if(!err&& res.statusCode==200){
            const $ = cheerio.load(html);
            const value =[]
            $("._1fQZEK").each((i,ele)=>{
                const image = $(ele)
                .find("._396cs4._3exPp9")
                .attr("src")
                const title = $(ele)
                .find("._4rR01T")
                .text();
                const rating = $(ele)
                .find("._3LWZlK")
                .text();
                const price = $(ele)
                .find("._30jeq3._1_WHN1")
                .text();
                value.push({
                    title,
                    image,
                    rating,
                    price
                    })
                
            })
           const  flipkart = value.slice(0,11)
        //    console.log(flipkart)
          
           app.post("/",async (req,res)=>{
           
            mongomodelflipkart.insertMany(flipkart).then((data)=>{
                res.status(201).send(data);
            }).catch((error)=>{
                res.status(400).send(error);
            })  
        })

 
        app.get("/flipkart",(req,res)=>{
            res.status(200).send(flipkart)
        })


        }else((err)=>{
            console.log(err)
        })
        })
        // snapdeal
        const validationSnapdeal = mongooes.Schema( {
            title:String,
            image:String,
            rating:String,
            price:String
        })
        const mongomodelsnapdeal = mongooes.model("Snapdeal",validationSnapdeal)
        request(url2,(err,res,html)=>{
        if(!err&& res.statusCode==200){
            const $ = cheerio.load(html);
            const value =[]
            $(".col-xs-6.favDp.product-tuple-listing.js-tuple ").each((i,ele)=>{
                const image = $(ele)
                .find("img")
                .attr("src")
                const title = $(ele)
                .find(".product-title")
                .text();
                const rating = $(ele)
                .find(".grey-stars")
                .text();
                const price = $(ele)
                .find(".lfloat.product-price")
                .text();
                value.push({
                    title,
                    image,
                    rating,
                    price
                    })
                
            })
           const  snapdeal = value.slice(0,11)
        //    console.log(snapdeal)
          
           app.post("/",async (req,res)=>{
           
            mongomodelsnapdeal.insertMany(snapdeal).then((data)=>{
                res.status(201).send(data);
            }).catch((error)=>{
                res.status(400).send(error);
            })
        
    
                
           
        })

        app.get("/snapdeal",(req,res)=>{
            res.status(200).send(snapdeal)
        })


        }else((err)=>{
            console.log(err)
        })
        })





        //amazon
        const validationAmazon = mongooes.Schema( {
            title:String,
            image:String,
            rating:String,
            price:String
        })
        const mongomodelamazon = mongooes.model("amazon",validationAmazon)
        request(url3,(err,res,html)=>{
        if(!err&& res.statusCode==200){
            const $ = cheerio.load(html);
            const value =[]
            $(".sg-col-inner").each((i,ele)=>{
                const image = $(ele)
                .find("img")
                .attr("src");
                const title = $(ele)
                .find("h2")
                .text();
                const rating = $(ele)
                .find(".a-icon-alt")
                .text();
                const price = $(ele)
                .find(".a-price-whole")
                .text();
                value.push({
                    title,
                    image,
                    rating,
                    price
                    })
                
            })
           const  amazon = value.slice(4,15)
        //    console.log(amazon)
          
           app.post("/",async (req,res)=>{
           
            mongomodelamazon.insertMany(amazon).then((data)=>{
                res.status(201).send(data);
            }).catch((error)=>{
                res.status(400).send(error);
            }) 
        })



        app.get("/amazon",(req,res)=>{
            res.status(200).send(amazon)
        })

        }else((err)=>{
            console.log(err)
        })
        })
     
