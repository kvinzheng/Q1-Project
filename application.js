$(document).ready(function() {
  $('select').material_select();
});

var map;
function initMap(){
  //map options
  var sanfrancisco = { lat: 37.773972, lng: -122.431297 };
  var options = {
    diableDefaultUI: false,
    center: sanfrancisco,
    zoom: 12,
    minZoom: 9,
    scrollwheel: true,
    zoomControlOptions:{
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    }
  };
  var element = document.getElementById('map-canvas');
  //map
  map = new google.maps.Map(element, options);
}
// var incidents
function getData(){
  let url = ('https://data.sfgov.org/resource/vv57-2fgy.json');
  let incidents = [];
  return fetch(url).then(function(respo){
    return respo.json();
  })
  .then(function(resJson){
    resJson.forEach(function(incident){
      incidents.push(incident);
    })
    return incidents;
  })
  .catch(function(err){
    console.log(err);
  });
}

let form = document.getElementsByTagName('form')[0];
form.addEventListener("submit", function(e){
  e.preventDefault();
  initMap()
  //i empty the table here

  let timeSelector = document.getElementById("selection-time");
  let dayofweekSelector = document.getElementById("selection-day");
  let sfdistrictSelector = document.getElementById("selection-district");
  let yearSelector = document.getElementById("selection-year")

  getData()
    .then(function(incidents) {
      $('#myTableID').empty();
      //here is my coordinates
      let allThreeFilter = incidents.slice();

      //if time value exist
      if(timeSelector.value){
        allThreeFilter = allThreeFilter.filter(function(incident){
          return ( incident.time.split(':')[0] === timeSelector.value )
        });
      }
      //if day value exist
      if(dayofweekSelector.value){
        allThreeFilter = allThreeFilter.filter(function(incident){
          return ( incident.dayofweek === dayofweekSelector.value )
        });
      }
      //if district exist
      if(sfdistrictSelector.value){
        allThreeFilter = allThreeFilter.filter(function(incident){
          return ( incident.pddistrict === sfdistrictSelector.value )
        });
      }

      if(yearSelector.value){
        allThreeFilter = allThreeFilter.filter(function(incident){
          //  console.log(incident.date.substring(0,4));
          return ( incident.date.substring(0,4) === yearSelector.value )
        });
      }

      let numberofincident = document.getElementById("numberofIncident");
      numberofincident.innerText = allThreeFilter.length;

      let AllThree = allThreeFilter.sort(function(a,b){
        return Date.parse(b.date.replace(/'-'/g, '/') - Date.parse(a.date.replace(/'-'/g, '/')))
      });

      //here is an array of coordinate
      let incidentCoordinates = AllThree.map(function(incident){
      return { lat: parseFloat(incident.y) , lng: parseFloat(incident.x) };
      });
      console.log(incidentCoordinates);
      initMap();

      //var markersArray = [];
      incidentCoordinates.forEach(function(coordinate){
        var marker = new google.maps.Marker({
          position: coordinate, //{lat: 388 ,lng:-122}
          map: map
        });
        // markersArray.push(marker);
      });
      // google.maps.event.addListener(marker,"click",
      // function(){
      //   console.log(event);
      //   clearOverlays();}
      // );

      //append marker to my google map
      appendTable(AllThree);
    });
  });

  // function clearOverlays() {
  //   for (var i = 0; i < markersArray.length; i++ ) {
  //     markersArray[i].setMap(null);
  //   }
  //   markersArray.length = 0;
  // }

  // function removeMarkers(array) {
  //   array.forEach( (element) => {
  //     element.getMap() !== null ? element.setMap(null) : element.setMap(map)
  //   })
  // }

  let infowindow = new google.maps.InfoWindow({
    content: contentString
  })

  //here is my append table
  let selectClass = document.getElementsByClassName("select");
  let tbody = document.querySelector("tbody");

  function appendTable(topFiveAllThree){
    for(let i = 0; i < topFiveAllThree.length; i++){
      let row = document.createElement("tr");
      let time  = document.createElement("td");
      let day = document.createElement("td");
      let date = document.createElement("td");
      let district = document.createElement("td");
      let address = document.createElement("td");
      let year = document.createElement("td");

      time.innerText = topFiveAllThree[i].time; //my click value
      day.innerText = topFiveAllThree[i].dayofweek; //my cl
      date.innerText = topFiveAllThree[i].date;
      district.innerText = topFiveAllThree[i].pddistrict;
      address.innerText = topFiveAllThree[i].address;
      year.innerText = topFiveAllThree[i].date.substring(0,4);
      row.appendChild(time);
      row.appendChild(day);
      row.appendChild(date);
      row.appendChild(district);
      row.appendChild(address);
      row.appendChild(year);
      tbody.appendChild(row);
    }
    return tbody;
  }
