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
      //style: google.map.ZoomControlStyle.DEFAULT
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
    getData().then(function(incidents) {
    let timesArray = incidents.map(function(incident){
      return incident.time.split(':')[0];
    });

    let dayArray = incidents.map(function(incident){
      return incident.dayofweek
    });

    let districtArray = incidents.map(function(incident){
      return incident.pddistrict
    });

    let time = document.getElementById("selection-time");
    let dayofweek = document.getElementById("selection-day");
    let sfdistrict = document.getElementById("selection-district");

    let sum = 0;
    timesArray.forEach(function(hour){
      if(time.value === hour){
        sum = sum + 1;
      }
    });
    dayArray.forEach(function(day){
      if(dayofweek.value === day){
        sum = sum + 1;
      }
    });
    districtArray.forEach(function(district){
      if(sfdistrict.value === district){
        sum = sum + 1;
      }
    });

    let numberofincident = document.getElementById("numberofIncident");
    numberofincident.innerText = sum;
    //console.log(sum);
      // I am filtering the array here.
      let filterTime = incidents.filter(function(incident){
        return incident.time.split(':')[0] === time.value;
      });
      let filterDay = incidents.filter(function(incident){
        return incidents.dayofweek === dayofweek.value;
      });

      let filterDistrict =  incidents.filter(function(incident){
        return incidents.pddistrict === sfdistrict.value;
      });

      console.log(filterTime);

    });
  });
