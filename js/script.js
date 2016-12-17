/*

https://maps.googleapis.com/maps/api/staticmap?
key=AIzaSyBDkndks0CdxUyRzM96_6PGROXu0tzk84g&
center=Brooklyn+Bridge,New+York,NY&
zoom=13&
size=600x300&
maptype=satellite

interesting locations:
43.9765 15.382
Issaouane
deep+water+cay
32.340816,20.559541
21.303 -158.02
*/

//default city and zoom
var city = "miami";
var zoom = 13;

// default slider values
var sliderValueR = 0;
var sliderValueG = 0;
var sliderValueB = 0;


//make the sliders
makeSlider();


function makeSlider(){
	// make the sliders
	$("#sliderW").slider();
	$("#sliderR").slider();
	$("#sliderG").slider();
	$("#sliderB").slider();
}

//make the map
makeMap(zoom,city);


function makeMap(zoom,city){
	var state = "";
	var width = 1280;
	var height = 720;
	var scale = 2;


	var url = {
		https: "https://maps.googleapis.com/maps/api/staticmap?",
		key: "key=AIzaSyBDkndks0CdxUyRzM96_6PGROXu0tzk84g&",
		center: "center=" + city + state + "&",
		zoom:"zoom=" + zoom + "&",
		size:"size=" + width + "x" + height + "&",
		scale: "scale=" + scale + "&",
		mapType: "maptype=satellite"
	}//var url





	// add image to imageContainer (this is hidden)
	$("#imageContainer").html("<img id='myImage' crossorigin='anonymous' src=" + url.https + url.key + url.center + url.zoom + url.size + url.scale + url.mapType + ">")



	//variables to put image on the canvas
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var img = document.getElementById("myImage");

	//put image on canvas
	img.onload = function() {

		// clears anything on canvas
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, c.width, c.height);


		// draws map in canvas
		ctx.drawImage(img,0,0); 


		//hide loading div
		$("#loading").hide();

		drawCircles();	

	};//onload



}//makeMap






//draw circles on myCanvas2
function drawCircles(){
	var c = document.getElementById("myCanvas2");
	var ctx = c.getContext("2d");

	//make background black
	ctx.fillStyle = "black"
	ctx.fillRect(0, 0, 1280, 720);

	var radius = 3;
	//rows
	for (var x = radius; x < 1280; x+=radius*2){

		//columns
		for (var y = radius; y < 720; y+=radius*2){

			// draw the circle
			ctx.beginPath();
			ctx.arc(x,y,radius,0,2*Math.PI);

			//getColor function is at the bottom of this page
			var fillColor = getColor(x,y);

			//get the fill the circle with a specific color
			ctx.fillStyle = "rgb(" + fillColor + ")";
			ctx.fill();


		}//column loop
	}//row loop


}//drawCircles





// gets the rgb at coordinates x,y
function getColor(x,y){

	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var img = document.getElementById("myImage");

	var r = ctx.getImageData(x,y,1,1).data[0] + sliderValueR;
	var g = ctx.getImageData(x,y,1,1).data[1] + sliderValueG;
	var b = ctx.getImageData(x,y,1,1).data[2] + sliderValueB;

	return r  + "," + g + "," + b ;

	//return(closestNumber(r,g,b));


}//getColor

//when user slides white slider
$("#sliderW").on("slideStop", function(slideEvt) {
	//get value of slider. save a zoom
	var zoom = parseInt($("#WC .slider-handle").attr("aria-valuenow"));

	//update map
	makeMap(zoom,city);
});

//when user slides red slider...
$("#sliderR").on("slideStop", function(slideEvt) {
	// updates slidervalue
	sliderValueR = slideEvt.value;

	//redraws circle
	drawCircles();
});


$("#sliderG").on("slideStop", function(slideEvt) {
	sliderValueG = slideEvt.value;
	drawCircles();
});


$("#sliderB").on("slideStop", function(slideEvt) {
	sliderValueB = slideEvt.value;
	drawCircles();
});



//when user clicks on search
$("#searchBttn").on("click", function(){
	//if there's text in the search box
	if ($(".form-control").val() !== ""){
		//then redraw map with new city
		city = $(".form-control").val().split(" ").join("+");

		var zoom = parseInt($("#WC .slider-handle").attr("aria-valuenow"));

		//show loading div
		$("#loading").show();

		makeMap(zoom,city);
	}
})


//when user presses enter after search
$(".form-control").keypress(function(event){

	//if user presses enter & there's stuff in the box & it's focused
	if(event.which == 13 && $(".form-control").val() !== "" && $(".form-control").is(":focus")){
		//then redraw map with new city
		city = $(".form-control").val().split(" ").join("+");

			var zoom = parseInt($("#WC .slider-handle").attr("aria-valuenow"));


		//show loading div
		$("#loading").show();


		makeMap(zoom,city);
	}
})






