/* ---------------------------------------------- */
/*            CODE EXPLAINED TUTORIALS            */
/*         www.youtube.com/CodeExplained          */
/* ---------------------------------------------- */
//Select all the elements
const country_name_element = document.querySelector(".country .name"); 
const total_case_element = document.querySelector(".total-cases .value"); 
const new_cases_element = document.querySelector(".total-cases .new-value"); 
const recovered_element = document.querySelector(".recovered .value"); 
const new_recovered_element = document.querySelector(".recovered .new-value"); 
const deaths_element = document.querySelector(".deaths .value"); 
const new_deaths_element = document.querySelector(".deaths .new-value"); 

// Select canvas
const ctx = document.getElementById("axis_linear_chart").getContext("2d");

//App Variables
let app_data = [],
	case_list = [],
	recovered_list = [],
	deaths_list = [],
	indexes = [],
	dates = [];

//Get user country code
let country_code = geoplugin_countryCode();
let user_country;
country_list.forEach(country => {
	if(country.code == country_code){
		user_country = country.name;
	}
});

console.log(user_country);

/* ---------------------------------------------- */
/*                API URL AND KEY                 */
/* ---------------------------------------------- */
function fetchData(user_country){
	app_data = [],
	case_list = [],
	recovered_list = [],
	deaths_list = [],
	indexes = [],
	dates = [];


	fetch(`https://api.covid19api.com/live/country/${user_country}`, {
		"method": "GET",
		"headers": {
			'Content-type':'Application/json'
		}
	})
	.then(response => {
		return response.json();
	})
	.then(data => {
		// console.log(data);
		indexes = Object.keys(data);
		// console.log(indexes);

		indexes.forEach(index=>{
			let DATA = data[index];

			//For Date
			let date = data[index].Date;
			//  console.log(date);

			dates.push(date);
			app_data.push(DATA);
			case_list.push(DATA.Confirmed);
			recovered_list.push(DATA.Recovered);
			deaths_list.push(DATA.Deaths);
			
		})
		console.log(app_data);
		
	})
	.then(()=>{
		updateUI();
	})
	.catch(error=>{
		alert(error);
	})
}

fetchData(user_country);


//Update UI FUNCTION
function updateUI(){
	updateStats();
	axesLinearChart();
}

function updateStats(){
	let last_entry = app_data[app_data.length - 1];
	let before_last_entry = app_data[app_data.length-2];
	// console.log(last_entry);
	country_name_element.innerHTML = last_entry.Country;
	total_case_element.innerHTML = last_entry.Confirmed || 0;
	recovered_element.innerHTML = last_entry.Recovered || 0;
	deaths_element.innerHTML = last_entry.Deaths || 0;
	new_recovered_element.innerHTML = `+${last_entry.Recovered - before_last_entry.Recovered || 0}`;
	new_cases_element.innerHTML = `+${last_entry.Confirmed - before_last_entry.Confirmed || 0}`;
	new_deaths_element.innerHTML = `+${last_entry.Deaths - before_last_entry.Deaths || 0}`;
	
}


//CHART

let my_chart;
function axesLinearChart(){

	if(my_chart){
		my_chart.destroy();
	}
	 my_chart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
				label: 'Cases',
				data: case_list,
				fill:false,
				borderColor:'#fff',
				backgroundColor :'#fff',
				borderWidth:'1'
			},
			{
				label: 'Recovered',
				data: recovered_list,
				fill:false,
				borderColor:'#009688',
				backgroundColor :'#009688',
				borderWidth:'1'
			},
			{
				label: 'Deaths',
				data: deaths_list,
				fill:false,
				borderColor:'#f44336',
				backgroundColor :'#f44336',
				borderWidth:'1'
			}],
			labels: dates
		},
		options: {
			responsive:true,
			maintainAspectRatio : false
		}
	});
}
