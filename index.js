let myMap = {
    location: [],
    businesses: [],
    markers: [],
    map: [],

    buildMap () {
        let map = L.map('map').setView(this.location, 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let marker = L.marker(this.location);
        marker.addTo(map).bindPopup(`<p>You are here</p>`).openPopup();
    },

    addMarkers() {
		for (let i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
        .addTo(map)
        .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
        .openPopup()
		}
	},
}

async function getCoordinates () {
    let position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    console.log(position);
    return [position.coords.latitude, position.coords.longitude]
}

async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3AAaDCSAfUzdxvHw4DhDymn5DadIP0C1u8qVHoCovqhU='
		}
	}
	let limit = 5
	let lat = myMap.location[0]
	let lon = myMap.location[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}

function processBusinesses(data) {
    let businesses = data.map((element) => {
        let area = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            long: element.geocodes.main.longitude
        };
        return area
    })
    return businesses
}

window.onload = async () => {
    let coordinates = await getCoordinates();
    myMap.location = coordinates;
    myMap.buildMap()
}

document.querySelector("#submit").addEventListener('click', async (event) => {
    event.preventDefault()
    let business = document.querySelector("#business").value
    console.log(business)
    let data = await getFoursquare(business)
    console.log(data)
    myMap.businesses = processBusinesses(data)
    console.log(myMap.businesses)
    myMap.addMarkers()
})