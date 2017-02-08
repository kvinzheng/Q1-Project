// let APIKey = localStorage.APIKey;
// console.log(APIKey);
$(document).ready(function() {
  $('select').material_select();
});

function loadScript() {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?' +
      'key=' + GOOGLE_MAP_KEY +'&callback=initMap'; //& needed
      document.body.appendChild(script);
    }

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
    //console.log(respo.json());
    return respo.json();
  })
  .then(function(resJson){
    resJson.forEach(function(incident){
      incidents.push(incident);
    })
    //console.log(incidents.length);
    //console.log(resJson);
    return incidents;
  })
  .catch(function(err){
    console.log(err);
  });

}

let form = document.getElementsByTagName('form')[0];
form.addEventListener("submit", function(e){
  e.preventDefault();
  let timeSelector = document.getElementById("selection-time");
  let dayofweekSelector = document.getElementById("selection-day");
  let sfdistrictSelector = document.getElementById("selection-district");
  // console.log(timeSelector.value, dayofweekSelector.value, sfdistrictSelector.value, "KJLKJLKJLKJL");

  getData().then(function(incidents) {
    console.log(incidents);
    // let timesArray = [];
    // let dayArray = [];
    // let districtArray =[];

    // REFACTOR TO HAVE 1 MAP THROUGH incidents
    // incidents.forEach(function(incident){
    //  timesArray.push(incident.time.split(':')[0]);
    //  dayArray.push(incident.dayofweek);
    //  districtArray.push(incident.pddistrict);
    // });
    // console.log(timesArray);
    // console.log(dayArray);
    // console.log(districtArray);

    let sum = 0;
    //i will fix this duplication
    //ask matt about this one more time

    incidents.forEach(function(incident){
      if( (timeSelector.value === incident.time.split(':')[0]) && (dayofweekSelector.value === incident.dayofweek) && (sfdistrictSelector.value === incident.pddistrict) ){
        sum = sum + 1;
      }
    });

    let numberofincident = document.getElementById("numberofIncident");
    numberofincident.innerText = sum;
    console.log(sum);

    //I am sorting the top five object with selection of time with in the order of timestamp.

    let allThreeFilter = incidents.filter(function(incident){
      // console.log(incident.dayofweek);
      // console.log(dayofweekSelector.value);
      return ( incident.time.split(':')[0] === timeSelector.value ) &&
             ( incident.dayofweek === dayofweekSelector.value ) &&
             ( incident.pddistrict === sfdistrictSelector.value)
    })

    console.log(allThreeFilter);
    let topFiveAllThree = allThreeFilter.sort(function(a,b){
      return a.data - b.data;
    }).slice(0,6)
    console.log(topFiveAllThree);


    appendTable()
    });
  });

  //here is my append table

  let selectClass = document.getElementsByClassName("select");
  let tbody = document.querySelector("tbody");

  function appendTable(){
    let row = document.createElement("tr");
    let time  = document.createElement("td");
    let day = document.createElement("td");
    let date = document.createElement("td");
    let district = document.createElement("td");
    let address = document.createElement("td");

    time.innerText = incident.time.split(':')[0];
    day.innerText = incident.dayofweek;
    date.innerText = incident.date;
    district.innerText = incident.pddistrict;
    address.innerText = incident.address;

    // var selectTime = document.getElementById("selection-time");
    // var selectDay = document.getElementById("selection-day");
    // var selectDistrict = document.getElementById("selection-district");

    // var selectDay = this.getAttribute('name');
    // var selectDistrict = this.getAttribute('name');
    row.appendChild(time);
    row.appendChild(day);
    row.appendChild(date);
    row.appendChild(district);
    row.appendChild(address);
    tbody.appendChild(row);
    return tbody;
  }
