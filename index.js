const PORT = 8080
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')


const app = express()
const articles = []

const newspapers=[
    {
        name :"thetimes",
        address:'https://www.thetimes.co.uk/environment/climate-change',
        base: '',
    },
    {
        name:"guardian",
        address:'https://www.theguardian.com/environment/climate-crisis',
        base:'',
    },
    {
        name:"telegraph",
        address:'https://www.telegraph.co.uk/climate-change',
        base:'https://www.telegraph.co.uk',
    },
    {
        name:"bbc",
        address:'https://www.bbc.co.uk/news/science_and_environment',
        base:'https://www.bbc.co.uk',
    },
    {
        name:"es",
        address:'https://www.standard.co.uk/topic/climate-change',
        base:'https://www.standard.co.uk',
    },
    {
        name:"sun",
        address:'https://www.standard.co.uk/topic/climate-change',
        base:'https://www.standard.co.uk',
    },
    {
        name:"nyp",
        address:'https://www.nypost.com/tag/climate-change/',
        base:'',
    },{
        name:"nyt",
        address:'https://www.nytimes.com/international/section/climate',
        base:'https://www.nytimes.com/',
    }

]
app.get('/',(req,res)=>{
    res.send("howdy!");

})


newspapers.forEach(newspaper=>{
    axios.get(newspaper.address).then((response)=>{
        const html = response.data
        const $ = cheerio.load(html)
       
        
        $('a:contains("climate")',html).each(function(){
            const title = $(this).text()    
            const url = $(this).attr('href')
            const newspaperbase = newspaper.base+url
            articles.push({
                title,
                newspaperbase,
                source:newspaper.name
            })
        })
    }).catch((err)=>{console.log(err);})
})

app.get('/news',(req,res)=>{

    // axios.get('https://www.theguardian.com/environment/climate-crisis').then((response)=>{
    //     const html = response.data
    //     const $ = cheerio.load(html)

    //     $('a:contains("climate")',html).each(function(){
    //         const title = $(this).text()    
    //         const url = $(this).attr('href')
    //        // const published =$(this).attr('*[@id="article"]/div/div/div[1]/div/div[2]/div[2]/div[1]/p[2]/time[1]/text()')

    //         articles.push({
    //             title,
    //             url,
    //            // published
    //         })
            
    //     })
        res.send(articles)
     })
app.get('/news/:newspaperId',async(req,res)=>{
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name== newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name== newspaperId)[0].base
    
    axios.get(newspaperAddress).then((response)=>{
        const html = response.data
        const $ = cheerio.load(html)
       
        const specifiesArticles=[]

        $('a:contains("climate")',html).each(function(){
            const title = $(this).text()    
            const url = $(this).attr('href')
            specifiesArticles.push({
                title,
                url:newspaperBase+url,
                source:newspaperId
            })
        })
        res.send(specifiesArticles)
    }).catch((err)=>console.log(err))
})

app.listen(PORT,()=> console.log(`app listening at port ${PORT}`))