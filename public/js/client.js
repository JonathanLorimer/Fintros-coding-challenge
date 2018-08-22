
const randomImg = 'https://picsum.photos/200/300/?random'
const baseURL = 'https://hacker-news.firebaseio.com/v0/'

const getResources = async () => {
	const newStories = await fetch(`${baseURL}newstories.json`)
	const readable = await newStories.json()
	const top30 = readable.slice(0, 30)
	
	const top30data = await Promise.all( top30.map(x => fetch(`${baseURL}item/${x}.json`).then(y => y.json())) )
	console.log(top30data)
	const fetchData = JSON.stringify(top30data)
	const getPictures = await fetch('/scrape', {
		method: 'POST', 
		body: fetchData,
		headers: {
        	'Accept': 'application/json',
      		'Content-Type': 'application/json'
        },
	})
	const top30finalized = await getPictures.json()
	console.log(top30finalized)
	const top30even = top30finalized.filter((e, i) => (i + 2 % 2 !== 0) && e )
	const top30odd = top30finalized.filter((e, i) => (i + 2 % 2 === 0) && e)
	if(document.getElementById('filter-even').checked){
		heroStory(top30even[6])
	} else {
		heroStory(top30odd[0])
	}

}

const string = "<meta property='og:image' content='"
console.log(string.length)

const heroStory = (item) => {
	let link = document.getElementsByClassName("hacker-news__hero-story--link")[0]
	let image = document.getElementsByClassName("hacker-news__hero-story--image")[0]
	let title = document.getElementsByClassName("hacker-news__hero-story--title")[0]
	let text = document.getElementsByClassName("hacker-news__hero-story--text")[0]
	console.log(link)
	console.log(image)
	console.log(title)
	console.log(text)
	console.log(item)
	link.setAttribute('href', item.url);
	if(item.image) {
		image.setAttribute('src', item.image)
	}
	else image.setAttribute('src', 'https://picsum.photos/1260/710/?random');
	title.innerHTML = item.title
	if(item.text){
		text.innerHTML = item.text
	}
}

getResources()