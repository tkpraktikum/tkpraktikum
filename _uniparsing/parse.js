var uni = require('./universities.json');
var _ = require('lodash');

var countries = _.keys(uni).map((k) => uni[k]);
countries = countries.map((country) => {
	const cities = _.keys(country).filter((k) => k != 'country').map((c) => {
		return country[c];
	}).map((c) => {
		const result = {};
		result[c.town] = c.universities;
		return result;
	});
	const result = {};
	const countryName = country.country.split('(')[0].trim();
	result[countryName] = cities;
	return result;
});

var parsed = [];

countries.forEach((countries) => {	
	_.keys(countries).forEach((country) => {		
		countries[country].forEach((cityObj) => {
			const city = _.keys(cityObj)[0];
			cityObj[city].forEach((uni) => {				
				parsed.push({
					name: uni,
					country: country,
					city: city
				});
			});
		});
	});
})

parsed = parsed.filter((uni) => uni.country == 'Germany')

var fs = require('fs');
fs.writeFile("./parsed.json", JSON.stringify(parsed, null, '  '), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

