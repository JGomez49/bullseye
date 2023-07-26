
// Calgary: 51.038372 , -114.059702

let latitudeHome = 56
let longitudeHome = -114
let zoom = 5
let map = L.map('map').setView([latitudeHome,longitudeHome],zoom)




//Agregar tilelAyer mapa base desde openstreetmap:
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



document.getElementById('btnShow').addEventListener('click',function(){
  let rigLatitude = Number(document.getElementById('rigLat').value)
  let rigLongitude = Number(document.getElementById('rigLon').value)
  if(rigLatitude == 0 && rigLongitude == 0){
    rigLatitude = 56.005;
    document.getElementById('rigLat').value = 56.005;
    rigLongitude = -114.002;
    document.getElementById('rigLon').value = -114.002;
  }
  let rigIcon = L.icon({
    iconUrl: 'https://res.cloudinary.com/metacortexjohn/image/upload/v1682359935/rig01_vgeizw.png',
    iconSize: [15, 25],
  });
  L.marker([rigLatitude, rigLongitude], {icon: rigIcon}).addTo(map);
});



document.getElementById('btnBuscar').addEventListener('click',function(){

  let heelLatitude = Number(document.getElementById('heelLat').value)
  let heelLongitude = Number(document.getElementById('heelLon').value)
  let toeLatitude = Number(document.getElementById('toeLat').value)
  let toeLongitude = Number(document.getElementById('toeLon').value)

  if(heelLatitude == 0 && heelLongitude == 0 && toeLatitude == 0 && toeLongitude == 0){
    heelLatitude = 56;
    document.getElementById('heelLat').value = 56;
    heelLongitude = -114;
    document.getElementById('heelLon').value = -114;
    toeLatitude = 55.99;
    document.getElementById('toeLat').value = 55.99;
    toeLongitude = -114;
    document.getElementById('toeLon').value = -114;
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



  let heelIcon = L.icon({
    iconUrl: 'https://res.cloudinary.com/metacortexjohn/image/upload/v1690300661/position_ikv9ce.png',
    iconSize: [20, 20],
  });
  L.marker([heelLatitude, heelLongitude], {icon: heelIcon}).addTo(map);

  let toeIcon = L.icon({
    iconUrl: 'https://res.cloudinary.com/metacortexjohn/image/upload/v1690300661/position_ikv9ce.png',
    iconSize: [20, 20],
  });
  L.marker([toeLatitude, toeLongitude], {icon: toeIcon}).addTo(map);

  let well_trajectory = L.polygon([
    [heelLatitude, heelLongitude],
    [toeLatitude, toeLongitude]
  ]).addTo(map);




  // let rigIcon = L.icon({
  //   iconUrl: 'https://res.cloudinary.com/metacortexjohn/image/upload/v1682359935/rig01_vgeizw.png',
  //   iconSize: [15, 25],
  // });
  // L.marker([heelLatitude, heelLongitude], {icon: rigIcon}).addTo(map);

  // let line1 = L.polygon([
  //   [heelLatitude, heelLongitude],
  //   [toeLatitude, toeLongitude]
  // ]).addTo(map);

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
  // console.log("degNBearing: " + degNBearing)


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
    // console.log("Offset Bearing: " + Bearing);
    // console.log("Offset Distance: " + d);
    // console.log("Offset lat: " + degLat2);
    // console.log("Offset lon: " + degLon2);
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
    // console.log("offset 3 lat2: " + lat2);
    // console.log("offset 3 lon2: " + lon2);    
    let d = getDistance(lat1, lon1, lat2, lon2);
    let Bearing = getBearing(lat1, lon1, lat2, lon2);
    d = d/1000
    // console.log("offset 3 distance: " + d + "km");
    // console.log("offset 3 bearing: " + Bearing + "deg Az."); 
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
      fillOpacity: 1,
      radius: 10
    })
    // .addTo(map);

    if(x == 0 && y == 400){
      let circuloRojo = L.circle([degLat2, degLon2], {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.2,
        radius: 490,
        stroke: false,
      }).addTo(map);   
    
      let circuloNaranja = L.circle([degLat2, degLon2], {
        color: 'orange',
        fillColor: 'orange',
        fillOpacity: 0.3,
        radius: 390,
        stroke: false,
      }).addTo(map);    
    
      let circuloVerde = L.circle([degLat2, degLon2], {
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.5,
        radius: 300,
        stroke: false,
      }).addTo(map);
    }   
    return ([degLat2, degLon2])
  }


  let color = 'black'

  // Cabezal de referencia:
  let latNlon2 = offset_well(0 , degNBearing, color); //-400,0
  let degLat2 = latNlon2[0]
  let degLon2 = latNlon2[1]




  // Verdes:--------------------------------------------
  color= 'green';
  
    // offset_well_3(degLat2, degLon2, 375 , 60, color);
    // offset_well_3(degLat2, degLon2, 375 , -150, color);
    // offset_well_3(degLat2, degLon2, -375 , 60, color);
    // offset_well_3(degLat2, degLon2, -375 , -150, color);

    let NW_lat = offset_well_3(degLat2, degLon2, -375 , 60, color)[0];
    let NW_lon = offset_well_3(degLat2, degLon2, -375 , 60, color)[1];

    let NE_lat = offset_well_3(degLat2, degLon2, 375 , 60, color)[0];
    let NE_lon = offset_well_3(degLat2, degLon2, 375 , 60, color)[1];

    let SE_lat = offset_well_3(degLat2, degLon2, 375 , -150, color)[0];
    let SE_lon = offset_well_3(degLat2, degLon2, 375 , -150, color)[1];

    let SW_lat = offset_well_3(degLat2, degLon2, -375 , -150, color)[0];
    let SW_lon = offset_well_3(degLat2, degLon2, -375 , -150, color)[1];

    L.polygon([
      [NW_lat, NW_lon],
      [NE_lat, NE_lon],
      [SE_lat, SE_lon],
      [SW_lat, SW_lon]
  ], {
    color: color,
    fillColor: color,
    fillOpacity: 0.7,
  }).addTo(map);

    

  //======================================================
  


  // Naranjas:--------------------------------------------
  color = 'orange'

  // offset_well_3(degLat2, degLon2, 610 , 190, color);
  // offset_well_3(degLat2, degLon2, 610 , -270, color);
  // offset_well_3(degLat2, degLon2, -610 , 190, color);
  // offset_well_3(degLat2, degLon2, -610 , -270, color);

  NW_lat = offset_well_3(degLat2, degLon2, 610 , -270, color)[0];
  NW_lon = offset_well_3(degLat2, degLon2, 610 , -270, color)[1];

  NE_lat = offset_well_3(degLat2, degLon2, 610 , 190, color)[0];
  NE_lon = offset_well_3(degLat2, degLon2, 610 , 190, color)[1];

  SE_lat = offset_well_3(degLat2, degLon2, -610 , 190, color)[0];
  SE_lon = offset_well_3(degLat2, degLon2, -610 , 190, color)[1];

  SW_lat = offset_well_3(degLat2, degLon2, -610 , -270, color)[0];
  SW_lon = offset_well_3(degLat2, degLon2, -610 , -270, color)[1];

  L.polygon([
      [NW_lat, NW_lon],
      [NE_lat, NE_lon],
      [SE_lat, SE_lon],
      [SW_lat, SW_lon]
  ], {
    color: color,
    fillColor: color,
    fillOpacity: 0.3,
  }).addTo(map);


  //=======================================================



  // Rojos:-----------------------------------------------
  color = 'red'

  // offset_well_3(degLat2, degLon2, 700 , 400, color);
  // offset_well_3(degLat2, degLon2, 700 , -400, color);
  // offset_well_3(degLat2, degLon2, -700 , 400, color);
  // offset_well_3(degLat2, degLon2, -700 , -400, color);

  NW_lat = offset_well_3(degLat2, degLon2, 700 , -400, color)[0];
  NW_lon = offset_well_3(degLat2, degLon2, 700 , -400, color)[1];

  NE_lat = offset_well_3(degLat2, degLon2, 700 , 400, color)[0];
  NE_lon = offset_well_3(degLat2, degLon2, 700 , 400, color)[1];

  SE_lat = offset_well_3(degLat2, degLon2, -700 , 400, color)[0];
  SE_lon = offset_well_3(degLat2, degLon2, -700 , 400, color)[1];

  SW_lat = offset_well_3(degLat2, degLon2, -700 , -400, color)[0];
  SW_lon = offset_well_3(degLat2, degLon2, -700 , -400, color)[1];

  L.polygon([
    [NW_lat, NW_lon],
    [NE_lat, NE_lon],
    [SE_lat, SE_lon],
    [SW_lat, SW_lon]
  ], {
    color: color,
    fillColor: color,
    fillOpacity: 0.1,
  }).addTo(map);

  //=======================================================


  map.flyTo([heelLatitude,heelLongitude],15);
})


function onMapClick(e) {
  document.getElementById('alertText').innerText = "Coordinates: " + e.latlng
  document.getElementById('alertClick').hidden=false
}
map.on('click', onMapClick);