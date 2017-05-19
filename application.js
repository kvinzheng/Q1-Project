$(document).ready(function() {
  $('select').material_select();
});

var map;
var infowindow;
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
  //this is where i call my google map
  initMap();
  let timeSelector = document.getElementById("selection-time");
  let dayofweekSelector = document.getElementById("selection-day");
  let sfdistrictSelector = document.getElementById("selection-district");
  let yearSelector = document.getElementById("selection-year")
  let resolutionSelector = document.getElementById("selection-resolution");

  getData()
  .then(function(incidents) {
    //I set my tbody's ID to myTableID, so that the first thing after I click would be refreshing my table first.
    $('#myTableID').empty();
    let allFilter = incidents.slice();
    //if time value exist
    if(timeSelector.value){
      allFilter = allFilter.filter(function(incident){
        return ( incident.time.split(':')[0] === timeSelector.value )
      });
    }
    //if day value exist
    if(dayofweekSelector.value){
      allFilter = allFilter.filter(function(incident){
        return ( incident.dayofweek === dayofweekSelector.value )
      });
    }
    //if district exist
    if(sfdistrictSelector.value){
      allFilter = allFilter.filter(function(incident){
        return ( incident.pddistrict === sfdistrictSelector.value )
      });
    }
    //if the year exist
    if(yearSelector.value){
      allFilter = allFilter.filter(function(incident){
        return ( incident.date.substring(0,4) === yearSelector.value )
      });
    }
    //if the resolution exist
    if(resolutionSelector.value){
      allFilter = allFilter.filter(function(incident){
        //  console.log(resolutionSelector.value);
        return ( incident.resolution === resolutionSelector.value )
      });
    }

    let numberofincident = document.getElementById("numberofIncident");
    numberofincident.innerText = allFilter.length;

    let afterFilter = allFilter.sort(function(a,b){
      return Date.parse(b.date.replace(/'-'/g, '/') - Date.parse(a.date.replace(/'-'/g, '/')))
    });
    //here is an array of coordinate
    //console.log(afterFilter);

    //I am return an new object for all my incident object.
    let incidentInfo = afterFilter.map(function(incident){
      return {
        time: incident.time,
        address: incident.address,
        descript: incident.descript,
        resolution: incident.resolution,
        date : incident.date,
        category: incident.category,
        coordinates: { lat: parseFloat(incident.y), lng: parseFloat(incident.x) },
      }
    });
    //alert("Found nothing, please try other options");
    if(afterFilter.length === 0){
      Materialize.toast("Found nothing, please try other options", 5000);
    }
    //var markersArray = [];
    //console.log(incidentInfo);
    //Here is where I will be putting marketing but also adding content to my markers as well

    incidentInfo.forEach(function(crimeObj){
      //console.log(crimeObj);
      var marker = new google.maps.Marker({
        position: crimeObj.coordinates,
        map: map,
        icon: "images/car.png"
      });

      var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h4 id="firstHeading" class="firstHeading">Car Incident</h4>'+
      '<div id="bodyContent">'+
      '<b> The incident occured at : </b>'+ crimeObj.address + '<p><b> The kind of car accident is </b>' + crimeObj.descript + '</p>' + '<p><b> After the police investigation,the result is </b>' + crimeObj.resolution + '.</p>' + '<p><b> The category is </b>'+ crimeObj.category + '</p>' + '<p><b> The date and time of the accident: </b>'+ crimeObj.time + ' , ' +
      crimeObj.date + '</p>' + '<p><b> Thanks for viewing my page.</b></p>'
      '</div>'+
      '</div>';

      marker.addListener('click', function(){
        //if the the infowindow (or the info box has information), then
        // I would close that box and then I would assignment a new box
        //the old one get disappear
        if(infowindow){
          console.log(infowindow);
          infowindow.close();
        }
        infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        infowindow.open(map, marker);
      });
      // google.maps.event.addListener(marker, 'click', function() {
      //    infowindow.open(map, this);
      // });
    });
    appendTable(afterFilter);
  });
});

//here is my append table
let selectClass = document.getElementsByClassName("select");
let tbody = document.querySelector("tbody");
function appendTable(afterFilterToAppend){
  for(let i = 0; i < afterFilterToAppend.length; i++){
    let row = document.createElement("tr");
    let time  = document.createElement("td");
    let day = document.createElement("td");
    let date = document.createElement("td");
    let district = document.createElement("td");
    let address = document.createElement("td");
    let year = document.createElement("td");
    let resolution = document.createElement("td");

    time.innerText = afterFilterToAppend[i].time;
    day.innerText = afterFilterToAppend[i].dayofweek;
    date.innerText = afterFilterToAppend[i].date;
    district.innerText = afterFilterToAppend[i].pddistrict;
    address.innerText = afterFilterToAppend[i].address;
    year.innerText = afterFilterToAppend[i].date.substring(0,4);
    resolution.innerText = afterFilterToAppend[i].resolution;
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
