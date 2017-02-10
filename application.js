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
    minZoom: 11,
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
  initMap()
  //i empty the table here

  let timeSelector = document.getElementById("selection-time");
  let dayofweekSelector = document.getElementById("selection-day");
  let sfdistrictSelector = document.getElementById("selection-district");
  let yearSelector = document.getElementById("selection-year")
  let resolutionSelector = document.getElementById("selection-resolution")

  getData()
  .then(function(incidents) {
    $('#myTableID').empty();
    //here is my coordinates
    //  console.log(incidents);
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
    //if the year exist
    if(yearSelector.value){
      allThreeFilter = allThreeFilter.filter(function(incident){
        return ( incident.date.substring(0,4) === yearSelector.value )
      });
    }
    //if the resolution exist
    if(resolutionSelector.value){
      allThreeFilter = allThreeFilter.filter(function(incident){
        //  console.log(resolutionSelector.value);
        return ( incident.resolution === resolutionSelector.value )
      });
    }

    let numberofincident = document.getElementById("numberofIncident");
    numberofincident.innerText = allThreeFilter.length;

    let AllThree = allThreeFilter.sort(function(a,b){
      return Date.parse(b.date.replace(/'-'/g, '/') - Date.parse(a.date.replace(/'-'/g, '/')))
    });

    console.log(AllThree);
    //here is an array of coordinate

    let incidentInfo = AllThree.map(function(incident){
      return {
        address: incident.address,
        descript: incident.descript,
        resolution: incident.resolution,
        coordinates: { lat: parseFloat(incident.y), lng: parseFloat(incident.x) },
        category: incident.category
      }
    });
    initMap();

    if(AllThree.length === 0){
      //alert("Found nothing, please try other options");
      Materialize.toast("Found nothing, please try other options", 5000);

    }
    //var markersArray = [];
    console.log(incidentInfo);
    incidentInfo.forEach(function(crimeObj){
      console.log(crimeObj);
      var marker = new google.maps.Marker({
        position: crimeObj.coordinates, //{lat: 388 ,lng:-122}
        map: map,
        icon: "images/car.png"
      });


      var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h4 id="firstHeading" class="firstHeading">Car Incident</h4>'+
        '<div id="bodyContent">'+
        '<b> The incident occured at : </b>'+ crimeObj.address + '<p><b> The kind of car accident is </b>' + crimeObj.descript + '</p>' + '<p><b>The kind of accident is </b>' + crimeObj.resolution + '.</p>' + '<p><b> the category is </b>'+ crimeObj.category + '</p>' +
        '</div>'+
        '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });

    });
    appendTable(AllThree);
  });
});

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
    let resolution = document.createElement("td");

    time.innerText = topFiveAllThree[i].time; //my click value
    day.innerText = topFiveAllThree[i].dayofweek; //my cl
    date.innerText = topFiveAllThree[i].date;
    district.innerText = topFiveAllThree[i].pddistrict;
    address.innerText = topFiveAllThree[i].address;
    year.innerText = topFiveAllThree[i].date.substring(0,4);
    resolution.innerText = topFiveAllThree[i].resolution;
    row.appendChild(time);
    row.appendChild(day);
    row.appendChild(date);
    row.appendChild(district);
    row.appendChild(address);
    row.appendChild(year);
    row.appendChild(resolution);
    tbody.appendChild(row);
  }
  return tbody;
}
