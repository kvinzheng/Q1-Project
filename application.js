$(document).ready(function() {
  $('select').material_select();
});


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
  var map = new google.maps.Map(element, options);
  var marker = new google.maps.Marker({
    position: sanfrancisco,
    map: map
  });
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

      //console.log(document.getElementById('myTableID'));
      // console.log(incidents);
      // let sum = 0;
      // incidents.forEach(function(incident){
      //   if( (timeSelector.value === incident.time.split(':')[0]) && (dayofweekSelector.value === incident.dayofweek) && (sfdistrictSelector.value === incident.pddistrict) ){
      //     sum = sum + 1;
      //   }
      // });

      // let numberofincident = document.getElementById("numberofIncident");
      // numberofincident.innerText = sum;
      // console.log(sum);
      //
      // let allThreeFilter = incidents.filter(function(incident){
      //   //if time has no value
      //   return ( incident.time.split(':')[0] === timeSelector.value ) &&
      //          ( incident.pddistrict === sfdistrictSelector.value)
      //
      //   return ( incident.dayofweek === dayofweekSelector.value ) &&
      //          ( incident.pddistrict === sfdistrictSelector.value)
      //   // else
      //   return ( incident.time.split(':')[0] === timeSelector.value ) &&
      //          ( incident.dayofweek === dayofweekSelector.value ) &&
      //          ( incident.pddistrict === sfdistrictSelector.value)
      // })

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

      let topFiveAllThree = allThreeFilter.sort(function(a,b){
        return b.date - a.date;
        return Date.parse(b.date.replace(/'-'/g, '/') - Data.parse(a.date.replace(/'-'/g, '/')))
      }).slice(0,6)




      console.log(topFiveAllThree);

      appendTable(topFiveAllThree);
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

      time.innerText = topFiveAllThree[i].time.split(':')[0]; //my click value
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
