function initMap(){
  //map options
  var sanfrancisco = { lat: 37.773972, lng: -122.431297 };
  var options = {
    diableDefaultUI: false,
    center: sanfrancisco,
    zoom: 10,
    minZoom: 9,
    scrollwheel: true,
    //zoomControlOptions:{
      //position: google.maps.ControlPosition.TOP_RIGHT
      //style: google.map.ZoomControlStyle.DEFAULT
    //}
  };

  var element = document.getElementById('map-canvas');
  //map
  var map = new google.maps.Map(element, options);

  // google.maps.event.addListener(map.gMap,'click', function(e){
  //   alert('click');
  //   console.log(e);
  // });
  var marker = new google.maps.Marker({
    position: sanfrancisco,
    map: map
  });
}

var incidents
function getData(){
  let url = ('https://data.sfgov.org/resource/vv57-2fgy.json');
  incidents = [];
  return fetch(url).then(function(respo){
    //console.log(respo.json());
    return respo.json();
  })
  .then(function(resJson){
    resJson.forEach(function(incident){
      incidents.push(incident);
    })
    console.log(incidents.length);
  })
  .catch(function(err){
    console.log(err);
  });

}
getData();
setTimeout(function(){
  console.log(incidents)
},1000);
//console.log(incidents);
