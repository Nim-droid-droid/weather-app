function getSign(n) {
    n = Number(n);
    if (n >= 0) {
        return "+";
    } else {
        return "-";
    }
}

const GEO_LOOKUP_API_ENDPOINT = 'https://wft-geo-db.p.rapidapi.com/v1/geo'
class Location {
    constructor (lat, long) {
        this.lat = lat;
        this.long = long;
        this.iso6709 = `${getSign(this.lat)}${this.lat}${getSign(this.long)}${this.long}`
        let options = {
            headers: {
                'x-rapidapi-key': '8238767cc1mshc32e2b8c3bbb1eap1b663cjsn0b2ac076e49b',
            },
            mode: 'cors',
        };
        this.nearby_cities = fetch(`${GEO_LOOKUP_API_ENDPOINT}/locations/${this.iso6709}/nearbyCities`, options)
                    .then(response => response.json())
                    .catch(err => console.log(`Error: ${err}`));
    }

    getLargestNearbyCity() {
        this.nearby_cities.then(json => {
            let largest_city = json.data.reduce((acc, city) => {
                return city.population > acc ? city : acc;
            }, 0)

            console.log('LARGEST NEARBY CITY: ', largest_city);
        })
    }
}

const FORECAST_API_ENDPOINT = 'https://api.open-meteo.com/v1/forecast'
class WeatherForecast {
    constructor(location) {
        this.location = location;
        let options = {
            headers: {},
            mode: 'cors',
        };
        this.forecast = fetch(`${FORECAST_API_ENDPOINT}?latitude=${this.location.lat}&longitude=${this.location.long}&hourly=temperature_2m,apparent_temperature,rain,showers,snowfall,weathercode`, options)
                        .then(response => response.json())
                        .catch(err => console.log(`Error: ${err}`));
    }
}

// Example city lookup by latitude/longitude
loc = new Location("29.97944705", "31.13408231")
loc.nearby_cities.then(json => console.log('NEARBY CITIES: ', json));
loc.getLargestNearbyCity();

// Example forecast lookup
weather = new WeatherForecast(loc);
weather.forecast.then(json => console.log('FORECAST: ', json))