var mapaCatalunya = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 9);

//map.locate({setView: true, maxZoom: 17});
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(mapaCatalunya);

//en el cluster almaceno todos los markers
var markers = L.markerClusterGroup();
var data_markers = [];

var kind_food_array = [];
var kind_food_array_isolated = [];

function onMapLoad() {

	console.log("Mapa cargado");
    /*
	FASE 3.1
		1) Relleno el data_markers con una petición a la api
		2) Añado de forma dinámica en el select los posibles tipos de restaurantes
		3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
	*/

	$.ajax({
		url: 'http://localhost/mapa/api/apiRestaurants.php',
		type: 'get',
		dataType: 'json',
		success: function (restaurant) {
			$.each(restaurant, function (index, item) {  // snippet jqEach para leer cada item de la colección restaurant json
				data_markers.push(item);       // introduzco cada item en el array data_markers

				kind_food_array.push(item.kind_food.split(",")); // creo un array de arrays, que contienen el tipo de comida de cada restaurant
			});

			var j;
			var k;
			for (j = 0; j < kind_food_array.length; j++) {  // recorro el array de arrays con el tipo de comida de cada restaurant
				for (k = 0; k < kind_food_array[j].length; k++) { // recorro cada array de comidas (un array por restaurant)
					let kind_food_array_members = kind_food_array[j];  // le doy un nombre a cada array de comidas
					let existe = kind_food_array_isolated.find(existe => existe === kind_food_array_members[k]); // averiguo si algún tipo de comidas en el array ya existe en el array final individualizado
					if (existe == undefined) {
						kind_food_array_isolated.push(kind_food_array_members[k]); // si el tipo de comida no existe todavía, lo agrego al array final
						document.getElementById("kind_food_selector").innerHTML += `<option value="${kind_food_array_members[k]}">${kind_food_array_members[k]}</option> <br>`;

					}
				}
			}
			console.log(data_markers);
			
			render_to_map(data_markers,'');

		},

	});


}


$('#kind_food_selector').on('change', function () {
	console.log(this.value);
	render_to_map(data_markers, this.value);
});

function render_to_map(array_of_restaurants, filter) {

	markers.clearLayers();

	for (restaurant of array_of_restaurants) {
		//console.log(item.kind_food);
		if (restaurant.kind_food.includes(filter)) {
			markers.addLayer(L.marker([restaurant.lat, restaurant.lng])
				.bindPopup("<b>" + restaurant.name + "</b><br>" + restaurant.address + "<br>" + restaurant.kind_food));
		}
	}

	mapaCatalunya.addLayer(markers);




	/*
	FASE 3.2
		1) Limpio todos los marcadores 
		2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	*/

}
