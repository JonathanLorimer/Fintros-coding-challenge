

const baseURL = 'https://hacker-news.firebaseio.com/v0/'

const getResources = async () => {
	const newStories = await fetch(`${baseURL}newstories.json`)
	const readable = await newStories.json()
	const top30 = readable.slice(0, 30)
	
	const top30data = await Promise.all( top30.map(x => fetch(`${baseURL}item/${x}.json`).then(y => y.json())) )
	console.log(top30data)
	// const pic = await fetch(`/scrape/${top30data[2].url}`, {method: 'GET'})
	// const fetchData = JSON.stringify(top30data.reduce((acc, { url, title, by }, i) => {
	// 	acc[i] = {url, title, by}
	// 	return acc
	// }, {}))
	const fetchData = JSON.stringify(top30data)
	const pic = await fetch('/scrape', {
		method: 'POST', 
		body: fetchData,
		headers: {
        	'Accept': 'application/json',
      		'Content-Type': 'application/json'
        },
	})
	const pic2 = await pic.json()
	// const pic = await fetch(`/scrape/hi`, {method: 'GET'})
	
	// const picReadable = await pic.text()
	console.log(pic2)
	// const imagesAdded = await Promise.all( top30data.map(x => fetch(x.url).then(y => y.json)))


}

// getResources()
