const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

const http = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))
app.engine('html', require('ejs').renderFile); 




app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/index.html")
});

app.post("/", (req, res) => {
    console.log(req.body.search)
    var search = toUrl(req.body.search)
    console.log(search);
    
    const options = {
        "method": "GET",
        "hostname": "genius-song-lyrics1.p.rapidapi.com",
        "port": null,
        "path": "/search/?q=" + search + "&per_page=10&page=1",
        "headers": {
            "X-RapidAPI-Key": "db9607d3c8msh491caaf8e7a77b3p1715f7jsnd823e9611a94",
            "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
            "useQueryString": true
        }
    };

    const request = http.request(options, function (response) {
        // if(!response)res.render("no data found")
        // console.log(response)
        const chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            const body = Buffer.concat(chunks);
            var json = JSON.parse(body.toString());
            var images = [];
            var titles = [];
            var artistName = [];
            var url = [];
            for (let i = 0; i < 8 && i < json.hits.length-1; i++) {
                // if (json.hits[i].result){
                    images.push(json.hits[i].result.header_image_thumbnail_url)
                    titles.push(json.hits[i].result.title)
                    artistName.push(json.hits[i].result.artist_names)
                    url.push(json.hits[i].result.relationships_index_url)
                // } else {
                    // res.write("no further results")
                // }

            }
            console.log(url[0])
            res.render('cardPage', {
                titles: titles,
                images: images,
                artistName: artistName,
                url: url
            });
        });
    });
request.end();
});

app.listen(300, () => {
    console.log('hello world');
});

function toUrl(search)
{
    var str="";
    for(var i = 0; i<search.length; i++)
    {
        if(search.charAt(i)==" ")
            str+="%20";
        else 
            str+=search.charAt(i);
    }
    return str;
}