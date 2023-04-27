
// Calgary: 51.038372 , -114.059702

let latitudeHome = 56
let longitudeHome = -114
let zoom = 5
let map = L.map('map').setView([latitudeHome,longitudeHome],zoom)




//Agregar tilelAyer mapa base desde openstreetmap:
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



document.getElementById('btnBuscar').addEventListener('click',function(){

  let heelLatitude = Number(document.getElementById('heelLat').value)
  let heelLongitude = Number(document.getElementById('heelLon').value)
  let toeLatitude = Number(document.getElementById('toeLat').value)
  let toeLongitude = Number(document.getElementById('toeLon').value)

  if(heelLatitude == 0 && heelLongitude == 0 && toeLatitude == 0 && toeLongitude == 0){
    heelLatitude = 56;
    heelLongitude = -114;
    toeLatitude = 55.99;
    toeLongitude = -114;
  }


  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


  function rad2deg(rad) {
    return rad * (180/Math.PI)
  }


  function getDistance(lat1,lon1,lat2,lon2) {
    // Haversine formula:
    let R = 6371e3; // metres // let R = 6378.14e3; // metres
    let radLatHeel = lat1 * Math.PI/180; // φ, λ in radians
    let radLatToe = lat2 * Math.PI/180;
    let deltaLan = (lat2-lat1) * Math.PI/180;
    let deltaLon = (lon2-lon1) * Math.PI/180;
    let a = Math.sin(deltaLan/2) * Math.sin(deltaLan/2) + Math.cos(radLatHeel) * Math.cos(radLatToe) * Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // in metres
    return d;
  }
  let distance = getDistance(heelLatitude, heelLongitude, toeLatitude, toeLongitude)


  function getBearing(lat1,lon1,lat2,lon2){
    let radLatHeel = deg2rad(lat1)
    let radLatToe = deg2rad(lat2)
    let radLonHeel = deg2rad(lon1)
    let radLonToe = deg2rad(lon2)
    let y = Math.sin(radLonToe - radLonHeel) * Math.cos(radLatToe);
    let x = Math.cos(radLatHeel) * Math.sin(radLatToe) - Math.sin(radLatHeel) * Math.cos(radLatToe) * Math.cos(radLonToe - radLonHeel);
    let T = Math.atan2(y, x); //in radians
    let brng = (T * 180/Math.PI + 360) % 360; // in degrees
    return brng
  }
  let Bearing = getBearing(heelLatitude, heelLongitude, toeLatitude, toeLongitude)


  let textAz = document.getElementById('az').innerText = " Distance: " + distance.toFixed(2) + " m | Bearing: " + Bearing.toFixed(2) + " deg";

  let rigIcon = L.icon({
    iconUrl: 'https://res.cloudinary.com/metacortexjohn/image/upload/v1682359935/rig01_vgeizw.png',
    iconSize:     [15, 25], // size of the icon
    // iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
  });
  L.marker([heelLatitude, heelLongitude], {icon: rigIcon}).addTo(map);

  let line1 = L.polygon([
    [heelLatitude, heelLongitude],
    [toeLatitude, toeLongitude]
  ]).addTo(map);

  // Notes:------------------------------------------
    // R = 6371e3; // metres
    // 1° ≈ 111 km (110.57 eq’l — 111.70 polar
    // 1′ ≈ 1.85 km (= 1 nm)	0.01° ≈ 1.11 km
    // 1″ ≈ 30.9 m	0.0001° ≈ 11.1 m   
    // 20m -> 0.6472"
    // 20m -> 0.00018°
    // 1m -> 0.000009
  //-------------------------------------------------

  let radNBearing = deg2rad(Bearing) - Math.PI
  let degNBearing = rad2deg(radNBearing)
  console.log("degNBearing: " + degNBearing)


  function offset_well(d , Bearing , color){
    let R = 6371; // km
    let radLatHeel = deg2rad(heelLatitude);
    let radLonHeel = deg2rad(heelLongitude);
    let rad_B = deg2rad(Bearing);
    let dR = d/R;
    let radLat2 = Math.asin( Math.sin(radLatHeel) * Math.cos(dR) + Math.cos(radLatHeel) * Math.sin(dR) * Math.cos(rad_B) );
    let degLat2 = rad2deg(radLat2);
    let radLon2 = radLonHeel + Math.atan2( Math.sin(rad_B) * Math.sin(dR) * Math.cos(radLatHeel) , Math.cos(dR) - Math.sin(radLatHeel) * Math.sin(radLat2) );
    let degLon2 = rad2deg(radLon2);
    console.log("Offset Bearing: " + Bearing);
    console.log("Offset Distance: " + d);
    console.log("Offset lat: " + degLat2);
    console.log("Offset lon: " + degLon2);
    let circle = L.circle([degLat2, degLon2], {
      color: color,
      fillColor: color,
      fillOpacity: 0.5,
      radius: 10
    }).addTo(map);
    return ([degLat2, degLon2])
  }


  function offset_well_2(lat1 , lon1 , d , Bearing , color){
    d = d/1000
    let R = 6371; // km
    let radLatHeel = deg2rad(lat1);
    let radLonHeel = deg2rad(lon1);
    let rad_B = deg2rad(degNBearing + Bearing);
    let dR = d/R;
    let radLat2 = Math.asin( Math.sin(radLatHeel) * Math.cos(dR) + Math.cos(radLatHeel) * Math.sin(dR) * Math.cos(rad_B) );
    let degLat2 = rad2deg(radLat2);
    let radLon2 = radLonHeel + Math.atan2( Math.sin(rad_B) * Math.sin(dR) * Math.cos(radLatHeel) , Math.cos(dR) - Math.sin(radLatHeel) * Math.sin(radLat2) );
    let degLon2 = rad2deg(radLon2);
    let circle = L.circle([degLat2, degLon2], {
      color: color,
      fillColor: color,
      fillOpacity: 0.5,
      radius: 10
    }).addTo(map);
    return ([degLat2, degLon2])
  }



  function offset_well_3(lat1 , lon1 , x , y , color){
    y = y + 400;
    let lat2 = lat1 + (y * 0.000009);
    let lon2 = lon1 + (x * 0.000009);
    console.log("offset 3 lat2: " + lat2);
    console.log("offset 3 lon2: " + lon2);    
    let d = getDistance(lat1, lon1, lat2, lon2);
    let Bearing = getBearing(lat1, lon1, lat2, lon2);
    d = d/1000
    console.log("offset 3 distance: " + d + "km");
    console.log("offset 3 bearing: " + Bearing + "deg Az."); 
    let R = 6371; // km
    let radLatHeel = deg2rad(lat1);
    let radLonHeel = deg2rad(lon1);
    let rad_B = deg2rad(degNBearing + Bearing);
    let dR = d/R;
    let radLat2 = Math.asin( Math.sin(radLatHeel) * Math.cos(dR) + Math.cos(radLatHeel) * Math.sin(dR) * Math.cos(rad_B) );
    let degLat2 = rad2deg(radLat2);
    let radLon2 = radLonHeel + Math.atan2( Math.sin(rad_B) * Math.sin(dR) * Math.cos(radLatHeel) , Math.cos(dR) - Math.sin(radLatHeel) * Math.sin(radLat2) );
    let degLon2 = rad2deg(radLon2);
    let circle = L.circle([degLat2, degLon2], {
      color: color,
      fillColor: color,
      fillOpacity: 0.5,
      radius: 10
    }).addTo(map);
    return ([degLat2, degLon2])
  }







  let color = 'black'

  // Cabezal de referencia:
  let latNlon2 = offset_well(0 , degNBearing, color); //-400,0
  let degLat2 = latNlon2[0]
  let degLon2 = latNlon2[1]


  // Verdes:
  color= 'green';
  // offset_well_2(degLat2, degLon2, 800 , 0, color); //0,400
  offset_well_3(degLat2, degLon2, 0 , 400, color);
  offset_well_3(degLat2, degLon2, 200 , 400, color);
  offset_well_3(degLat2, degLon2, -200 , 400, color);
  offset_well_3(degLat2, degLon2, 100 , 300, color);
  offset_well_3(degLat2, degLon2, -100 , 300, color);
  offset_well_3(degLat2, degLon2, 300 , 300, color);
  offset_well_3(degLat2, degLon2, -300 , 300, color);
  offset_well_3(degLat2, degLon2, 400 , 400, color);
  offset_well_3(degLat2, degLon2, -400 , 400, color);
  offset_well_3(degLat2, degLon2, 0 , 200, color);
  offset_well_3(degLat2, degLon2, 0 , 0, color);
  offset_well_3(degLat2, degLon2, 100 , -100, color);
  offset_well_3(degLat2, degLon2, -100 , -100, color);


  // Naranjas:
  color = 'orange'
  // offset_well_3(degLat2, degLon2, 200 , 400, color);
  offset_well_3(degLat2, degLon2, 100 , 100, color);
  offset_well_3(degLat2, degLon2, -100 , 100, color);


  // Rojos:
  color = 'red'
  offset_well_3(degLat2, degLon2, 200 , 200, color);
  offset_well_3(degLat2, degLon2, -200 , 200, color);
  offset_well_3(degLat2, degLon2, 400 , 200, color);
  offset_well_3(degLat2, degLon2, -400 , 200, color);
  offset_well_3(degLat2, degLon2, 300 , 100, color);
  offset_well_3(degLat2, degLon2, -300 , 100, color);
  offset_well_3(degLat2, degLon2, 200 , 0, color);
  offset_well_3(degLat2, degLon2, -200 , 0, color);
  offset_well_3(degLat2, degLon2, 400 , 0, color);
  offset_well_3(degLat2, degLon2, -400 , 0, color);
  offset_well_3(degLat2, degLon2, 300 , -100, color);
  offset_well_3(degLat2, degLon2, -300 , -100, color);
  offset_well_3(degLat2, degLon2, 0 , -200, color);
  offset_well_3(degLat2, degLon2, 200 , -200, color);
  offset_well_3(degLat2, degLon2, -200 , -200, color);
  offset_well_3(degLat2, degLon2, 400 , -200, color);
  offset_well_3(degLat2, degLon2, -400 , -200, color);
  offset_well_3(degLat2, degLon2, 100 , -300, color);
  offset_well_3(degLat2, degLon2, -100 , -300, color);
  offset_well_3(degLat2, degLon2, 300 , -300, color);
  offset_well_3(degLat2, degLon2, -300 , -300, color);
  offset_well_3(degLat2, degLon2, 0 , -400, color);
  offset_well_3(degLat2, degLon2, 200 , -400, color);
  offset_well_3(degLat2, degLon2, -200 , -400, color);
  offset_well_3(degLat2, degLon2, 400 , -400, color);
  offset_well_3(degLat2, degLon2, -400 , -400, color);


  map.flyTo([heelLatitude,heelLongitude],15);




  // map.flyTo([heelLatitude,heelLongitude],15);
})


function onMapClick(e) {
  document.getElementById('alertText').innerText = "Coordinates: " + e.latlng
  document.getElementById('alertClick').hidden=false
}
map.on('click', onMapClick);

