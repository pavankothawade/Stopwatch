var timer = document.getElementById('timer');
var toggleBtn = document.getElementById('toggle');
var resetBtn = document.getElementById('reset');
var x = document.getElementById("LatLong");
var locationHistory;
var APIKey = "AIzaSyBUbI8iqT7MIOXXHvGcIUdDvwIR3v4r1X8";
var index;

try {
	
	locationHistory = JSON.parse(localStorage.getItem('locationHistory')) || [];
	for(var i = 0; i < locationHistory.length; i++)
		showInTable(locationHistory[i]);
} catch(e) {
	locationHistory = [];
} finally {
	localStorage.setItem('locationHistory', JSON.stringify(locationHistory));
}

var watch = new Stopwatch(timer);

function start() {
  toggleBtn.textContent = 'Stop';
  watch.start();
}

function stop() {
  toggleBtn.textContent = 'Start';
  watch.stop();
}

toggleBtn.addEventListener('click', function() {
  if(watch.isOn){
  		stop();
  }
  else{
  	start();
  	insertRow();
  }

});

resetBtn.addEventListener('click', function() {
  watch.reset();
});

function insertRow() {
	var time= watch.getTime();
	navigator.geolocation.getCurrentPosition(function(pos) {
		startTime = locationHistory[0] && locationHistory[0].timestamp || 0;
		localStorage.setItem('locationHistory', JSON.stringify(locationHistory));
		fetch('https://maps.googleapis.com/maps/api/timezone/json?location=' + pos.coords.latitude + ',' 
			+ pos.coords.longitude + '&timestamp=1509926736&key=' + APIKey)
		.then(function(response) {
			return response.json();
		}).then(function(data) {
			
			locationHistory.push({
				startTime: watch.timeFormatter(time),
				timezone: data.timeZoneName,
				latitude: pos.coords.latitude,
				longitude: pos.coords.longitude,
				
			});
			locationHistory[locationHistory.length - 1].elapsedTime = time-
			showInTable(locationHistory[locationHistory.length - 1]);
			
		});
	});
}
function showInTable(entry) {
    var table = document.getElementById("table");
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = entry.startTime;
    cell2.innerHTML = entry.timezone;
    cell3.innerHTML = entry.latitude;
    cell4.innerHTML = entry.longitude;
    
}
