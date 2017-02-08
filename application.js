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
    zoom: 10,
    minZoom: 9,
    scrollwheel: true,
    zoomControlOptions:{
      position: google.maps.ControlPosition.BOTTOM_LEFT
    },
    streetViewControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_LEFT
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
  //i empty the table here

  let timeSelector = document.getElementById("selection-time");
  let dayofweekSelector = document.getElementById("selection-day");
  let sfdistrictSelector = document.getElementById("selection-district");

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

      let numberofincident = document.getElementById("numberofIncident");
      numberofincident.innerText = allThreeFilter.length;

      let AllThree = allThreeFilter.sort(function(a,b){
        return Date.parse(b.date.replace(/'-'/g, '/') - Date.parse(a.date.replace(/'-'/g, '/')))
      });

      //console.log(AllThree);
       //{ lat: 37.773972, lng: -122.431297 }

      //here is an array of coordinate
      let incidentCoordinates = AllThree.map(function(incident){
      return { lat: parseFloat(incident.y) , lng: parseFloat(incident.x) };
      });
      console.log(incidentCoordinates);
      initMap(incidentCoordinates);

      incidentCoordinates.forEach(function(coordinate){
        var marker = new google.maps.Marker({
          position: coordinate, //{lat: 388 ,lng:-122}
          map: map
        });
      });
      //append marker to my google map
      // console.log(incidentCoordinates);
      appendTable(AllThree);
    });
  });

//   function mapMaker(result) {
//     let contentString = `<div class="truckMap"><h4 class="truckHeader">${result.name}</h4><p class="truckText">Address: ${result.address}</p></div>`;
//     let latLng = new google.maps.LatLng(result.lat, result.lng);
//     let marker = new google.maps.Marker({
//         position: latLng,
//         animation: google.maps.Animation.DROP,
//         icon: "imgs/foodtruckMarker.png"
//     });
//     let infowindow = new google.maps.InfoWindow({
//         content: contentString,
//         id: `${result.identifier}`
//     });
//     marker.addListener('click', function() {
//         infowindow.open(map, marker);
//     });
//     markers.push(marker)
//     marker.setMap(map);
// }

//   function addToCollapse(data) {
//     let listItem = document.createElement('li');
//     let body = document.createElement('div');
//     let fullText = document.createElement('div');
//     let street = document.createElement('p');
//     let desc = document.createElement('p');
//     let hours = document.createElement('p');
//     body.setAttribute('class', "collapsible-header");
//     body.innerText = `${data.name}`;
//     fullText.setAttribute('class', "collapsible-body");
//     street.innerHTML = `<b> ${data.address}</b>`;
//     desc.innerHTML = `${data.description}`;
//     hours.innerHTML = `Open from ${data.start} to ${data.end} every ${data.day}`;
//     fullText.append(street);
//     fullText.append(desc);
//     fullText.append(hours);
//     listItem.append(body);
//     listItem.append(fullText);
//     truckList.append(listItem);
// }
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

      time.innerText = topFiveAllThree[i].time; //my click value
      day.innerText = topFiveAllThree[i].dayofweek; //my cl
      date.innerText = topFiveAllThree[i].date;
      district.innerText = topFiveAllThree[i].pddistrict;
      address.innerText = topFiveAllThree[i].address;

      row.appendChild(time);
      row.appendChild(day);
      row.appendChild(date);
      row.appendChild(district);
      row.appendChild(address);
      tbody.appendChild(row);
    }
    return tbody;
  }
