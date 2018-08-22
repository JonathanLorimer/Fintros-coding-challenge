const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request');
const requestPromise = require('request-promise-native')


// app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function(req, res){
    res.sendfile('index.html', { root: "./public/index.html" } );
});
app.post('/scrape', function(req, res){
	console.log(req.body)
    Promise.all(
        req.body.map(story => {
            if (story.url){
				console.log(story.url)
           		return requestPromise.get(story.url)
                    .then(e => {
						let imageURL = e.match(/<meta property="og:image"\scontent="(\S+)"/g)
						if (imageURL) story.image = imageURL[0].slice(35, imageURL[0].length - 1)
						else story.image = null
						return story
					})
                    .catch(err => console.log(err))
            } else {
                story.image = null
				return story
			}
        })
    )
    .then(x => {
        res.send(x)
    })
    .catch(err => console.log(err))
});



app.listen(3000, () => console.log('Example app listening on port 3000!'))