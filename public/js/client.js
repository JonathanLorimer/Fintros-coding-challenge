
const baseURL = 'https://hacker-news.firebaseio.com/v0/'

const getRandomNumber = () => Math.floor(Math.random() * 1000)

let articleArray = []
let nextUp = []
let counter = 60
let newStoriesRef = []

document.getElementsByClassName('hacker-news__filters--even-label')[0].addEventListener("click", () => {
	let even = articleArray.filter((e, i) => ((i + 2) % 2 !== 0) && e )
	let list = document.getElementsByClassName('hacker-news__post-list')[0]
	while (list.firstChild) {
		list.removeChild(list.firstChild);
	}
	heroStory(even[0])
	even.slice(1).forEach(e => {
		generatePost(e)
	})
});

document.getElementsByClassName('hacker-news__filters--odd-label')[0].addEventListener("click", () => {
	let odd = articleArray.filter((e, i) => ((i + 2) % 2 === 0) && e)
	let list = document.getElementsByClassName('hacker-news__post-list')[0]
	while (list.firstChild) {
		list.removeChild(list.firstChild);
	}
	heroStory(odd[0])
	odd.slice(1).forEach(e => {
		generatePost(e)
	})
});


window.addEventListener('scroll', () => {
	let rect = document.getElementsByClassName('hacker-news__more-posts')[0].getBoundingClientRect();
	console.log(rect)
	if (rect.top < 100 && nextUp.length > 0 && newStoriesRef.length > 0){
		articleArray.concat(nextUp)
		nextUp.forEach(e => {
			generatePost(e)
		})

		nextUp = []
		dispatchLookup()
	}
})

const getResources = async () => {
	const newStories = await fetch(`${baseURL}newstories.json`)
	const readable = await newStories.json()
	newStoriesRef = readable
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
	let top30finalized = await getPictures.json()
	top30finalized = top30finalized.filter(e => e)
	articleArray = top30finalized
	if(document.getElementById('filter-even').checked){
		let even = top30finalized.filter((e, i) => ((i + 2) % 2 !== 0) && e )
		heroStory(even[0])
		even.slice(1).forEach(e => {
			generatePost(e)
		})

	} else if(document.getElementById('filter-odd').checked) {
		let odd = top30finalized.filter((e, i) => ((i + 2) % 2 === 0) && e)
		heroStory(odd[0])
		odd.slice(1).forEach(e => {
			generatePost(e)
		})
	} else {
		heroStory(top30finalized[0])
		top30finalized.slice(1).forEach(e => {
			generatePost(e)
		})
	}

	

	const next30 = readable.slice(30, 60)
	const next30data = await Promise.all( next30.map(x => fetch(`${baseURL}item/${x}.json`).then(y => y.json())) )
	console.log(next30data)
	const fd = JSON.stringify(next30data)
	const gp = await fetch('/scrape', {
		method: 'POST', 
		body: fd,
		headers: {
        	'Accept': 'application/json',
      		'Content-Type': 'application/json'
        },
	})
	let next30finalized = await gp.json()
	next30finalized = next30finalized.filter(e => e)
	nextUp = next30finalized
}


const heroStory = item => {
	let link = document.getElementsByClassName("hacker-news__hero-story--link")[0]
	let image = document.getElementsByClassName("hacker-news__hero-story--image")[0]
	let title = document.getElementsByClassName("hacker-news__hero-story--title")[0]
	let text = document.getElementsByClassName("hacker-news__hero-story--text")[0]

	link.setAttribute('href', item.url);
	if(item.image) {
		image.setAttribute('src', item.image)
	}
	else {
		image.setAttribute('src', 'https://source.unsplash.com/random') 
	}
	title.innerHTML = item.title
	if(item.text){
		if(item.text.length > 250){
			text.innerHTML = item.text.slice(0,251) + '...'
		} else {
			text.innerHTML = item.text
		}
	}
}

const generatePost = post => {
	const template = document.getElementById('post-template').cloneNode(true)
	let link = template.content.querySelector('.hacker-news__post--link')
	let image = template.content.querySelector('.hacker-news__post--image')
	let title = template.content.querySelector('.hacker-news__post--title')
	let text = template.content.querySelector('.hacker-news__post--text')

	link.setAttribute('href', post.url);
	if(post.image) {
		image.setAttribute('src', post.image)
	}
	else {
		image.setAttribute('src', 'https://source.unsplash.com/random')
	}
	title.innerHTML = post.title
	if(post.text){
		if(post.text.length > 250){
			text.innerHTML = post.text.slice(0,251) + '...'
		} else {
			text.innerHTML = post.text
		}
	}

	document.getElementsByClassName('hacker-news__post-list')[0].appendChild(template.content.querySelector('.hacker-news__post'))
}

const dispatchLookup = async () => {
	const next30 = newStoriesRef.slice(counter, counter + 30)
	const next30data = await Promise.all( next30.map(x => fetch(`${baseURL}item/${x}.json`).then(y => y.json())) )
	console.log(next30data)
	const fd = JSON.stringify(next30data)
	const gp = await fetch('/scrape', {
		method: 'POST', 
		body: fd,
		headers: {
        	'Accept': 'application/json',
      		'Content-Type': 'application/json'
        },
	})
	let next30finalized = await gp.json()
	next30finalized = next30finalized.filter(e => e)
	nextUp = next30finalized
	counter += 30
}

getResources()

// https://i.redd.it/ounq1mw5kdxy.gif