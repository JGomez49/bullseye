
// Calgary: 51.038372 , -114.059702

let latitudeHome = 56
let longitudeHome = -114
// let zoom = 5
let zoom = 12
let map = L.map('map').setView([latitudeHome,longitudeHome],zoom)




//Agregar tilelAyer mapa base desde openstreetmap:
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// https://res.cloudinary.com/metacortexjohn/image/upload/v1707881405/Vermilion_logo_gsyosy.png



// document.getElementById('btnShow').addEventListener('click',function(){
//   let rigLatitude = Number(document.getElementById('rigLat').value)
//   let rigLongitude = Number(document.getElementById('rigLon').value)
//   if(rigLatitude == 0 && rigLongitude == 0){
//     rigLatitude = 56.005;
//     document.getElementById('rigLat').value = 56.005;
//     rigLongitude = -114.002;
//     document.getElementById('rigLon').value = -114.002;
//   }
//   let rigIcon = L.icon({
//     iconUrl: 'https://res.cloudinary.com/metacortexjohn/image/upload/v1682359935/rig01_vgeizw.png',
//     iconSize: [20, 30],
//   });
//   L.marker([rigLatitude, rigLongitude], {icon: rigIcon}).addTo(map);
// });


var rigs = new Array();
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
    iconSize: [20, 30],
  });
  if(rigs.length > 0){
    let rigToRemove = document.getElementsByClassName('leaflet-marker-icon')[2]
    rigToRemove.remove();
    item = [{"lat": rigLatitude, "lon": rigLongitude}];
    rigs.push(item);
    msg="Lat:" + rigLatitude + ", Lon: " + rigLongitude
    marcador = L.marker([rigLatitude, rigLongitude], {icon: rigIcon, clickable: true}).bindPopup(msg); 
    map.addLayer(marcador);
  }
  if(rigs.length == 0){
    item = [{"lat": rigLatitude, "lon": rigLongitude}];
    rigs.push(item);
    msg="Lat:" + rigLatitude + ", Lon: " + rigLongitude
    marcador = L.marker([rigLatitude, rigLongitude], {icon: rigIcon, clickable: true}).bindPopup(msg); 
    map.addLayer(marcador);
  }
});



document.getElementById('btnBuscar').addEventListener('click',function(){
  document.getElementById('btnBuscar').hidden = true;
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
      })
      // .addTo(map);   
    
      let circuloNaranja = L.circle([degLat2, degLon2], {
        color: 'orange',
        fillColor: 'orange',
        fillOpacity: 0.3,
        radius: 390,
        stroke: false,
      })
      // .addTo(map);    
    
      let circuloVerde = L.circle([degLat2, degLon2], {
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.5,
        radius: 300,
        stroke: false,
      })
      // .addTo(map);
    }   
    return ([degLat2, degLon2])
  }


  let color = 'black'
  // Cabezal de referencia:
  let latNlon2 = offset_well(0 , degNBearing, color); //-400,0
  let degLat2 = latNlon2[0]
  let degLon2 = latNlon2[1]








  
  // Rojos:-----------------------------------------------
  color = 'red'

  var NW_lat = offset_well_3(degLat2, degLon2, 700 , -400, color)[0];
  var NW_lon = offset_well_3(degLat2, degLon2, 700 , -400, color)[1];

  var NE_lat = offset_well_3(degLat2, degLon2, 700 , 400, color)[0];
  var NE_lon = offset_well_3(degLat2, degLon2, 700 , 400, color)[1];

  var SE_lat = offset_well_3(degLat2, degLon2, -700 , 400, color)[0];
  var SE_lon = offset_well_3(degLat2, degLon2, -700 , 400, color)[1];

  var SW_lat = offset_well_3(degLat2, degLon2, -700 , -400, color)[0];
  var SW_lon = offset_well_3(degLat2, degLon2, -700 , -400, color)[1];

  L.polygon([
    [NW_lat, NW_lon],
    [NE_lat, NE_lon],
    [SE_lat, SE_lon],
    [SW_lat, SW_lon]
  ], {
    color: color,
    fillColor: color,
    fillOpacity: 0.5,
  }).addTo(map);
  //=======================================================

  






  // Naranjas:--------------------------------------------
  color = 'orange'
  color = 'yellow'

    P1_lat = offset_well_3(degLat2, degLon2, 0 , 200, color)[0];	 P1_lon = offset_well_3(degLat2, degLon2, 0 , 200, color)[1];
    P2_lat = offset_well_3(degLat2, degLon2, 10 , 197, color)[0];	 P2_lon = offset_well_3(degLat2, degLon2, 10 , 197, color)[1];
    P3_lat = offset_well_3(degLat2, degLon2, 20 , 194, color)[0];	 P3_lon = offset_well_3(degLat2, degLon2, 20 , 194, color)[1];
    P4_lat = offset_well_3(degLat2, degLon2, 25 , 190, color)[0];	 P4_lon = offset_well_3(degLat2, degLon2, 25 , 190, color)[1];
    P5_lat = offset_well_3(degLat2, degLon2, 30 , 185, color)[0];	 P5_lon = offset_well_3(degLat2, degLon2, 30 , 185, color)[1];
    P6_lat = offset_well_3(degLat2, degLon2, 40 , 173, color)[0];	 P6_lon = offset_well_3(degLat2, degLon2, 40 , 173, color)[1];
    P7_lat = offset_well_3(degLat2, degLon2, 50 , 160, color)[0];	 P7_lon = offset_well_3(degLat2, degLon2, 50 , 160, color)[1];
    P8_lat = offset_well_3(degLat2, degLon2, 60 , 145, color)[0];	 P8_lon = offset_well_3(degLat2, degLon2, 60 , 145, color)[1];
    P9_lat = offset_well_3(degLat2, degLon2, 70 , 130, color)[0];	 P9_lon = offset_well_3(degLat2, degLon2, 70 , 130, color)[1];
    P10_lat = offset_well_3(degLat2, degLon2, 80 , 114, color)[0];	 P10_lon = offset_well_3(degLat2, degLon2, 80 , 114, color)[1];
    P11_lat = offset_well_3(degLat2, degLon2, 90 , 105, color)[0];	 P11_lon = offset_well_3(degLat2, degLon2, 90 , 105, color)[1];
    P12_lat = offset_well_3(degLat2, degLon2, 100 , 100, color)[0];	 P12_lon = offset_well_3(degLat2, degLon2, 100 , 100, color)[1];
    P13_lat = offset_well_3(degLat2, degLon2, 110 , 97, color)[0];	 P13_lon = offset_well_3(degLat2, degLon2, 110 , 97, color)[1];
    P14_lat = offset_well_3(degLat2, degLon2, 120 , 96, color)[0];	 P14_lon = offset_well_3(degLat2, degLon2, 120 , 96, color)[1];
    P15_lat = offset_well_3(degLat2, degLon2, 130 , 96, color)[0];	 P15_lon = offset_well_3(degLat2, degLon2, 130 , 96, color)[1];
    P16_lat = offset_well_3(degLat2, degLon2, 140 , 96, color)[0];	 P16_lon = offset_well_3(degLat2, degLon2, 140 , 96, color)[1];
    P17_lat = offset_well_3(degLat2, degLon2, 150 , 96, color)[0];	 P17_lon = offset_well_3(degLat2, degLon2, 150 , 96, color)[1];
    P18_lat = offset_well_3(degLat2, degLon2, 160 , 97, color)[0];	 P18_lon = offset_well_3(degLat2, degLon2, 160 , 97, color)[1];
    P19_lat = offset_well_3(degLat2, degLon2, 170 , 98, color)[0];	 P19_lon = offset_well_3(degLat2, degLon2, 170 , 98, color)[1];
    P20_lat = offset_well_3(degLat2, degLon2, 180 , 99, color)[0];	 P20_lon = offset_well_3(degLat2, degLon2, 180 , 99, color)[1];
    P21_lat = offset_well_3(degLat2, degLon2, 190 , 99, color)[0];	 P21_lon = offset_well_3(degLat2, degLon2, 190 , 99, color)[1];
    P22_lat = offset_well_3(degLat2, degLon2, 200 , 100, color)[0];	 P22_lon = offset_well_3(degLat2, degLon2, 200 , 100, color)[1];
    P23_lat = offset_well_3(degLat2, degLon2, 210 , 99, color)[0];	 P23_lon = offset_well_3(degLat2, degLon2, 210 , 99, color)[1];
    P24_lat = offset_well_3(degLat2, degLon2, 220 , 98, color)[0];	 P24_lon = offset_well_3(degLat2, degLon2, 220 , 98, color)[1];
    P25_lat = offset_well_3(degLat2, degLon2, 230 , 96, color)[0];	 P25_lon = offset_well_3(degLat2, degLon2, 230 , 96, color)[1];
    P26_lat = offset_well_3(degLat2, degLon2, 240 , 94, color)[0];	 P26_lon = offset_well_3(degLat2, degLon2, 240 , 94, color)[1];
    P27_lat = offset_well_3(degLat2, degLon2, 250 , 94, color)[0];	 P27_lon = offset_well_3(degLat2, degLon2, 250 , 94, color)[1];
    P28_lat = offset_well_3(degLat2, degLon2, 260 , 93, color)[0];	 P28_lon = offset_well_3(degLat2, degLon2, 260 , 93, color)[1];
    P29_lat = offset_well_3(degLat2, degLon2, 270 , 93, color)[0];	 P29_lon = offset_well_3(degLat2, degLon2, 270 , 93, color)[1];
    P30_lat = offset_well_3(degLat2, degLon2, 280 , 94, color)[0];	 P30_lon = offset_well_3(degLat2, degLon2, 280 , 94, color)[1];
    P31_lat = offset_well_3(degLat2, degLon2, 290 , 96, color)[0];	 P31_lon = offset_well_3(degLat2, degLon2, 290 , 96, color)[1];
    P32_lat = offset_well_3(degLat2, degLon2, 300 , 100, color)[0];	 P32_lon = offset_well_3(degLat2, degLon2, 300 , 100, color)[1];
    P33_lat = offset_well_3(degLat2, degLon2, 310 , 107, color)[0];	 P33_lon = offset_well_3(degLat2, degLon2, 310 , 107, color)[1];
    P34_lat = offset_well_3(degLat2, degLon2, 320 , 115, color)[0];	 P34_lon = offset_well_3(degLat2, degLon2, 320 , 115, color)[1];
    P35_lat = offset_well_3(degLat2, degLon2, 330 , 125, color)[0];	 P35_lon = offset_well_3(degLat2, degLon2, 330 , 125, color)[1];
    P36_lat = offset_well_3(degLat2, degLon2, 340 , 138, color)[0];	 P36_lon = offset_well_3(degLat2, degLon2, 340 , 138, color)[1];
    P37_lat = offset_well_3(degLat2, degLon2, 350 , 150, color)[0];	 P37_lon = offset_well_3(degLat2, degLon2, 350 , 150, color)[1];
    P38_lat = offset_well_3(degLat2, degLon2, 360 , 163, color)[0];	 P38_lon = offset_well_3(degLat2, degLon2, 360 , 163, color)[1];
    P39_lat = offset_well_3(degLat2, degLon2, 370 , 175, color)[0];	 P39_lon = offset_well_3(degLat2, degLon2, 370 , 175, color)[1];
    P40_lat = offset_well_3(degLat2, degLon2, 380 , 185, color)[0];	 P40_lon = offset_well_3(degLat2, degLon2, 380 , 185, color)[1];
    P41_lat = offset_well_3(degLat2, degLon2, 390 , 194, color)[0];	 P41_lon = offset_well_3(degLat2, degLon2, 390 , 194, color)[1];
    P42_lat = offset_well_3(degLat2, degLon2, 400 , 200, color)[0];	 P42_lon = offset_well_3(degLat2, degLon2, 400 , 200, color)[1];
    P43_lat = offset_well_3(degLat2, degLon2, 410 , 205, color)[0];	 P43_lon = offset_well_3(degLat2, degLon2, 410 , 205, color)[1];
    P44_lat = offset_well_3(degLat2, degLon2, 420 , 207, color)[0];	 P44_lon = offset_well_3(degLat2, degLon2, 420 , 207, color)[1];
    P45_lat = offset_well_3(degLat2, degLon2, 430 , 207, color)[0];	 P45_lon = offset_well_3(degLat2, degLon2, 430 , 207, color)[1];
    P46_lat = offset_well_3(degLat2, degLon2, 440 , 207, color)[0];	 P46_lon = offset_well_3(degLat2, degLon2, 440 , 207, color)[1];
    P47_lat = offset_well_3(degLat2, degLon2, 450 , 207, color)[0];	 P47_lon = offset_well_3(degLat2, degLon2, 450 , 207, color)[1];
    P48_lat = offset_well_3(degLat2, degLon2, 460 , 206, color)[0];	 P48_lon = offset_well_3(degLat2, degLon2, 460 , 206, color)[1];
    P49_lat = offset_well_3(degLat2, degLon2, 470 , 204, color)[0];	 P49_lon = offset_well_3(degLat2, degLon2, 470 , 204, color)[1];
    P50_lat = offset_well_3(degLat2, degLon2, 480 , 202, color)[0];	 P50_lon = offset_well_3(degLat2, degLon2, 480 , 202, color)[1];
    P51_lat = offset_well_3(degLat2, degLon2, 490 , 201, color)[0];	 P51_lon = offset_well_3(degLat2, degLon2, 490 , 201, color)[1];
    P52_lat = offset_well_3(degLat2, degLon2, 500 , 200, color)[0];	 P52_lon = offset_well_3(degLat2, degLon2, 500 , 200, color)[1];
    P53_lat = offset_well_3(degLat2, degLon2, 510 , 200, color)[0];	 P53_lon = offset_well_3(degLat2, degLon2, 510 , 200, color)[1];
    P54_lat = offset_well_3(degLat2, degLon2, 520 , 200, color)[0];	 P54_lon = offset_well_3(degLat2, degLon2, 520 , 200, color)[1];
    P55_lat = offset_well_3(degLat2, degLon2, 530 , 200, color)[0];	 P55_lon = offset_well_3(degLat2, degLon2, 530 , 200, color)[1];
    P56_lat = offset_well_3(degLat2, degLon2, 540 , 200, color)[0];	 P56_lon = offset_well_3(degLat2, degLon2, 540 , 200, color)[1];
    P57_lat = offset_well_3(degLat2, degLon2, 550 , 200, color)[0];	 P57_lon = offset_well_3(degLat2, degLon2, 550 , 200, color)[1];
    P58_lat = offset_well_3(degLat2, degLon2, 560 , 200, color)[0];	 P58_lon = offset_well_3(degLat2, degLon2, 560 , 200, color)[1];
    P59_lat = offset_well_3(degLat2, degLon2, 570 , 200, color)[0];	 P59_lon = offset_well_3(degLat2, degLon2, 570 , 200, color)[1];
    P60_lat = offset_well_3(degLat2, degLon2, 580 , 199, color)[0];	 P60_lon = offset_well_3(degLat2, degLon2, 580 , 199, color)[1];
    P61_lat = offset_well_3(degLat2, degLon2, 590 , 197, color)[0];	 P61_lon = offset_well_3(degLat2, degLon2, 590 , 197, color)[1];
    P62_lat = offset_well_3(degLat2, degLon2, 600 , 195, color)[0];	 P62_lon = offset_well_3(degLat2, degLon2, 600 , 195, color)[1];
    P63_lat = offset_well_3(degLat2, degLon2, 610 , 190, color)[0];	 P63_lon = offset_well_3(degLat2, degLon2, 610 , 190, color)[1];
    P64_lat = offset_well_3(degLat2, degLon2, 613 , 185, color)[0];	 P64_lon = offset_well_3(degLat2, degLon2, 613 , 185, color)[1];
    P65_lat = offset_well_3(degLat2, degLon2, 615 , 180, color)[0];	 P65_lon = offset_well_3(degLat2, degLon2, 615 , 180, color)[1];
    P66_lat = offset_well_3(degLat2, degLon2, 616 , 175, color)[0];	 P66_lon = offset_well_3(degLat2, degLon2, 616 , 175, color)[1];
    P67_lat = offset_well_3(degLat2, degLon2, 616 , 170, color)[0];	 P67_lon = offset_well_3(degLat2, degLon2, 616 , 170, color)[1];
    P68_lat = offset_well_3(degLat2, degLon2, 615 , 165, color)[0];	 P68_lon = offset_well_3(degLat2, degLon2, 615 , 165, color)[1];
    P69_lat = offset_well_3(degLat2, degLon2, 614 , 160, color)[0];	 P69_lon = offset_well_3(degLat2, degLon2, 614 , 160, color)[1];
    P70_lat = offset_well_3(degLat2, degLon2, 613 , 155, color)[0];	 P70_lon = offset_well_3(degLat2, degLon2, 613 , 155, color)[1];
    P71_lat = offset_well_3(degLat2, degLon2, 611 , 150, color)[0];	 P71_lon = offset_well_3(degLat2, degLon2, 611 , 150, color)[1];
    P72_lat = offset_well_3(degLat2, degLon2, 609 , 145, color)[0];	 P72_lon = offset_well_3(degLat2, degLon2, 609 , 145, color)[1];
    P73_lat = offset_well_3(degLat2, degLon2, 608 , 140, color)[0];	 P73_lon = offset_well_3(degLat2, degLon2, 608 , 140, color)[1];
    P74_lat = offset_well_3(degLat2, degLon2, 607 , 135, color)[0];	 P74_lon = offset_well_3(degLat2, degLon2, 607 , 135, color)[1];
    P75_lat = offset_well_3(degLat2, degLon2, 605 , 130, color)[0];	 P75_lon = offset_well_3(degLat2, degLon2, 605 , 130, color)[1];
    P76_lat = offset_well_3(degLat2, degLon2, 604 , 125, color)[0];	 P76_lon = offset_well_3(degLat2, degLon2, 604 , 125, color)[1];
    P77_lat = offset_well_3(degLat2, degLon2, 602 , 120, color)[0];	 P77_lon = offset_well_3(degLat2, degLon2, 602 , 120, color)[1];
    P78_lat = offset_well_3(degLat2, degLon2, 601 , 115, color)[0];	 P78_lon = offset_well_3(degLat2, degLon2, 601 , 115, color)[1];
    P79_lat = offset_well_3(degLat2, degLon2, 600 , 110, color)[0];	 P79_lon = offset_well_3(degLat2, degLon2, 600 , 110, color)[1];
    P80_lat = offset_well_3(degLat2, degLon2, 600 , 105, color)[0];	 P80_lon = offset_well_3(degLat2, degLon2, 600 , 105, color)[1];
    P81_lat = offset_well_3(degLat2, degLon2, 601 , 100, color)[0];	 P81_lon = offset_well_3(degLat2, degLon2, 601 , 100, color)[1];
    P82_lat = offset_well_3(degLat2, degLon2, 601 , 95, color)[0];	 P82_lon = offset_well_3(degLat2, degLon2, 601 , 95, color)[1];
    P83_lat = offset_well_3(degLat2, degLon2, 602 , 90, color)[0];	 P83_lon = offset_well_3(degLat2, degLon2, 602 , 90, color)[1];
    P84_lat = offset_well_3(degLat2, degLon2, 604 , 85, color)[0];	 P84_lon = offset_well_3(degLat2, degLon2, 604 , 85, color)[1];
    P85_lat = offset_well_3(degLat2, degLon2, 606 , 80, color)[0];	 P85_lon = offset_well_3(degLat2, degLon2, 606 , 80, color)[1];
    P86_lat = offset_well_3(degLat2, degLon2, 606 , 75, color)[0];	 P86_lon = offset_well_3(degLat2, degLon2, 606 , 75, color)[1];
    P87_lat = offset_well_3(degLat2, degLon2, 605 , 70, color)[0];	 P87_lon = offset_well_3(degLat2, degLon2, 605 , 70, color)[1];
    P88_lat = offset_well_3(degLat2, degLon2, 603 , 65, color)[0];	 P88_lon = offset_well_3(degLat2, degLon2, 603 , 65, color)[1];
    P89_lat = offset_well_3(degLat2, degLon2, 598 , 60, color)[0];	 P89_lon = offset_well_3(degLat2, degLon2, 598 , 60, color)[1];
    P90_lat = offset_well_3(degLat2, degLon2, 592 , 55, color)[0];	 P90_lon = offset_well_3(degLat2, degLon2, 592 , 55, color)[1];
    P91_lat = offset_well_3(degLat2, degLon2, 587 , 50, color)[0];	 P91_lon = offset_well_3(degLat2, degLon2, 587 , 50, color)[1];
    P92_lat = offset_well_3(degLat2, degLon2, 582 , 45, color)[0];	 P92_lon = offset_well_3(degLat2, degLon2, 582 , 45, color)[1];
    P93_lat = offset_well_3(degLat2, degLon2, 580 , 40, color)[0];	 P93_lon = offset_well_3(degLat2, degLon2, 580 , 40, color)[1];
    P94_lat = offset_well_3(degLat2, degLon2, 581 , 35, color)[0];	 P94_lon = offset_well_3(degLat2, degLon2, 581 , 35, color)[1];
    P95_lat = offset_well_3(degLat2, degLon2, 582 , 30, color)[0];	 P95_lon = offset_well_3(degLat2, degLon2, 582 , 30, color)[1];
    P96_lat = offset_well_3(degLat2, degLon2, 585 , 25, color)[0];	 P96_lon = offset_well_3(degLat2, degLon2, 585 , 25, color)[1];
    P97_lat = offset_well_3(degLat2, degLon2, 587 , 20, color)[0];	 P97_lon = offset_well_3(degLat2, degLon2, 587 , 20, color)[1];
    P98_lat = offset_well_3(degLat2, degLon2, 591 , 15, color)[0];	 P98_lon = offset_well_3(degLat2, degLon2, 591 , 15, color)[1];
    P99_lat = offset_well_3(degLat2, degLon2, 594 , 10, color)[0];	 P99_lon = offset_well_3(degLat2, degLon2, 594 , 10, color)[1];
    P100_lat = offset_well_3(degLat2, degLon2, 597 , 5, color)[0];	 P100_lon = offset_well_3(degLat2, degLon2, 597 , 5, color)[1];
    P101_lat = offset_well_3(degLat2, degLon2, 600 , 0, color)[0];	 P101_lon = offset_well_3(degLat2, degLon2, 600 , 0, color)[1];
    P102_lat = offset_well_3(degLat2, degLon2, 597 , -5, color)[0];	 P102_lon = offset_well_3(degLat2, degLon2, 597 , -5, color)[1];
    P103_lat = offset_well_3(degLat2, degLon2, 594 , -10, color)[0];	 P103_lon = offset_well_3(degLat2, degLon2, 594 , -10, color)[1];
    P104_lat = offset_well_3(degLat2, degLon2, 591 , -15, color)[0];	 P104_lon = offset_well_3(degLat2, degLon2, 591 , -15, color)[1];
    P105_lat = offset_well_3(degLat2, degLon2, 587 , -20, color)[0];	 P105_lon = offset_well_3(degLat2, degLon2, 587 , -20, color)[1];
    P106_lat = offset_well_3(degLat2, degLon2, 585 , -25, color)[0];	 P106_lon = offset_well_3(degLat2, degLon2, 585 , -25, color)[1];
    P107_lat = offset_well_3(degLat2, degLon2, 582 , -30, color)[0];	 P107_lon = offset_well_3(degLat2, degLon2, 582 , -30, color)[1];
    P108_lat = offset_well_3(degLat2, degLon2, 581 , -35, color)[0];	 P108_lon = offset_well_3(degLat2, degLon2, 581 , -35, color)[1];
    P109_lat = offset_well_3(degLat2, degLon2, 580 , -40, color)[0];	 P109_lon = offset_well_3(degLat2, degLon2, 580 , -40, color)[1];
    P110_lat = offset_well_3(degLat2, degLon2, 582 , -45, color)[0];	 P110_lon = offset_well_3(degLat2, degLon2, 582 , -45, color)[1];
    P111_lat = offset_well_3(degLat2, degLon2, 587 , -50, color)[0];	 P111_lon = offset_well_3(degLat2, degLon2, 587 , -50, color)[1];
    P112_lat = offset_well_3(degLat2, degLon2, 592 , -55, color)[0];	 P112_lon = offset_well_3(degLat2, degLon2, 592 , -55, color)[1];
    P113_lat = offset_well_3(degLat2, degLon2, 598 , -60, color)[0];	 P113_lon = offset_well_3(degLat2, degLon2, 598 , -60, color)[1];
    P114_lat = offset_well_3(degLat2, degLon2, 603 , -65, color)[0];	 P114_lon = offset_well_3(degLat2, degLon2, 603 , -65, color)[1];
    P115_lat = offset_well_3(degLat2, degLon2, 605 , -70, color)[0];	 P115_lon = offset_well_3(degLat2, degLon2, 605 , -70, color)[1];
    P116_lat = offset_well_3(degLat2, degLon2, 606 , -75, color)[0];	 P116_lon = offset_well_3(degLat2, degLon2, 606 , -75, color)[1];
    P117_lat = offset_well_3(degLat2, degLon2, 606 , -80, color)[0];	 P117_lon = offset_well_3(degLat2, degLon2, 606 , -80, color)[1];
    P118_lat = offset_well_3(degLat2, degLon2, 604 , -85, color)[0];	 P118_lon = offset_well_3(degLat2, degLon2, 604 , -85, color)[1];
    P119_lat = offset_well_3(degLat2, degLon2, 602 , -90, color)[0];	 P119_lon = offset_well_3(degLat2, degLon2, 602 , -90, color)[1];
    P120_lat = offset_well_3(degLat2, degLon2, 601 , -95, color)[0];	 P120_lon = offset_well_3(degLat2, degLon2, 601 , -95, color)[1];
    P121_lat = offset_well_3(degLat2, degLon2, 601 , -100, color)[0];	 P121_lon = offset_well_3(degLat2, degLon2, 601 , -100, color)[1];
    P122_lat = offset_well_3(degLat2, degLon2, 600 , -105, color)[0];	 P122_lon = offset_well_3(degLat2, degLon2, 600 , -105, color)[1];
    P123_lat = offset_well_3(degLat2, degLon2, 600 , -110, color)[0];	 P123_lon = offset_well_3(degLat2, degLon2, 600 , -110, color)[1];
    P124_lat = offset_well_3(degLat2, degLon2, 601 , -115, color)[0];	 P124_lon = offset_well_3(degLat2, degLon2, 601 , -115, color)[1];
    P125_lat = offset_well_3(degLat2, degLon2, 602 , -120, color)[0];	 P125_lon = offset_well_3(degLat2, degLon2, 602 , -120, color)[1];
    P126_lat = offset_well_3(degLat2, degLon2, 604 , -125, color)[0];	 P126_lon = offset_well_3(degLat2, degLon2, 604 , -125, color)[1];
    P127_lat = offset_well_3(degLat2, degLon2, 605 , -130, color)[0];	 P127_lon = offset_well_3(degLat2, degLon2, 605 , -130, color)[1];
    P128_lat = offset_well_3(degLat2, degLon2, 607 , -135, color)[0];	 P128_lon = offset_well_3(degLat2, degLon2, 607 , -135, color)[1];
    P129_lat = offset_well_3(degLat2, degLon2, 608 , -140, color)[0];	 P129_lon = offset_well_3(degLat2, degLon2, 608 , -140, color)[1];
    P130_lat = offset_well_3(degLat2, degLon2, 609 , -145, color)[0];	 P130_lon = offset_well_3(degLat2, degLon2, 609 , -145, color)[1];
    P131_lat = offset_well_3(degLat2, degLon2, 611 , -150, color)[0];	 P131_lon = offset_well_3(degLat2, degLon2, 611 , -150, color)[1];
    P132_lat = offset_well_3(degLat2, degLon2, 613 , -155, color)[0];	 P132_lon = offset_well_3(degLat2, degLon2, 613 , -155, color)[1];
    P133_lat = offset_well_3(degLat2, degLon2, 614 , -160, color)[0];	 P133_lon = offset_well_3(degLat2, degLon2, 614 , -160, color)[1];
    P134_lat = offset_well_3(degLat2, degLon2, 615 , -165, color)[0];	 P134_lon = offset_well_3(degLat2, degLon2, 615 , -165, color)[1];
    P135_lat = offset_well_3(degLat2, degLon2, 616 , -170, color)[0];	 P135_lon = offset_well_3(degLat2, degLon2, 616 , -170, color)[1];
    P136_lat = offset_well_3(degLat2, degLon2, 616 , -175, color)[0];	 P136_lon = offset_well_3(degLat2, degLon2, 616 , -175, color)[1];
    P137_lat = offset_well_3(degLat2, degLon2, 615 , -180, color)[0];	 P137_lon = offset_well_3(degLat2, degLon2, 615 , -180, color)[1];
    P138_lat = offset_well_3(degLat2, degLon2, 613 , -185, color)[0];	 P138_lon = offset_well_3(degLat2, degLon2, 613 , -185, color)[1];
    P139_lat = offset_well_3(degLat2, degLon2, 610 , -190, color)[0];	 P139_lon = offset_well_3(degLat2, degLon2, 610 , -190, color)[1];
    P140_lat = offset_well_3(degLat2, degLon2, 600 , -195, color)[0];	 P140_lon = offset_well_3(degLat2, degLon2, 600 , -195, color)[1];
    P141_lat = offset_well_3(degLat2, degLon2, 590 , -197, color)[0];	 P141_lon = offset_well_3(degLat2, degLon2, 590 , -197, color)[1];
    P142_lat = offset_well_3(degLat2, degLon2, 580 , -199, color)[0];	 P142_lon = offset_well_3(degLat2, degLon2, 580 , -199, color)[1];
    P143_lat = offset_well_3(degLat2, degLon2, 570 , -200, color)[0];	 P143_lon = offset_well_3(degLat2, degLon2, 570 , -200, color)[1];
    P144_lat = offset_well_3(degLat2, degLon2, 560 , -200, color)[0];	 P144_lon = offset_well_3(degLat2, degLon2, 560 , -200, color)[1];
    P145_lat = offset_well_3(degLat2, degLon2, 550 , -200, color)[0];	 P145_lon = offset_well_3(degLat2, degLon2, 550 , -200, color)[1];
    P146_lat = offset_well_3(degLat2, degLon2, 540 , -200, color)[0];	 P146_lon = offset_well_3(degLat2, degLon2, 540 , -200, color)[1];
    P147_lat = offset_well_3(degLat2, degLon2, 530 , -200, color)[0];	 P147_lon = offset_well_3(degLat2, degLon2, 530 , -200, color)[1];
    P148_lat = offset_well_3(degLat2, degLon2, 520 , -200, color)[0];	 P148_lon = offset_well_3(degLat2, degLon2, 520 , -200, color)[1];
    P149_lat = offset_well_3(degLat2, degLon2, 510 , -200, color)[0];	 P149_lon = offset_well_3(degLat2, degLon2, 510 , -200, color)[1];
    P150_lat = offset_well_3(degLat2, degLon2, 0 , -200, color)[0];	 P150_lon = offset_well_3(degLat2, degLon2, 0 , -200, color)[1];
    P151_lat = offset_well_3(degLat2, degLon2, 0 , -200, color)[0];	 P151_lon = offset_well_3(degLat2, degLon2, 0 , -200, color)[1];
    P152_lat = offset_well_3(degLat2, degLon2, -510 , -200, color)[0];	 P152_lon = offset_well_3(degLat2, degLon2, -510 , -200, color)[1];
    P153_lat = offset_well_3(degLat2, degLon2, -520 , -200, color)[0];	 P153_lon = offset_well_3(degLat2, degLon2, -520 , -200, color)[1];
    P154_lat = offset_well_3(degLat2, degLon2, -530 , -200, color)[0];	 P154_lon = offset_well_3(degLat2, degLon2, -530 , -200, color)[1];
    P155_lat = offset_well_3(degLat2, degLon2, -540 , -200, color)[0];	 P155_lon = offset_well_3(degLat2, degLon2, -540 , -200, color)[1];
    P156_lat = offset_well_3(degLat2, degLon2, -550 , -200, color)[0];	 P156_lon = offset_well_3(degLat2, degLon2, -550 , -200, color)[1];
    P157_lat = offset_well_3(degLat2, degLon2, -560 , -200, color)[0];	 P157_lon = offset_well_3(degLat2, degLon2, -560 , -200, color)[1];
    P158_lat = offset_well_3(degLat2, degLon2, -570 , -200, color)[0];	 P158_lon = offset_well_3(degLat2, degLon2, -570 , -200, color)[1];
    P159_lat = offset_well_3(degLat2, degLon2, -580 , -199, color)[0];	 P159_lon = offset_well_3(degLat2, degLon2, -580 , -199, color)[1];
    P160_lat = offset_well_3(degLat2, degLon2, -590 , -197, color)[0];	 P160_lon = offset_well_3(degLat2, degLon2, -590 , -197, color)[1];
    P161_lat = offset_well_3(degLat2, degLon2, -600 , -195, color)[0];	 P161_lon = offset_well_3(degLat2, degLon2, -600 , -195, color)[1];
    P162_lat = offset_well_3(degLat2, degLon2, -610 , -190, color)[0];	 P162_lon = offset_well_3(degLat2, degLon2, -610 , -190, color)[1];
    P163_lat = offset_well_3(degLat2, degLon2, -613 , -185, color)[0];	 P163_lon = offset_well_3(degLat2, degLon2, -613 , -185, color)[1];
    P164_lat = offset_well_3(degLat2, degLon2, -615 , -180, color)[0];	 P164_lon = offset_well_3(degLat2, degLon2, -615 , -180, color)[1];
    P165_lat = offset_well_3(degLat2, degLon2, -616 , -175, color)[0];	 P165_lon = offset_well_3(degLat2, degLon2, -616 , -175, color)[1];
    P166_lat = offset_well_3(degLat2, degLon2, -616 , -170, color)[0];	 P166_lon = offset_well_3(degLat2, degLon2, -616 , -170, color)[1];
    P167_lat = offset_well_3(degLat2, degLon2, -615 , -165, color)[0];	 P167_lon = offset_well_3(degLat2, degLon2, -615 , -165, color)[1];
    P168_lat = offset_well_3(degLat2, degLon2, -614 , -160, color)[0];	 P168_lon = offset_well_3(degLat2, degLon2, -614 , -160, color)[1];
    P169_lat = offset_well_3(degLat2, degLon2, -613 , -155, color)[0];	 P169_lon = offset_well_3(degLat2, degLon2, -613 , -155, color)[1];
    P170_lat = offset_well_3(degLat2, degLon2, -611 , -150, color)[0];	 P170_lon = offset_well_3(degLat2, degLon2, -611 , -150, color)[1];
    P171_lat = offset_well_3(degLat2, degLon2, -609 , -145, color)[0];	 P171_lon = offset_well_3(degLat2, degLon2, -609 , -145, color)[1];
    P172_lat = offset_well_3(degLat2, degLon2, -608 , -140, color)[0];	 P172_lon = offset_well_3(degLat2, degLon2, -608 , -140, color)[1];
    P173_lat = offset_well_3(degLat2, degLon2, -607 , -135, color)[0];	 P173_lon = offset_well_3(degLat2, degLon2, -607 , -135, color)[1];
    P174_lat = offset_well_3(degLat2, degLon2, -605 , -130, color)[0];	 P174_lon = offset_well_3(degLat2, degLon2, -605 , -130, color)[1];
    P175_lat = offset_well_3(degLat2, degLon2, -604 , -125, color)[0];	 P175_lon = offset_well_3(degLat2, degLon2, -604 , -125, color)[1];
    P176_lat = offset_well_3(degLat2, degLon2, -602 , -120, color)[0];	 P176_lon = offset_well_3(degLat2, degLon2, -602 , -120, color)[1];
    P177_lat = offset_well_3(degLat2, degLon2, -601 , -115, color)[0];	 P177_lon = offset_well_3(degLat2, degLon2, -601 , -115, color)[1];
    P178_lat = offset_well_3(degLat2, degLon2, -600 , -110, color)[0];	 P178_lon = offset_well_3(degLat2, degLon2, -600 , -110, color)[1];
    P179_lat = offset_well_3(degLat2, degLon2, -600 , -105, color)[0];	 P179_lon = offset_well_3(degLat2, degLon2, -600 , -105, color)[1];
    P180_lat = offset_well_3(degLat2, degLon2, -601 , -100, color)[0];	 P180_lon = offset_well_3(degLat2, degLon2, -601 , -100, color)[1];
    P181_lat = offset_well_3(degLat2, degLon2, -601 , -95, color)[0];	 P181_lon = offset_well_3(degLat2, degLon2, -601 , -95, color)[1];
    P182_lat = offset_well_3(degLat2, degLon2, -602 , -90, color)[0];	 P182_lon = offset_well_3(degLat2, degLon2, -602 , -90, color)[1];
    P183_lat = offset_well_3(degLat2, degLon2, -604 , -85, color)[0];	 P183_lon = offset_well_3(degLat2, degLon2, -604 , -85, color)[1];
    P184_lat = offset_well_3(degLat2, degLon2, -606 , -80, color)[0];	 P184_lon = offset_well_3(degLat2, degLon2, -606 , -80, color)[1];
    P185_lat = offset_well_3(degLat2, degLon2, -606 , -75, color)[0];	 P185_lon = offset_well_3(degLat2, degLon2, -606 , -75, color)[1];
    P186_lat = offset_well_3(degLat2, degLon2, -605 , -70, color)[0];	 P186_lon = offset_well_3(degLat2, degLon2, -605 , -70, color)[1];
    P187_lat = offset_well_3(degLat2, degLon2, -603 , -65, color)[0];	 P187_lon = offset_well_3(degLat2, degLon2, -603 , -65, color)[1];
    P188_lat = offset_well_3(degLat2, degLon2, -598 , -60, color)[0];	 P188_lon = offset_well_3(degLat2, degLon2, -598 , -60, color)[1];
    P189_lat = offset_well_3(degLat2, degLon2, -592 , -55, color)[0];	 P189_lon = offset_well_3(degLat2, degLon2, -592 , -55, color)[1];
    P190_lat = offset_well_3(degLat2, degLon2, -587 , -50, color)[0];	 P190_lon = offset_well_3(degLat2, degLon2, -587 , -50, color)[1];
    P191_lat = offset_well_3(degLat2, degLon2, -582 , -45, color)[0];	 P191_lon = offset_well_3(degLat2, degLon2, -582 , -45, color)[1];
    P192_lat = offset_well_3(degLat2, degLon2, -580 , -40, color)[0];	 P192_lon = offset_well_3(degLat2, degLon2, -580 , -40, color)[1];
    P193_lat = offset_well_3(degLat2, degLon2, -581 , -35, color)[0];	 P193_lon = offset_well_3(degLat2, degLon2, -581 , -35, color)[1];
    P194_lat = offset_well_3(degLat2, degLon2, -582 , -30, color)[0];	 P194_lon = offset_well_3(degLat2, degLon2, -582 , -30, color)[1];
    P195_lat = offset_well_3(degLat2, degLon2, -585 , -25, color)[0];	 P195_lon = offset_well_3(degLat2, degLon2, -585 , -25, color)[1];
    P196_lat = offset_well_3(degLat2, degLon2, -587 , -20, color)[0];	 P196_lon = offset_well_3(degLat2, degLon2, -587 , -20, color)[1];
    P197_lat = offset_well_3(degLat2, degLon2, -591 , -15, color)[0];	 P197_lon = offset_well_3(degLat2, degLon2, -591 , -15, color)[1];
    P198_lat = offset_well_3(degLat2, degLon2, -594 , -10, color)[0];	 P198_lon = offset_well_3(degLat2, degLon2, -594 , -10, color)[1];
    P199_lat = offset_well_3(degLat2, degLon2, -597 , -5, color)[0];	 P199_lon = offset_well_3(degLat2, degLon2, -597 , -5, color)[1];
    P200_lat = offset_well_3(degLat2, degLon2, -600 , 0, color)[0];	 P200_lon = offset_well_3(degLat2, degLon2, -600 , 0, color)[1];
    P201_lat = offset_well_3(degLat2, degLon2, -597 , 5, color)[0];	 P201_lon = offset_well_3(degLat2, degLon2, -597 , 5, color)[1];
    P202_lat = offset_well_3(degLat2, degLon2, -594 , 10, color)[0];	 P202_lon = offset_well_3(degLat2, degLon2, -594 , 10, color)[1];
    P203_lat = offset_well_3(degLat2, degLon2, -591 , 15, color)[0];	 P203_lon = offset_well_3(degLat2, degLon2, -591 , 15, color)[1];
    P204_lat = offset_well_3(degLat2, degLon2, -587 , 20, color)[0];	 P204_lon = offset_well_3(degLat2, degLon2, -587 , 20, color)[1];
    P205_lat = offset_well_3(degLat2, degLon2, -585 , 25, color)[0];	 P205_lon = offset_well_3(degLat2, degLon2, -585 , 25, color)[1];
    P206_lat = offset_well_3(degLat2, degLon2, -582 , 30, color)[0];	 P206_lon = offset_well_3(degLat2, degLon2, -582 , 30, color)[1];
    P207_lat = offset_well_3(degLat2, degLon2, -581 , 35, color)[0];	 P207_lon = offset_well_3(degLat2, degLon2, -581 , 35, color)[1];
    P208_lat = offset_well_3(degLat2, degLon2, -580 , 40, color)[0];	 P208_lon = offset_well_3(degLat2, degLon2, -580 , 40, color)[1];
    P209_lat = offset_well_3(degLat2, degLon2, -582 , 45, color)[0];	 P209_lon = offset_well_3(degLat2, degLon2, -582 , 45, color)[1];
    P210_lat = offset_well_3(degLat2, degLon2, -587 , 50, color)[0];	 P210_lon = offset_well_3(degLat2, degLon2, -587 , 50, color)[1];
    P211_lat = offset_well_3(degLat2, degLon2, -592 , 55, color)[0];	 P211_lon = offset_well_3(degLat2, degLon2, -592 , 55, color)[1];
    P212_lat = offset_well_3(degLat2, degLon2, -598 , 60, color)[0];	 P212_lon = offset_well_3(degLat2, degLon2, -598 , 60, color)[1];
    P213_lat = offset_well_3(degLat2, degLon2, -603 , 65, color)[0];	 P213_lon = offset_well_3(degLat2, degLon2, -603 , 65, color)[1];
    P214_lat = offset_well_3(degLat2, degLon2, -605 , 70, color)[0];	 P214_lon = offset_well_3(degLat2, degLon2, -605 , 70, color)[1];
    P215_lat = offset_well_3(degLat2, degLon2, -606 , 75, color)[0];	 P215_lon = offset_well_3(degLat2, degLon2, -606 , 75, color)[1];
    P216_lat = offset_well_3(degLat2, degLon2, -606 , 80, color)[0];	 P216_lon = offset_well_3(degLat2, degLon2, -606 , 80, color)[1];
    P217_lat = offset_well_3(degLat2, degLon2, -604 , 85, color)[0];	 P217_lon = offset_well_3(degLat2, degLon2, -604 , 85, color)[1];
    P218_lat = offset_well_3(degLat2, degLon2, -602 , 90, color)[0];	 P218_lon = offset_well_3(degLat2, degLon2, -602 , 90, color)[1];
    P219_lat = offset_well_3(degLat2, degLon2, -601 , 95, color)[0];	 P219_lon = offset_well_3(degLat2, degLon2, -601 , 95, color)[1];
    P220_lat = offset_well_3(degLat2, degLon2, -601 , 100, color)[0];	 P220_lon = offset_well_3(degLat2, degLon2, -601 , 100, color)[1];
    P221_lat = offset_well_3(degLat2, degLon2, -600 , 105, color)[0];	 P221_lon = offset_well_3(degLat2, degLon2, -600 , 105, color)[1];
    P222_lat = offset_well_3(degLat2, degLon2, -600 , 110, color)[0];	 P222_lon = offset_well_3(degLat2, degLon2, -600 , 110, color)[1];
    P223_lat = offset_well_3(degLat2, degLon2, -601 , 115, color)[0];	 P223_lon = offset_well_3(degLat2, degLon2, -601 , 115, color)[1];
    P224_lat = offset_well_3(degLat2, degLon2, -602 , 120, color)[0];	 P224_lon = offset_well_3(degLat2, degLon2, -602 , 120, color)[1];
    P225_lat = offset_well_3(degLat2, degLon2, -604 , 125, color)[0];	 P225_lon = offset_well_3(degLat2, degLon2, -604 , 125, color)[1];
    P226_lat = offset_well_3(degLat2, degLon2, -605 , 130, color)[0];	 P226_lon = offset_well_3(degLat2, degLon2, -605 , 130, color)[1];
    P227_lat = offset_well_3(degLat2, degLon2, -607 , 135, color)[0];	 P227_lon = offset_well_3(degLat2, degLon2, -607 , 135, color)[1];
    P228_lat = offset_well_3(degLat2, degLon2, -608 , 140, color)[0];	 P228_lon = offset_well_3(degLat2, degLon2, -608 , 140, color)[1];
    P229_lat = offset_well_3(degLat2, degLon2, -609 , 145, color)[0];	 P229_lon = offset_well_3(degLat2, degLon2, -609 , 145, color)[1];
    P230_lat = offset_well_3(degLat2, degLon2, -611 , 150, color)[0];	 P230_lon = offset_well_3(degLat2, degLon2, -611 , 150, color)[1];
    P231_lat = offset_well_3(degLat2, degLon2, -613 , 155, color)[0];	 P231_lon = offset_well_3(degLat2, degLon2, -613 , 155, color)[1];
    P232_lat = offset_well_3(degLat2, degLon2, -614 , 160, color)[0];	 P232_lon = offset_well_3(degLat2, degLon2, -614 , 160, color)[1];
    P233_lat = offset_well_3(degLat2, degLon2, -615 , 165, color)[0];	 P233_lon = offset_well_3(degLat2, degLon2, -615 , 165, color)[1];
    P234_lat = offset_well_3(degLat2, degLon2, -616 , 170, color)[0];	 P234_lon = offset_well_3(degLat2, degLon2, -616 , 170, color)[1];
    P235_lat = offset_well_3(degLat2, degLon2, -616 , 175, color)[0];	 P235_lon = offset_well_3(degLat2, degLon2, -616 , 175, color)[1];
    P236_lat = offset_well_3(degLat2, degLon2, -615 , 180, color)[0];	 P236_lon = offset_well_3(degLat2, degLon2, -615 , 180, color)[1];
    P237_lat = offset_well_3(degLat2, degLon2, -613 , 185, color)[0];	 P237_lon = offset_well_3(degLat2, degLon2, -613 , 185, color)[1];
    P238_lat = offset_well_3(degLat2, degLon2, -610 , 190, color)[0];	 P238_lon = offset_well_3(degLat2, degLon2, -610 , 190, color)[1];
    P239_lat = offset_well_3(degLat2, degLon2, -600 , 195, color)[0];	 P239_lon = offset_well_3(degLat2, degLon2, -600 , 195, color)[1];
    P240_lat = offset_well_3(degLat2, degLon2, -590 , 197, color)[0];	 P240_lon = offset_well_3(degLat2, degLon2, -590 , 197, color)[1];
    P241_lat = offset_well_3(degLat2, degLon2, -580 , 199, color)[0];	 P241_lon = offset_well_3(degLat2, degLon2, -580 , 199, color)[1];
    P242_lat = offset_well_3(degLat2, degLon2, -570 , 200, color)[0];	 P242_lon = offset_well_3(degLat2, degLon2, -570 , 200, color)[1];
    P243_lat = offset_well_3(degLat2, degLon2, -560 , 200, color)[0];	 P243_lon = offset_well_3(degLat2, degLon2, -560 , 200, color)[1];
    P244_lat = offset_well_3(degLat2, degLon2, -550 , 200, color)[0];	 P244_lon = offset_well_3(degLat2, degLon2, -550 , 200, color)[1];
    P245_lat = offset_well_3(degLat2, degLon2, -540 , 200, color)[0];	 P245_lon = offset_well_3(degLat2, degLon2, -540 , 200, color)[1];
    P246_lat = offset_well_3(degLat2, degLon2, -530 , 200, color)[0];	 P246_lon = offset_well_3(degLat2, degLon2, -530 , 200, color)[1];
    P247_lat = offset_well_3(degLat2, degLon2, -520 , 200, color)[0];	 P247_lon = offset_well_3(degLat2, degLon2, -520 , 200, color)[1];
    P248_lat = offset_well_3(degLat2, degLon2, -510 , 200, color)[0];	 P248_lon = offset_well_3(degLat2, degLon2, -510 , 200, color)[1];
    P249_lat = offset_well_3(degLat2, degLon2, -500 , 200, color)[0];	 P249_lon = offset_well_3(degLat2, degLon2, -500 , 200, color)[1];
    P250_lat = offset_well_3(degLat2, degLon2, -490 , 201, color)[0];	 P250_lon = offset_well_3(degLat2, degLon2, -490 , 201, color)[1];
    P251_lat = offset_well_3(degLat2, degLon2, -480 , 202, color)[0];	 P251_lon = offset_well_3(degLat2, degLon2, -480 , 202, color)[1];
    P252_lat = offset_well_3(degLat2, degLon2, -470 , 204, color)[0];	 P252_lon = offset_well_3(degLat2, degLon2, -470 , 204, color)[1];
    P253_lat = offset_well_3(degLat2, degLon2, -460 , 206, color)[0];	 P253_lon = offset_well_3(degLat2, degLon2, -460 , 206, color)[1];
    P254_lat = offset_well_3(degLat2, degLon2, -450 , 207, color)[0];	 P254_lon = offset_well_3(degLat2, degLon2, -450 , 207, color)[1];
    P255_lat = offset_well_3(degLat2, degLon2, -440 , 207, color)[0];	 P255_lon = offset_well_3(degLat2, degLon2, -440 , 207, color)[1];
    P256_lat = offset_well_3(degLat2, degLon2, -430 , 207, color)[0];	 P256_lon = offset_well_3(degLat2, degLon2, -430 , 207, color)[1];
    P257_lat = offset_well_3(degLat2, degLon2, -420 , 207, color)[0];	 P257_lon = offset_well_3(degLat2, degLon2, -420 , 207, color)[1];
    P258_lat = offset_well_3(degLat2, degLon2, -410 , 205, color)[0];	 P258_lon = offset_well_3(degLat2, degLon2, -410 , 205, color)[1];
    P259_lat = offset_well_3(degLat2, degLon2, -400 , 200, color)[0];	 P259_lon = offset_well_3(degLat2, degLon2, -400 , 200, color)[1];
    P260_lat = offset_well_3(degLat2, degLon2, -390 , 194, color)[0];	 P260_lon = offset_well_3(degLat2, degLon2, -390 , 194, color)[1];
    P261_lat = offset_well_3(degLat2, degLon2, -380 , 185, color)[0];	 P261_lon = offset_well_3(degLat2, degLon2, -380 , 185, color)[1];
    P262_lat = offset_well_3(degLat2, degLon2, -370 , 175, color)[0];	 P262_lon = offset_well_3(degLat2, degLon2, -370 , 175, color)[1];
    P263_lat = offset_well_3(degLat2, degLon2, -360 , 163, color)[0];	 P263_lon = offset_well_3(degLat2, degLon2, -360 , 163, color)[1];
    P264_lat = offset_well_3(degLat2, degLon2, -350 , 150, color)[0];	 P264_lon = offset_well_3(degLat2, degLon2, -350 , 150, color)[1];
    P265_lat = offset_well_3(degLat2, degLon2, -340 , 138, color)[0];	 P265_lon = offset_well_3(degLat2, degLon2, -340 , 138, color)[1];
    P266_lat = offset_well_3(degLat2, degLon2, -330 , 125, color)[0];	 P266_lon = offset_well_3(degLat2, degLon2, -330 , 125, color)[1];
    P267_lat = offset_well_3(degLat2, degLon2, -320 , 115, color)[0];	 P267_lon = offset_well_3(degLat2, degLon2, -320 , 115, color)[1];
    P268_lat = offset_well_3(degLat2, degLon2, -310 , 107, color)[0];	 P268_lon = offset_well_3(degLat2, degLon2, -310 , 107, color)[1];
    P269_lat = offset_well_3(degLat2, degLon2, -300 , 100, color)[0];	 P269_lon = offset_well_3(degLat2, degLon2, -300 , 100, color)[1];
    P270_lat = offset_well_3(degLat2, degLon2, -290 , 96, color)[0];	 P270_lon = offset_well_3(degLat2, degLon2, -290 , 96, color)[1];
    P271_lat = offset_well_3(degLat2, degLon2, -280 , 94, color)[0];	 P271_lon = offset_well_3(degLat2, degLon2, -280 , 94, color)[1];
    P272_lat = offset_well_3(degLat2, degLon2, -270 , 93, color)[0];	 P272_lon = offset_well_3(degLat2, degLon2, -270 , 93, color)[1];
    P273_lat = offset_well_3(degLat2, degLon2, -260 , 93, color)[0];	 P273_lon = offset_well_3(degLat2, degLon2, -260 , 93, color)[1];
    P274_lat = offset_well_3(degLat2, degLon2, -250 , 94, color)[0];	 P274_lon = offset_well_3(degLat2, degLon2, -250 , 94, color)[1];
    P275_lat = offset_well_3(degLat2, degLon2, -240 , 94, color)[0];	 P275_lon = offset_well_3(degLat2, degLon2, -240 , 94, color)[1];
    P276_lat = offset_well_3(degLat2, degLon2, -230 , 96, color)[0];	 P276_lon = offset_well_3(degLat2, degLon2, -230 , 96, color)[1];
    P277_lat = offset_well_3(degLat2, degLon2, -220 , 98, color)[0];	 P277_lon = offset_well_3(degLat2, degLon2, -220 , 98, color)[1];
    P278_lat = offset_well_3(degLat2, degLon2, -210 , 99, color)[0];	 P278_lon = offset_well_3(degLat2, degLon2, -210 , 99, color)[1];
    P279_lat = offset_well_3(degLat2, degLon2, -200 , 100, color)[0];	 P279_lon = offset_well_3(degLat2, degLon2, -200 , 100, color)[1];
    P280_lat = offset_well_3(degLat2, degLon2, -190 , 99, color)[0];	 P280_lon = offset_well_3(degLat2, degLon2, -190 , 99, color)[1];
    P281_lat = offset_well_3(degLat2, degLon2, -180 , 99, color)[0];	 P281_lon = offset_well_3(degLat2, degLon2, -180 , 99, color)[1];
    P282_lat = offset_well_3(degLat2, degLon2, -170 , 98, color)[0];	 P282_lon = offset_well_3(degLat2, degLon2, -170 , 98, color)[1];
    P283_lat = offset_well_3(degLat2, degLon2, -160 , 97, color)[0];	 P283_lon = offset_well_3(degLat2, degLon2, -160 , 97, color)[1];
    P284_lat = offset_well_3(degLat2, degLon2, -150 , 96, color)[0];	 P284_lon = offset_well_3(degLat2, degLon2, -150 , 96, color)[1];
    P285_lat = offset_well_3(degLat2, degLon2, -140 , 96, color)[0];	 P285_lon = offset_well_3(degLat2, degLon2, -140 , 96, color)[1];
    P286_lat = offset_well_3(degLat2, degLon2, -130 , 96, color)[0];	 P286_lon = offset_well_3(degLat2, degLon2, -130 , 96, color)[1];
    P287_lat = offset_well_3(degLat2, degLon2, -120 , 96, color)[0];	 P287_lon = offset_well_3(degLat2, degLon2, -120 , 96, color)[1];
    P288_lat = offset_well_3(degLat2, degLon2, -110 , 97, color)[0];	 P288_lon = offset_well_3(degLat2, degLon2, -110 , 97, color)[1];
    P289_lat = offset_well_3(degLat2, degLon2, -100 , 100, color)[0];	 P289_lon = offset_well_3(degLat2, degLon2, -100 , 100, color)[1];
    P290_lat = offset_well_3(degLat2, degLon2, -90 , 105, color)[0];	 P290_lon = offset_well_3(degLat2, degLon2, -90 , 105, color)[1];
    P291_lat = offset_well_3(degLat2, degLon2, -80 , 114, color)[0];	 P291_lon = offset_well_3(degLat2, degLon2, -80 , 114, color)[1];
    P292_lat = offset_well_3(degLat2, degLon2, -70 , 130, color)[0];	 P292_lon = offset_well_3(degLat2, degLon2, -70 , 130, color)[1];
    P293_lat = offset_well_3(degLat2, degLon2, -60 , 145, color)[0];	 P293_lon = offset_well_3(degLat2, degLon2, -60 , 145, color)[1];
    P294_lat = offset_well_3(degLat2, degLon2, -50 , 160, color)[0];	 P294_lon = offset_well_3(degLat2, degLon2, -50 , 160, color)[1];
    P295_lat = offset_well_3(degLat2, degLon2, -40 , 173, color)[0];	 P295_lon = offset_well_3(degLat2, degLon2, -40 , 173, color)[1];
    P296_lat = offset_well_3(degLat2, degLon2, -30 , 185, color)[0];	 P296_lon = offset_well_3(degLat2, degLon2, -30 , 185, color)[1];
    P297_lat = offset_well_3(degLat2, degLon2, -25 , 190, color)[0];	 P297_lon = offset_well_3(degLat2, degLon2, -25 , 190, color)[1];
    P298_lat = offset_well_3(degLat2, degLon2, -20 , 194, color)[0];	 P298_lon = offset_well_3(degLat2, degLon2, -20 , 194, color)[1];
    P299_lat = offset_well_3(degLat2, degLon2, -10 , 197, color)[0];	 P299_lon = offset_well_3(degLat2, degLon2, -10 , 197, color)[1];
  
  L.polygon([

    [P1_lat, P1_lon],
    [P2_lat, P2_lon],
    [P3_lat, P3_lon],
    [P4_lat, P4_lon],
    [P5_lat, P5_lon],
    [P6_lat, P6_lon],
    [P7_lat, P7_lon],
    [P8_lat, P8_lon],
    [P9_lat, P9_lon],
    [P10_lat, P10_lon],
    [P11_lat, P11_lon],
    [P12_lat, P12_lon],
    [P13_lat, P13_lon],
    [P14_lat, P14_lon],
    [P15_lat, P15_lon],
    [P16_lat, P16_lon],
    [P17_lat, P17_lon],
    [P18_lat, P18_lon],
    [P19_lat, P19_lon],
    [P20_lat, P20_lon],
    [P21_lat, P21_lon],
    [P22_lat, P22_lon],
    [P23_lat, P23_lon],
    [P24_lat, P24_lon],
    [P25_lat, P25_lon],
    [P26_lat, P26_lon],
    [P27_lat, P27_lon],
    [P28_lat, P28_lon],
    [P29_lat, P29_lon],
    [P30_lat, P30_lon],
    [P31_lat, P31_lon],
    [P32_lat, P32_lon],
    [P33_lat, P33_lon],
    [P34_lat, P34_lon],
    [P35_lat, P35_lon],
    [P36_lat, P36_lon],
    [P37_lat, P37_lon],
    [P38_lat, P38_lon],
    [P39_lat, P39_lon],
    [P40_lat, P40_lon],
    [P41_lat, P41_lon],
    [P42_lat, P42_lon],
    [P43_lat, P43_lon],
    [P44_lat, P44_lon],
    [P45_lat, P45_lon],
    [P46_lat, P46_lon],
    [P47_lat, P47_lon],
    [P48_lat, P48_lon],
    [P49_lat, P49_lon],
    [P50_lat, P50_lon],
    [P51_lat, P51_lon],
    [P52_lat, P52_lon],
    [P53_lat, P53_lon],
    [P54_lat, P54_lon],
    [P55_lat, P55_lon],
    [P56_lat, P56_lon],
    [P57_lat, P57_lon],
    [P58_lat, P58_lon],
    [P59_lat, P59_lon],
    [P60_lat, P60_lon],
    [P61_lat, P61_lon],
    [P62_lat, P62_lon],
    [P63_lat, P63_lon],
    [P64_lat, P64_lon],
    [P65_lat, P65_lon],
    [P66_lat, P66_lon],
    [P67_lat, P67_lon],
    [P68_lat, P68_lon],
    [P69_lat, P69_lon],
    [P70_lat, P70_lon],
    [P71_lat, P71_lon],
    [P72_lat, P72_lon],
    [P73_lat, P73_lon],
    [P74_lat, P74_lon],
    [P75_lat, P75_lon],
    [P76_lat, P76_lon],
    [P77_lat, P77_lon],
    [P78_lat, P78_lon],
    [P79_lat, P79_lon],
    [P80_lat, P80_lon],
    [P81_lat, P81_lon],
    [P82_lat, P82_lon],
    [P83_lat, P83_lon],
    [P84_lat, P84_lon],
    [P85_lat, P85_lon],
    [P86_lat, P86_lon],
    [P87_lat, P87_lon],
    [P88_lat, P88_lon],
    [P89_lat, P89_lon],
    [P90_lat, P90_lon],
    [P91_lat, P91_lon],
    [P92_lat, P92_lon],
    [P93_lat, P93_lon],
    [P94_lat, P94_lon],
    [P95_lat, P95_lon],
    [P96_lat, P96_lon],
    [P97_lat, P97_lon],
    [P98_lat, P98_lon],
    [P99_lat, P99_lon],
    [P100_lat, P100_lon],
    [P101_lat, P101_lon],
    [P102_lat, P102_lon],
    [P103_lat, P103_lon],
    [P104_lat, P104_lon],
    [P105_lat, P105_lon],
    [P106_lat, P106_lon],
    [P107_lat, P107_lon],
    [P108_lat, P108_lon],
    [P109_lat, P109_lon],
    [P110_lat, P110_lon],
    [P111_lat, P111_lon],
    [P112_lat, P112_lon],
    [P113_lat, P113_lon],
    [P114_lat, P114_lon],
    [P115_lat, P115_lon],
    [P116_lat, P116_lon],
    [P117_lat, P117_lon],
    [P118_lat, P118_lon],
    [P119_lat, P119_lon],
    [P120_lat, P120_lon],
    [P121_lat, P121_lon],
    [P122_lat, P122_lon],
    [P123_lat, P123_lon],
    [P124_lat, P124_lon],
    [P125_lat, P125_lon],
    [P126_lat, P126_lon],
    [P127_lat, P127_lon],
    [P128_lat, P128_lon],
    [P129_lat, P129_lon],
    [P130_lat, P130_lon],
    [P131_lat, P131_lon],
    [P132_lat, P132_lon],
    [P133_lat, P133_lon],
    [P134_lat, P134_lon],
    [P135_lat, P135_lon],
    [P136_lat, P136_lon],
    [P137_lat, P137_lon],
    [P138_lat, P138_lon],
    [P139_lat, P139_lon],
    [P140_lat, P140_lon],
    [P141_lat, P141_lon],
    [P142_lat, P142_lon],
    [P143_lat, P143_lon],
    [P144_lat, P144_lon],
    [P145_lat, P145_lon],
    [P146_lat, P146_lon],
    [P147_lat, P147_lon],
    [P148_lat, P148_lon],
    [P149_lat, P149_lon],
    [P150_lat, P150_lon],
    [P151_lat, P151_lon],
    [P152_lat, P152_lon],
    [P153_lat, P153_lon],
    [P154_lat, P154_lon],
    [P155_lat, P155_lon],
    [P156_lat, P156_lon],
    [P157_lat, P157_lon],
    [P158_lat, P158_lon],
    [P159_lat, P159_lon],
    [P160_lat, P160_lon],
    [P161_lat, P161_lon],
    [P162_lat, P162_lon],
    [P163_lat, P163_lon],
    [P164_lat, P164_lon],
    [P165_lat, P165_lon],
    [P166_lat, P166_lon],
    [P167_lat, P167_lon],
    [P168_lat, P168_lon],
    [P169_lat, P169_lon],
    [P170_lat, P170_lon],
    [P171_lat, P171_lon],
    [P172_lat, P172_lon],
    [P173_lat, P173_lon],
    [P174_lat, P174_lon],
    [P175_lat, P175_lon],
    [P176_lat, P176_lon],
    [P177_lat, P177_lon],
    [P178_lat, P178_lon],
    [P179_lat, P179_lon],
    [P180_lat, P180_lon],
    [P181_lat, P181_lon],
    [P182_lat, P182_lon],
    [P183_lat, P183_lon],
    [P184_lat, P184_lon],
    [P185_lat, P185_lon],
    [P186_lat, P186_lon],
    [P187_lat, P187_lon],
    [P188_lat, P188_lon],
    [P189_lat, P189_lon],
    [P190_lat, P190_lon],
    [P191_lat, P191_lon],
    [P192_lat, P192_lon],
    [P193_lat, P193_lon],
    [P194_lat, P194_lon],
    [P195_lat, P195_lon],
    [P196_lat, P196_lon],
    [P197_lat, P197_lon],
    [P198_lat, P198_lon],
    [P199_lat, P199_lon],
    [P200_lat, P200_lon],
    [P201_lat, P201_lon],
    [P202_lat, P202_lon],
    [P203_lat, P203_lon],
    [P204_lat, P204_lon],
    [P205_lat, P205_lon],
    [P206_lat, P206_lon],
    [P207_lat, P207_lon],
    [P208_lat, P208_lon],
    [P209_lat, P209_lon],
    [P210_lat, P210_lon],
    [P211_lat, P211_lon],
    [P212_lat, P212_lon],
    [P213_lat, P213_lon],
    [P214_lat, P214_lon],
    [P215_lat, P215_lon],
    [P216_lat, P216_lon],
    [P217_lat, P217_lon],
    [P218_lat, P218_lon],
    [P219_lat, P219_lon],
    [P220_lat, P220_lon],
    [P221_lat, P221_lon],
    [P222_lat, P222_lon],
    [P223_lat, P223_lon],
    [P224_lat, P224_lon],
    [P225_lat, P225_lon],
    [P226_lat, P226_lon],
    [P227_lat, P227_lon],
    [P228_lat, P228_lon],
    [P229_lat, P229_lon],
    [P230_lat, P230_lon],
    [P231_lat, P231_lon],
    [P232_lat, P232_lon],
    [P233_lat, P233_lon],
    [P234_lat, P234_lon],
    [P235_lat, P235_lon],
    [P236_lat, P236_lon],
    [P237_lat, P237_lon],
    [P238_lat, P238_lon],
    [P239_lat, P239_lon],
    [P240_lat, P240_lon],
    [P241_lat, P241_lon],
    [P242_lat, P242_lon],
    [P243_lat, P243_lon],
    [P244_lat, P244_lon],
    [P245_lat, P245_lon],
    [P246_lat, P246_lon],
    [P247_lat, P247_lon],
    [P248_lat, P248_lon],
    [P249_lat, P249_lon],
    [P250_lat, P250_lon],
    [P251_lat, P251_lon],
    [P252_lat, P252_lon],
    [P253_lat, P253_lon],
    [P254_lat, P254_lon],
    [P255_lat, P255_lon],
    [P256_lat, P256_lon],
    [P257_lat, P257_lon],
    [P258_lat, P258_lon],
    [P259_lat, P259_lon],
    [P260_lat, P260_lon],
    [P261_lat, P261_lon],
    [P262_lat, P262_lon],
    [P263_lat, P263_lon],
    [P264_lat, P264_lon],
    [P265_lat, P265_lon],
    [P266_lat, P266_lon],
    [P267_lat, P267_lon],
    [P268_lat, P268_lon],
    [P269_lat, P269_lon],
    [P270_lat, P270_lon],
    [P271_lat, P271_lon],
    [P272_lat, P272_lon],
    [P273_lat, P273_lon],
    [P274_lat, P274_lon],
    [P275_lat, P275_lon],
    [P276_lat, P276_lon],
    [P277_lat, P277_lon],
    [P278_lat, P278_lon],
    [P279_lat, P279_lon],
    [P280_lat, P280_lon],
    [P281_lat, P281_lon],
    [P282_lat, P282_lon],
    [P283_lat, P283_lon],
    [P284_lat, P284_lon],
    [P285_lat, P285_lon],
    [P286_lat, P286_lon],
    [P287_lat, P287_lon],
    [P288_lat, P288_lon],
    [P289_lat, P289_lon],
    [P290_lat, P290_lon],
    [P291_lat, P291_lon],
    [P292_lat, P292_lon],
    [P293_lat, P293_lon],
    [P294_lat, P294_lon],
    [P295_lat, P295_lon],
    [P296_lat, P296_lon],
    [P297_lat, P297_lon],
    [P298_lat, P298_lon],
    [P299_lat, P299_lon],
    

], {
  color: color,
  fillColor: color,
  fillOpacity: 0.8,
}).addTo(map);
  //=======================================================







  


  // Verdes:--------------------------------------------
    color= 'green';

    P1_lat = offset_well_3(degLat2, degLon2, 0 , 0, color)[0];	 P1_lon = offset_well_3(degLat2, degLon2, 0 , 0, color)[1];
    P2_lat = offset_well_3(degLat2, degLon2, 3.09 , 0.34, color)[0];	 P2_lon = offset_well_3(degLat2, degLon2, 3.09 , 0.34, color)[1];
    P3_lat = offset_well_3(degLat2, degLon2, 7.2 , 0.84, color)[0];	 P3_lon = offset_well_3(degLat2, degLon2, 7.2 , 0.84, color)[1];
    P4_lat = offset_well_3(degLat2, degLon2, 12.11 , 1.45, color)[0];	 P4_lon = offset_well_3(degLat2, degLon2, 12.11 , 1.45, color)[1];
    P5_lat = offset_well_3(degLat2, degLon2, 17.6 , 2.12, color)[0];	 P5_lon = offset_well_3(degLat2, degLon2, 17.6 , 2.12, color)[1];
    P6_lat = offset_well_3(degLat2, degLon2, 23.44 , 2.81, color)[0];	 P6_lon = offset_well_3(degLat2, degLon2, 23.44 , 2.81, color)[1];
    P7_lat = offset_well_3(degLat2, degLon2, 29.4 , 3.48, color)[0];	 P7_lon = offset_well_3(degLat2, degLon2, 29.4 , 3.48, color)[1];
    P8_lat = offset_well_3(degLat2, degLon2, 35.26 , 4.08, color)[0];	 P8_lon = offset_well_3(degLat2, degLon2, 35.26 , 4.08, color)[1];
    P9_lat = offset_well_3(degLat2, degLon2, 40.8 , 4.56, color)[0];	 P9_lon = offset_well_3(degLat2, degLon2, 40.8 , 4.56, color)[1];
    P10_lat = offset_well_3(degLat2, degLon2, 50 , 5, color)[0];	 P10_lon = offset_well_3(degLat2, degLon2, 50 , 5, color)[1];
    P11_lat = offset_well_3(degLat2, degLon2, 53.51 , 4.86, color)[0];	 P11_lon = offset_well_3(degLat2, degLon2, 53.51 , 4.86, color)[1];
    P12_lat = offset_well_3(degLat2, degLon2, 56.6 , 4.48, color)[0];	 P12_lon = offset_well_3(degLat2, degLon2, 56.6 , 4.48, color)[1];
    P13_lat = offset_well_3(degLat2, degLon2, 59.34 , 3.92, color)[0];	 P13_lon = offset_well_3(degLat2, degLon2, 59.34 , 3.92, color)[1];
    P14_lat = offset_well_3(degLat2, degLon2, 61.8 , 3.24, color)[0];	 P14_lon = offset_well_3(degLat2, degLon2, 61.8 , 3.24, color)[1];
    P15_lat = offset_well_3(degLat2, degLon2, 64.06 , 2.5, color)[0];	 P15_lon = offset_well_3(degLat2, degLon2, 64.06 , 2.5, color)[1];
    P16_lat = offset_well_3(degLat2, degLon2, 66.2 , 1.76, color)[0];	 P16_lon = offset_well_3(degLat2, degLon2, 66.2 , 1.76, color)[1];
    P17_lat = offset_well_3(degLat2, degLon2, 68.29 , 1.08, color)[0];	 P17_lon = offset_well_3(degLat2, degLon2, 68.29 , 1.08, color)[1];
    P18_lat = offset_well_3(degLat2, degLon2, 70.4 , 0.52, color)[0];	 P18_lon = offset_well_3(degLat2, degLon2, 70.4 , 0.52, color)[1];
    P19_lat = offset_well_3(degLat2, degLon2, 72.61 , 0.14, color)[0];	 P19_lon = offset_well_3(degLat2, degLon2, 72.61 , 0.14, color)[1];
    P20_lat = offset_well_3(degLat2, degLon2, 75 , 0, color)[0];	 P20_lon = offset_well_3(degLat2, degLon2, 75 , 0, color)[1];
    P21_lat = offset_well_3(degLat2, degLon2, 77.52 , 0.13, color)[0];	 P21_lon = offset_well_3(degLat2, degLon2, 77.52 , 0.13, color)[1];
    P22_lat = offset_well_3(degLat2, degLon2, 80.08 , 0.49, color)[0];	 P22_lon = offset_well_3(degLat2, degLon2, 80.08 , 0.49, color)[1];
    P23_lat = offset_well_3(degLat2, degLon2, 82.66 , 1.02, color)[0];	 P23_lon = offset_well_3(degLat2, degLon2, 82.66 , 1.02, color)[1];
    P24_lat = offset_well_3(degLat2, degLon2, 85.24 , 1.66, color)[0];	 P24_lon = offset_well_3(degLat2, degLon2, 85.24 , 1.66, color)[1];
    P25_lat = offset_well_3(degLat2, degLon2, 87.81 , 2.38, color)[0];	 P25_lon = offset_well_3(degLat2, degLon2, 87.81 , 2.38, color)[1];
    P26_lat = offset_well_3(degLat2, degLon2, 90.36 , 3.1, color)[0];	 P26_lon = offset_well_3(degLat2, degLon2, 90.36 , 3.1, color)[1];
    P27_lat = offset_well_3(degLat2, degLon2, 92.87 , 3.77, color)[0];	 P27_lon = offset_well_3(degLat2, degLon2, 92.87 , 3.77, color)[1];
    P28_lat = offset_well_3(degLat2, degLon2, 95.32 , 4.35, color)[0];	 P28_lon = offset_well_3(degLat2, degLon2, 95.32 , 4.35, color)[1];
    P29_lat = offset_well_3(degLat2, degLon2, 97.7 , 4.78, color)[0];	 P29_lon = offset_well_3(degLat2, degLon2, 97.7 , 4.78, color)[1];
    P30_lat = offset_well_3(degLat2, degLon2, 100 , 5, color)[0];	 P30_lon = offset_well_3(degLat2, degLon2, 100 , 5, color)[1];
    P31_lat = offset_well_3(degLat2, degLon2, 101.93 , 5.02, color)[0];	 P31_lon = offset_well_3(degLat2, degLon2, 101.93 , 5.02, color)[1];
    P32_lat = offset_well_3(degLat2, degLon2, 103.36 , 4.9, color)[0];	 P32_lon = offset_well_3(degLat2, degLon2, 103.36 , 4.9, color)[1];
    P33_lat = offset_well_3(degLat2, degLon2, 104.48 , 4.66, color)[0];	 P33_lon = offset_well_3(degLat2, degLon2, 104.48 , 4.66, color)[1];
    P34_lat = offset_well_3(degLat2, degLon2, 105.48 , 4.33, color)[0];	 P34_lon = offset_well_3(degLat2, degLon2, 105.48 , 4.33, color)[1];
    P35_lat = offset_well_3(degLat2, degLon2, 106.56 , 3.94, color)[0];	 P35_lon = offset_well_3(degLat2, degLon2, 106.56 , 3.94, color)[1];
    P36_lat = offset_well_3(degLat2, degLon2, 107.92 , 3.51, color)[0];	 P36_lon = offset_well_3(degLat2, degLon2, 107.92 , 3.51, color)[1];
    P37_lat = offset_well_3(degLat2, degLon2, 109.75 , 3.08, color)[0];	 P37_lon = offset_well_3(degLat2, degLon2, 109.75 , 3.08, color)[1];
    P38_lat = offset_well_3(degLat2, degLon2, 112.24 , 2.66, color)[0];	 P38_lon = offset_well_3(degLat2, degLon2, 112.24 , 2.66, color)[1];
    P39_lat = offset_well_3(degLat2, degLon2, 115.59 , 2.3, color)[0];	 P39_lon = offset_well_3(degLat2, degLon2, 115.59 , 2.3, color)[1];
    P40_lat = offset_well_3(degLat2, degLon2, 120 , 2, color)[0];	 P40_lon = offset_well_3(degLat2, degLon2, 120 , 2, color)[1];
    P41_lat = offset_well_3(degLat2, degLon2, 125.84 , 1.8, color)[0];	 P41_lon = offset_well_3(degLat2, degLon2, 125.84 , 1.8, color)[1];
    P42_lat = offset_well_3(degLat2, degLon2, 133.12 , 1.66, color)[0];	 P42_lon = offset_well_3(degLat2, degLon2, 133.12 , 1.66, color)[1];
    P43_lat = offset_well_3(degLat2, degLon2, 141.48 , 1.58, color)[0];	 P43_lon = offset_well_3(degLat2, degLon2, 141.48 , 1.58, color)[1];
    P44_lat = offset_well_3(degLat2, degLon2, 150.56 , 1.51, color)[0];	 P44_lon = offset_well_3(degLat2, degLon2, 150.56 , 1.51, color)[1];
    P45_lat = offset_well_3(degLat2, degLon2, 160 , 1.44, color)[0];	 P45_lon = offset_well_3(degLat2, degLon2, 160 , 1.44, color)[1];
    P46_lat = offset_well_3(degLat2, degLon2, 169.44 , 1.33, color)[0];	 P46_lon = offset_well_3(degLat2, degLon2, 169.44 , 1.33, color)[1];
    P47_lat = offset_well_3(degLat2, degLon2, 178.52 , 1.16, color)[0];	 P47_lon = offset_well_3(degLat2, degLon2, 178.52 , 1.16, color)[1];
    P48_lat = offset_well_3(degLat2, degLon2, 186.88 , 0.9, color)[0];	 P48_lon = offset_well_3(degLat2, degLon2, 186.88 , 0.9, color)[1];
    P49_lat = offset_well_3(degLat2, degLon2, 194.16 , 0.52, color)[0];	 P49_lon = offset_well_3(degLat2, degLon2, 194.16 , 0.52, color)[1];
    P50_lat = offset_well_3(degLat2, degLon2, 200 , 0, color)[0];	 P50_lon = offset_well_3(degLat2, degLon2, 200 , 0, color)[1];
    P51_lat = offset_well_3(degLat2, degLon2, 204.16 , -0.59, color)[0];	 P51_lon = offset_well_3(degLat2, degLon2, 204.16 , -0.59, color)[1];
    P52_lat = offset_well_3(degLat2, degLon2, 206.88 , -1.17, color)[0];	 P52_lon = offset_well_3(degLat2, degLon2, 206.88 , -1.17, color)[1];
    P53_lat = offset_well_3(degLat2, degLon2, 208.52 , -1.78, color)[0];	 P53_lon = offset_well_3(degLat2, degLon2, 208.52 , -1.78, color)[1];
    P54_lat = offset_well_3(degLat2, degLon2, 209.44 , -2.46, color)[0];	 P54_lon = offset_well_3(degLat2, degLon2, 209.44 , -2.46, color)[1];
    P55_lat = offset_well_3(degLat2, degLon2, 210 , -3.25, color)[0];	 P55_lon = offset_well_3(degLat2, degLon2, 210 , -3.25, color)[1];
    P56_lat = offset_well_3(degLat2, degLon2, 210.56 , -4.18, color)[0];	 P56_lon = offset_well_3(degLat2, degLon2, 210.56 , -4.18, color)[1];
    P57_lat = offset_well_3(degLat2, degLon2, 211.48 , -5.28, color)[0];	 P57_lon = offset_well_3(degLat2, degLon2, 211.48 , -5.28, color)[1];
    P58_lat = offset_well_3(degLat2, degLon2, 213.12 , -6.59, color)[0];	 P58_lon = offset_well_3(degLat2, degLon2, 213.12 , -6.59, color)[1];
    P59_lat = offset_well_3(degLat2, degLon2, 215.84 , -8.15, color)[0];	 P59_lon = offset_well_3(degLat2, degLon2, 215.84 , -8.15, color)[1];
    P60_lat = offset_well_3(degLat2, degLon2, 220 , -10, color)[0];	 P60_lon = offset_well_3(degLat2, degLon2, 220 , -10, color)[1];
    P61_lat = offset_well_3(degLat2, degLon2, 225.71 , -12.24, color)[0];	 P61_lon = offset_well_3(degLat2, degLon2, 225.71 , -12.24, color)[1];
    P62_lat = offset_well_3(degLat2, degLon2, 232.64 , -14.88, color)[0];	 P62_lon = offset_well_3(degLat2, degLon2, 232.64 , -14.88, color)[1];
    P63_lat = offset_well_3(degLat2, degLon2, 240.54 , -17.85, color)[0];	 P63_lon = offset_well_3(degLat2, degLon2, 240.54 , -17.85, color)[1];
    P64_lat = offset_well_3(degLat2, degLon2, 249.12 , -21.04, color)[0];	 P64_lon = offset_well_3(degLat2, degLon2, 249.12 , -21.04, color)[1];
    P65_lat = offset_well_3(degLat2, degLon2, 258.13 , -24.38, color)[0];	 P65_lon = offset_well_3(degLat2, degLon2, 258.13 , -24.38, color)[1];
    P66_lat = offset_well_3(degLat2, degLon2, 267.28 , -27.76, color)[0];	 P66_lon = offset_well_3(degLat2, degLon2, 267.28 , -27.76, color)[1];
    P67_lat = offset_well_3(degLat2, degLon2, 276.32 , -31.11, color)[0];	 P67_lon = offset_well_3(degLat2, degLon2, 276.32 , -31.11, color)[1];
    P68_lat = offset_well_3(degLat2, degLon2, 284.96 , -34.32, color)[0];	 P68_lon = offset_well_3(degLat2, degLon2, 284.96 , -34.32, color)[1];
    P69_lat = offset_well_3(degLat2, degLon2, 292.95 , -37.32, color)[0];	 P69_lon = offset_well_3(degLat2, degLon2, 292.95 , -37.32, color)[1];
    P70_lat = offset_well_3(degLat2, degLon2, 300 , -40, color)[0];	 P70_lon = offset_well_3(degLat2, degLon2, 300 , -40, color)[1];
    P71_lat = offset_well_3(degLat2, degLon2, 306.33 , -42.41, color)[0];	 P71_lon = offset_well_3(degLat2, degLon2, 306.33 , -42.41, color)[1];
    P72_lat = offset_well_3(degLat2, degLon2, 312.32 , -44.67, color)[0];	 P72_lon = offset_well_3(degLat2, degLon2, 312.32 , -44.67, color)[1];
    P73_lat = offset_well_3(degLat2, degLon2, 317.99 , -46.8, color)[0];	 P73_lon = offset_well_3(degLat2, degLon2, 317.99 , -46.8, color)[1];
    P74_lat = offset_well_3(degLat2, degLon2, 323.36 , -48.82, color)[0];	 P74_lon = offset_well_3(degLat2, degLon2, 323.36 , -48.82, color)[1];
    P75_lat = offset_well_3(degLat2, degLon2, 328.44 , -50.75, color)[0];	 P75_lon = offset_well_3(degLat2, degLon2, 328.44 , -50.75, color)[1];
    P76_lat = offset_well_3(degLat2, degLon2, 333.24 , -52.62, color)[0];	 P76_lon = offset_well_3(degLat2, degLon2, 333.24 , -52.62, color)[1];
    P77_lat = offset_well_3(degLat2, degLon2, 337.78 , -54.46, color)[0];	 P77_lon = offset_well_3(degLat2, degLon2, 337.78 , -54.46, color)[1];
    P78_lat = offset_well_3(degLat2, degLon2, 342.08 , -56.29, color)[0];	 P78_lon = offset_well_3(degLat2, degLon2, 342.08 , -56.29, color)[1];
    P79_lat = offset_well_3(degLat2, degLon2, 346.15 , -58.13, color)[0];	 P79_lon = offset_well_3(degLat2, degLon2, 346.15 , -58.13, color)[1];
    P80_lat = offset_well_3(degLat2, degLon2, 350 , -60, color)[0];	 P80_lon = offset_well_3(degLat2, degLon2, 350 , -60, color)[1];
    P81_lat = offset_well_3(degLat2, degLon2, 353.51 , -61.91, color)[0];	 P81_lon = offset_well_3(degLat2, degLon2, 353.51 , -61.91, color)[1];
    P82_lat = offset_well_3(degLat2, degLon2, 356.6 , -63.82, color)[0];	 P82_lon = offset_well_3(degLat2, degLon2, 356.6 , -63.82, color)[1];
    P83_lat = offset_well_3(degLat2, degLon2, 359.34 , -65.74, color)[0];	 P83_lon = offset_well_3(degLat2, degLon2, 359.34 , -65.74, color)[1];
    P84_lat = offset_well_3(degLat2, degLon2, 361.8 , -67.63, color)[0];	 P84_lon = offset_well_3(degLat2, degLon2, 361.8 , -67.63, color)[1];
    P85_lat = offset_well_3(degLat2, degLon2, 364.06 , -69.5, color)[0];	 P85_lon = offset_well_3(degLat2, degLon2, 364.06 , -69.5, color)[1];
    P86_lat = offset_well_3(degLat2, degLon2, 366.2 , -71.33, color)[0];	 P86_lon = offset_well_3(degLat2, degLon2, 366.2 , -71.33, color)[1];
    P87_lat = offset_well_3(degLat2, degLon2, 368.29 , -73.1, color)[0];	 P87_lon = offset_well_3(degLat2, degLon2, 368.29 , -73.1, color)[1];
    P88_lat = offset_well_3(degLat2, degLon2, 370.4 , -74.82, color)[0];	 P88_lon = offset_well_3(degLat2, degLon2, 370.4 , -74.82, color)[1];
    P89_lat = offset_well_3(degLat2, degLon2, 372.61 , -76.45, color)[0];	 P89_lon = offset_well_3(degLat2, degLon2, 372.61 , -76.45, color)[1];
    P90_lat = offset_well_3(degLat2, degLon2, 375 , -78, color)[0];	 P90_lon = offset_well_3(degLat2, degLon2, 375 , -78, color)[1];
    P91_lat = offset_well_3(degLat2, degLon2, 377.57 , -79.47, color)[0];	 P91_lon = offset_well_3(degLat2, degLon2, 377.57 , -79.47, color)[1];
    P92_lat = offset_well_3(degLat2, degLon2, 380.24 , -80.9, color)[0];	 P92_lon = offset_well_3(degLat2, degLon2, 380.24 , -80.9, color)[1];
    P93_lat = offset_well_3(degLat2, degLon2, 382.97 , -82.26, color)[0];	 P93_lon = offset_well_3(degLat2, degLon2, 382.97 , -82.26, color)[1];
    P94_lat = offset_well_3(degLat2, degLon2, 385.72 , -83.57, color)[0];	 P94_lon = offset_well_3(degLat2, degLon2, 385.72 , -83.57, color)[1];
    P95_lat = offset_well_3(degLat2, degLon2, 388.44 , -84.81, color)[0];	 P95_lon = offset_well_3(degLat2, degLon2, 388.44 , -84.81, color)[1];
    P96_lat = offset_well_3(degLat2, degLon2, 391.08 , -85.99, color)[0];	 P96_lon = offset_well_3(degLat2, degLon2, 391.08 , -85.99, color)[1];
    P97_lat = offset_well_3(degLat2, degLon2, 393.6 , -87.1, color)[0];	 P97_lon = offset_well_3(degLat2, degLon2, 393.6 , -87.1, color)[1];
    P98_lat = offset_well_3(degLat2, degLon2, 395.96 , -88.14, color)[0];	 P98_lon = offset_well_3(degLat2, degLon2, 395.96 , -88.14, color)[1];
    P99_lat = offset_well_3(degLat2, degLon2, 398.11 , -89.11, color)[0];	 P99_lon = offset_well_3(degLat2, degLon2, 398.11 , -89.11, color)[1];
    P100_lat = offset_well_3(degLat2, degLon2, 400 , -90, color)[0];	 P100_lon = offset_well_3(degLat2, degLon2, 400 , -90, color)[1];
    P101_lat = offset_well_3(degLat2, degLon2, 401.61 , -90.78, color)[0];	 P101_lon = offset_well_3(degLat2, degLon2, 401.61 , -90.78, color)[1];
    P102_lat = offset_well_3(degLat2, degLon2, 402.96 , -91.45, color)[0];	 P102_lon = offset_well_3(degLat2, degLon2, 402.96 , -91.45, color)[1];
    P103_lat = offset_well_3(degLat2, degLon2, 404.1 , -92.01, color)[0];	 P103_lon = offset_well_3(degLat2, degLon2, 404.1 , -92.01, color)[1];
    P104_lat = offset_well_3(degLat2, degLon2, 405.08 , -92.5, color)[0];	 P104_lon = offset_well_3(degLat2, degLon2, 405.08 , -92.5, color)[1];
    P105_lat = offset_well_3(degLat2, degLon2, 405.94 , -92.94, color)[0];	 P105_lon = offset_well_3(degLat2, degLon2, 405.94 , -92.94, color)[1];
    P106_lat = offset_well_3(degLat2, degLon2, 406.72 , -93.34, color)[0];	 P106_lon = offset_well_3(degLat2, degLon2, 406.72 , -93.34, color)[1];
    P107_lat = offset_well_3(degLat2, degLon2, 407.47 , -93.72, color)[0];	 P107_lon = offset_well_3(degLat2, degLon2, 407.47 , -93.72, color)[1];
    P108_lat = offset_well_3(degLat2, degLon2, 408.24 , -94.11, color)[0];	 P108_lon = offset_well_3(degLat2, degLon2, 408.24 , -94.11, color)[1];
    P109_lat = offset_well_3(degLat2, degLon2, 409.07 , -94.53, color)[0];	 P109_lon = offset_well_3(degLat2, degLon2, 409.07 , -94.53, color)[1];
    P110_lat = offset_well_3(degLat2, degLon2, 410 , -95, color)[0];	 P110_lon = offset_well_3(degLat2, degLon2, 410 , -95, color)[1];
    P111_lat = offset_well_3(degLat2, degLon2, 411.05 , -95.52, color)[0];	 P111_lon = offset_well_3(degLat2, degLon2, 411.05 , -95.52, color)[1];
    P112_lat = offset_well_3(degLat2, degLon2, 412.16 , -96.08, color)[0];	 P112_lon = offset_well_3(degLat2, degLon2, 412.16 , -96.08, color)[1];
    P113_lat = offset_well_3(degLat2, degLon2, 413.32 , -96.66, color)[0];	 P113_lon = offset_well_3(degLat2, degLon2, 413.32 , -96.66, color)[1];
    P114_lat = offset_well_3(degLat2, degLon2, 414.48 , -97.24, color)[0];	 P114_lon = offset_well_3(degLat2, degLon2, 414.48 , -97.24, color)[1];
    P115_lat = offset_well_3(degLat2, degLon2, 415.63 , -97.81, color)[0];	 P115_lon = offset_well_3(degLat2, degLon2, 415.63 , -97.81, color)[1];
    P116_lat = offset_well_3(degLat2, degLon2, 416.72 , -98.36, color)[0];	 P116_lon = offset_well_3(degLat2, degLon2, 416.72 , -98.36, color)[1];
    P117_lat = offset_well_3(degLat2, degLon2, 417.74 , -98.87, color)[0];	 P117_lon = offset_well_3(degLat2, degLon2, 417.74 , -98.87, color)[1];
    P118_lat = offset_well_3(degLat2, degLon2, 418.64 , -99.32, color)[0];	 P118_lon = offset_well_3(degLat2, degLon2, 418.64 , -99.32, color)[1];
    P119_lat = offset_well_3(degLat2, degLon2, 419.41 , -99.7, color)[0];	 P119_lon = offset_well_3(degLat2, degLon2, 419.41 , -99.7, color)[1];
    P120_lat = offset_well_3(degLat2, degLon2, 100 , -100, color)[0];	 P120_lon = offset_well_3(degLat2, degLon2, 100 , -100, color)[1];
    P121_lat = offset_well_3(degLat2, degLon2, 80 , -99, color)[0];	 P121_lon = offset_well_3(degLat2, degLon2, 80 , -99, color)[1];
    P122_lat = offset_well_3(degLat2, degLon2, 60 , -95, color)[0];	 P122_lon = offset_well_3(degLat2, degLon2, 60 , -95, color)[1];
    P123_lat = offset_well_3(degLat2, degLon2, 40 , -80, color)[0];	 P123_lon = offset_well_3(degLat2, degLon2, 40 , -80, color)[1];
    P124_lat = offset_well_3(degLat2, degLon2, 20 , -65, color)[0];	 P124_lon = offset_well_3(degLat2, degLon2, 20 , -65, color)[1];
    P125_lat = offset_well_3(degLat2, degLon2, 10 , -45, color)[0];	 P125_lon = offset_well_3(degLat2, degLon2, 10 , -45, color)[1];
    P126_lat = offset_well_3(degLat2, degLon2, 0 , -30, color)[0];	 P126_lon = offset_well_3(degLat2, degLon2, 0 , -30, color)[1];
    P127_lat = offset_well_3(degLat2, degLon2, 0 , -30, color)[0];	 P127_lon = offset_well_3(degLat2, degLon2, 0 , -30, color)[1];
    P128_lat = offset_well_3(degLat2, degLon2, -10 , -45, color)[0];	 P128_lon = offset_well_3(degLat2, degLon2, -10 , -45, color)[1];
    P129_lat = offset_well_3(degLat2, degLon2, -20 , -65, color)[0];	 P129_lon = offset_well_3(degLat2, degLon2, -20 , -65, color)[1];
    P130_lat = offset_well_3(degLat2, degLon2, -40 , -80, color)[0];	 P130_lon = offset_well_3(degLat2, degLon2, -40 , -80, color)[1];
    P131_lat = offset_well_3(degLat2, degLon2, -60 , -95, color)[0];	 P131_lon = offset_well_3(degLat2, degLon2, -60 , -95, color)[1];
    P132_lat = offset_well_3(degLat2, degLon2, -80 , -99, color)[0];	 P132_lon = offset_well_3(degLat2, degLon2, -80 , -99, color)[1];
    P133_lat = offset_well_3(degLat2, degLon2, -100 , -100, color)[0];	 P133_lon = offset_well_3(degLat2, degLon2, -100 , -100, color)[1];
    P134_lat = offset_well_3(degLat2, degLon2, -419.41 , -99.7, color)[0];	 P134_lon = offset_well_3(degLat2, degLon2, -419.41 , -99.7, color)[1];
    P135_lat = offset_well_3(degLat2, degLon2, -418.64 , -99.32, color)[0];	 P135_lon = offset_well_3(degLat2, degLon2, -418.64 , -99.32, color)[1];
    P136_lat = offset_well_3(degLat2, degLon2, -417.74 , -98.87, color)[0];	 P136_lon = offset_well_3(degLat2, degLon2, -417.74 , -98.87, color)[1];
    P137_lat = offset_well_3(degLat2, degLon2, -416.72 , -98.36, color)[0];	 P137_lon = offset_well_3(degLat2, degLon2, -416.72 , -98.36, color)[1];
    P138_lat = offset_well_3(degLat2, degLon2, -415.63 , -97.81, color)[0];	 P138_lon = offset_well_3(degLat2, degLon2, -415.63 , -97.81, color)[1];
    P139_lat = offset_well_3(degLat2, degLon2, -414.48 , -97.24, color)[0];	 P139_lon = offset_well_3(degLat2, degLon2, -414.48 , -97.24, color)[1];
    P140_lat = offset_well_3(degLat2, degLon2, -413.32 , -96.66, color)[0];	 P140_lon = offset_well_3(degLat2, degLon2, -413.32 , -96.66, color)[1];
    P141_lat = offset_well_3(degLat2, degLon2, -412.16 , -96.08, color)[0];	 P141_lon = offset_well_3(degLat2, degLon2, -412.16 , -96.08, color)[1];
    P142_lat = offset_well_3(degLat2, degLon2, -411.05 , -95.52, color)[0];	 P142_lon = offset_well_3(degLat2, degLon2, -411.05 , -95.52, color)[1];
    P143_lat = offset_well_3(degLat2, degLon2, -410 , -95, color)[0];	 P143_lon = offset_well_3(degLat2, degLon2, -410 , -95, color)[1];
    P144_lat = offset_well_3(degLat2, degLon2, -409.07 , -94.53, color)[0];	 P144_lon = offset_well_3(degLat2, degLon2, -409.07 , -94.53, color)[1];
    P145_lat = offset_well_3(degLat2, degLon2, -408.24 , -94.11, color)[0];	 P145_lon = offset_well_3(degLat2, degLon2, -408.24 , -94.11, color)[1];
    P146_lat = offset_well_3(degLat2, degLon2, -407.47 , -93.72, color)[0];	 P146_lon = offset_well_3(degLat2, degLon2, -407.47 , -93.72, color)[1];
    P147_lat = offset_well_3(degLat2, degLon2, -406.72 , -93.34, color)[0];	 P147_lon = offset_well_3(degLat2, degLon2, -406.72 , -93.34, color)[1];
    P148_lat = offset_well_3(degLat2, degLon2, -405.94 , -92.94, color)[0];	 P148_lon = offset_well_3(degLat2, degLon2, -405.94 , -92.94, color)[1];
    P149_lat = offset_well_3(degLat2, degLon2, -405.08 , -92.5, color)[0];	 P149_lon = offset_well_3(degLat2, degLon2, -405.08 , -92.5, color)[1];
    P150_lat = offset_well_3(degLat2, degLon2, -404.1 , -92.01, color)[0];	 P150_lon = offset_well_3(degLat2, degLon2, -404.1 , -92.01, color)[1];
    P151_lat = offset_well_3(degLat2, degLon2, -402.96 , -91.45, color)[0];	 P151_lon = offset_well_3(degLat2, degLon2, -402.96 , -91.45, color)[1];
    P152_lat = offset_well_3(degLat2, degLon2, -401.61 , -90.78, color)[0];	 P152_lon = offset_well_3(degLat2, degLon2, -401.61 , -90.78, color)[1];
    P153_lat = offset_well_3(degLat2, degLon2, -400 , -90, color)[0];	 P153_lon = offset_well_3(degLat2, degLon2, -400 , -90, color)[1];
    P154_lat = offset_well_3(degLat2, degLon2, -398.11 , -89.11, color)[0];	 P154_lon = offset_well_3(degLat2, degLon2, -398.11 , -89.11, color)[1];
    P155_lat = offset_well_3(degLat2, degLon2, -395.96 , -88.14, color)[0];	 P155_lon = offset_well_3(degLat2, degLon2, -395.96 , -88.14, color)[1];
    P156_lat = offset_well_3(degLat2, degLon2, -393.6 , -87.1, color)[0];	 P156_lon = offset_well_3(degLat2, degLon2, -393.6 , -87.1, color)[1];
    P157_lat = offset_well_3(degLat2, degLon2, -391.08 , -85.99, color)[0];	 P157_lon = offset_well_3(degLat2, degLon2, -391.08 , -85.99, color)[1];
    P158_lat = offset_well_3(degLat2, degLon2, -388.44 , -84.81, color)[0];	 P158_lon = offset_well_3(degLat2, degLon2, -388.44 , -84.81, color)[1];
    P159_lat = offset_well_3(degLat2, degLon2, -385.72 , -83.57, color)[0];	 P159_lon = offset_well_3(degLat2, degLon2, -385.72 , -83.57, color)[1];
    P160_lat = offset_well_3(degLat2, degLon2, -382.97 , -82.26, color)[0];	 P160_lon = offset_well_3(degLat2, degLon2, -382.97 , -82.26, color)[1];
    P161_lat = offset_well_3(degLat2, degLon2, -380.24 , -80.9, color)[0];	 P161_lon = offset_well_3(degLat2, degLon2, -380.24 , -80.9, color)[1];
    P162_lat = offset_well_3(degLat2, degLon2, -377.57 , -79.47, color)[0];	 P162_lon = offset_well_3(degLat2, degLon2, -377.57 , -79.47, color)[1];
    P163_lat = offset_well_3(degLat2, degLon2, -375 , -78, color)[0];	 P163_lon = offset_well_3(degLat2, degLon2, -375 , -78, color)[1];
    P164_lat = offset_well_3(degLat2, degLon2, -372.61 , -76.45, color)[0];	 P164_lon = offset_well_3(degLat2, degLon2, -372.61 , -76.45, color)[1];
    P165_lat = offset_well_3(degLat2, degLon2, -370.4 , -74.82, color)[0];	 P165_lon = offset_well_3(degLat2, degLon2, -370.4 , -74.82, color)[1];
    P166_lat = offset_well_3(degLat2, degLon2, -368.29 , -73.1, color)[0];	 P166_lon = offset_well_3(degLat2, degLon2, -368.29 , -73.1, color)[1];
    P167_lat = offset_well_3(degLat2, degLon2, -366.2 , -71.33, color)[0];	 P167_lon = offset_well_3(degLat2, degLon2, -366.2 , -71.33, color)[1];
    P168_lat = offset_well_3(degLat2, degLon2, -364.06 , -69.5, color)[0];	 P168_lon = offset_well_3(degLat2, degLon2, -364.06 , -69.5, color)[1];
    P169_lat = offset_well_3(degLat2, degLon2, -361.8 , -67.63, color)[0];	 P169_lon = offset_well_3(degLat2, degLon2, -361.8 , -67.63, color)[1];
    P170_lat = offset_well_3(degLat2, degLon2, -359.34 , -65.74, color)[0];	 P170_lon = offset_well_3(degLat2, degLon2, -359.34 , -65.74, color)[1];
    P171_lat = offset_well_3(degLat2, degLon2, -356.6 , -63.82, color)[0];	 P171_lon = offset_well_3(degLat2, degLon2, -356.6 , -63.82, color)[1];
    P172_lat = offset_well_3(degLat2, degLon2, -353.51 , -61.91, color)[0];	 P172_lon = offset_well_3(degLat2, degLon2, -353.51 , -61.91, color)[1];
    P173_lat = offset_well_3(degLat2, degLon2, -350 , -60, color)[0];	 P173_lon = offset_well_3(degLat2, degLon2, -350 , -60, color)[1];
    P174_lat = offset_well_3(degLat2, degLon2, -346.15 , -58.13, color)[0];	 P174_lon = offset_well_3(degLat2, degLon2, -346.15 , -58.13, color)[1];
    P175_lat = offset_well_3(degLat2, degLon2, -342.08 , -56.29, color)[0];	 P175_lon = offset_well_3(degLat2, degLon2, -342.08 , -56.29, color)[1];
    P176_lat = offset_well_3(degLat2, degLon2, -337.78 , -54.46, color)[0];	 P176_lon = offset_well_3(degLat2, degLon2, -337.78 , -54.46, color)[1];
    P177_lat = offset_well_3(degLat2, degLon2, -333.24 , -52.62, color)[0];	 P177_lon = offset_well_3(degLat2, degLon2, -333.24 , -52.62, color)[1];
    P178_lat = offset_well_3(degLat2, degLon2, -328.44 , -50.75, color)[0];	 P178_lon = offset_well_3(degLat2, degLon2, -328.44 , -50.75, color)[1];
    P179_lat = offset_well_3(degLat2, degLon2, -323.36 , -48.82, color)[0];	 P179_lon = offset_well_3(degLat2, degLon2, -323.36 , -48.82, color)[1];
    P180_lat = offset_well_3(degLat2, degLon2, -317.99 , -46.8, color)[0];	 P180_lon = offset_well_3(degLat2, degLon2, -317.99 , -46.8, color)[1];
    P181_lat = offset_well_3(degLat2, degLon2, -312.32 , -44.67, color)[0];	 P181_lon = offset_well_3(degLat2, degLon2, -312.32 , -44.67, color)[1];
    P182_lat = offset_well_3(degLat2, degLon2, -306.33 , -42.41, color)[0];	 P182_lon = offset_well_3(degLat2, degLon2, -306.33 , -42.41, color)[1];
    P183_lat = offset_well_3(degLat2, degLon2, -300 , -40, color)[0];	 P183_lon = offset_well_3(degLat2, degLon2, -300 , -40, color)[1];
    P184_lat = offset_well_3(degLat2, degLon2, -292.95 , -37.32, color)[0];	 P184_lon = offset_well_3(degLat2, degLon2, -292.95 , -37.32, color)[1];
    P185_lat = offset_well_3(degLat2, degLon2, -284.96 , -34.32, color)[0];	 P185_lon = offset_well_3(degLat2, degLon2, -284.96 , -34.32, color)[1];
    P186_lat = offset_well_3(degLat2, degLon2, -276.32 , -31.11, color)[0];	 P186_lon = offset_well_3(degLat2, degLon2, -276.32 , -31.11, color)[1];
    P187_lat = offset_well_3(degLat2, degLon2, -267.28 , -27.76, color)[0];	 P187_lon = offset_well_3(degLat2, degLon2, -267.28 , -27.76, color)[1];
    P188_lat = offset_well_3(degLat2, degLon2, -258.13 , -24.38, color)[0];	 P188_lon = offset_well_3(degLat2, degLon2, -258.13 , -24.38, color)[1];
    P189_lat = offset_well_3(degLat2, degLon2, -249.12 , -21.04, color)[0];	 P189_lon = offset_well_3(degLat2, degLon2, -249.12 , -21.04, color)[1];
    P190_lat = offset_well_3(degLat2, degLon2, -240.54 , -17.85, color)[0];	 P190_lon = offset_well_3(degLat2, degLon2, -240.54 , -17.85, color)[1];
    P191_lat = offset_well_3(degLat2, degLon2, -232.64 , -14.88, color)[0];	 P191_lon = offset_well_3(degLat2, degLon2, -232.64 , -14.88, color)[1];
    P192_lat = offset_well_3(degLat2, degLon2, -225.71 , -12.24, color)[0];	 P192_lon = offset_well_3(degLat2, degLon2, -225.71 , -12.24, color)[1];
    P193_lat = offset_well_3(degLat2, degLon2, -220 , -10, color)[0];	 P193_lon = offset_well_3(degLat2, degLon2, -220 , -10, color)[1];
    P194_lat = offset_well_3(degLat2, degLon2, -215.84 , -8.15, color)[0];	 P194_lon = offset_well_3(degLat2, degLon2, -215.84 , -8.15, color)[1];
    P195_lat = offset_well_3(degLat2, degLon2, -213.12 , -6.59, color)[0];	 P195_lon = offset_well_3(degLat2, degLon2, -213.12 , -6.59, color)[1];
    P196_lat = offset_well_3(degLat2, degLon2, -211.48 , -5.28, color)[0];	 P196_lon = offset_well_3(degLat2, degLon2, -211.48 , -5.28, color)[1];
    P197_lat = offset_well_3(degLat2, degLon2, -210.56 , -4.18, color)[0];	 P197_lon = offset_well_3(degLat2, degLon2, -210.56 , -4.18, color)[1];
    P198_lat = offset_well_3(degLat2, degLon2, -210 , -3.25, color)[0];	 P198_lon = offset_well_3(degLat2, degLon2, -210 , -3.25, color)[1];
    P199_lat = offset_well_3(degLat2, degLon2, -209.44 , -2.46, color)[0];	 P199_lon = offset_well_3(degLat2, degLon2, -209.44 , -2.46, color)[1];
    P200_lat = offset_well_3(degLat2, degLon2, -208.52 , -1.78, color)[0];	 P200_lon = offset_well_3(degLat2, degLon2, -208.52 , -1.78, color)[1];
    P201_lat = offset_well_3(degLat2, degLon2, -206.88 , -1.17, color)[0];	 P201_lon = offset_well_3(degLat2, degLon2, -206.88 , -1.17, color)[1];
    P202_lat = offset_well_3(degLat2, degLon2, -204.16 , -0.59, color)[0];	 P202_lon = offset_well_3(degLat2, degLon2, -204.16 , -0.59, color)[1];
    P203_lat = offset_well_3(degLat2, degLon2, -200 , 0, color)[0];	 P203_lon = offset_well_3(degLat2, degLon2, -200 , 0, color)[1];
    P204_lat = offset_well_3(degLat2, degLon2, -194.16 , 0.52, color)[0];	 P204_lon = offset_well_3(degLat2, degLon2, -194.16 , 0.52, color)[1];
    P205_lat = offset_well_3(degLat2, degLon2, -186.88 , 0.9, color)[0];	 P205_lon = offset_well_3(degLat2, degLon2, -186.88 , 0.9, color)[1];
    P206_lat = offset_well_3(degLat2, degLon2, -178.52 , 1.16, color)[0];	 P206_lon = offset_well_3(degLat2, degLon2, -178.52 , 1.16, color)[1];
    P207_lat = offset_well_3(degLat2, degLon2, -169.44 , 1.33, color)[0];	 P207_lon = offset_well_3(degLat2, degLon2, -169.44 , 1.33, color)[1];
    P208_lat = offset_well_3(degLat2, degLon2, -160 , 1.44, color)[0];	 P208_lon = offset_well_3(degLat2, degLon2, -160 , 1.44, color)[1];
    P209_lat = offset_well_3(degLat2, degLon2, -150.56 , 1.51, color)[0];	 P209_lon = offset_well_3(degLat2, degLon2, -150.56 , 1.51, color)[1];
    P210_lat = offset_well_3(degLat2, degLon2, -141.48 , 1.58, color)[0];	 P210_lon = offset_well_3(degLat2, degLon2, -141.48 , 1.58, color)[1];
    P211_lat = offset_well_3(degLat2, degLon2, -133.12 , 1.66, color)[0];	 P211_lon = offset_well_3(degLat2, degLon2, -133.12 , 1.66, color)[1];
    P212_lat = offset_well_3(degLat2, degLon2, -125.84 , 1.8, color)[0];	 P212_lon = offset_well_3(degLat2, degLon2, -125.84 , 1.8, color)[1];
    P213_lat = offset_well_3(degLat2, degLon2, -120 , 2, color)[0];	 P213_lon = offset_well_3(degLat2, degLon2, -120 , 2, color)[1];
    P214_lat = offset_well_3(degLat2, degLon2, -115.59 , 2.3, color)[0];	 P214_lon = offset_well_3(degLat2, degLon2, -115.59 , 2.3, color)[1];
    P215_lat = offset_well_3(degLat2, degLon2, -112.24 , 2.66, color)[0];	 P215_lon = offset_well_3(degLat2, degLon2, -112.24 , 2.66, color)[1];
    P216_lat = offset_well_3(degLat2, degLon2, -109.75 , 3.08, color)[0];	 P216_lon = offset_well_3(degLat2, degLon2, -109.75 , 3.08, color)[1];
    P217_lat = offset_well_3(degLat2, degLon2, -107.92 , 3.51, color)[0];	 P217_lon = offset_well_3(degLat2, degLon2, -107.92 , 3.51, color)[1];
    P218_lat = offset_well_3(degLat2, degLon2, -106.56 , 3.94, color)[0];	 P218_lon = offset_well_3(degLat2, degLon2, -106.56 , 3.94, color)[1];
    P219_lat = offset_well_3(degLat2, degLon2, -105.48 , 4.33, color)[0];	 P219_lon = offset_well_3(degLat2, degLon2, -105.48 , 4.33, color)[1];
    P220_lat = offset_well_3(degLat2, degLon2, -104.48 , 4.66, color)[0];	 P220_lon = offset_well_3(degLat2, degLon2, -104.48 , 4.66, color)[1];
    P221_lat = offset_well_3(degLat2, degLon2, -103.36 , 4.9, color)[0];	 P221_lon = offset_well_3(degLat2, degLon2, -103.36 , 4.9, color)[1];
    P222_lat = offset_well_3(degLat2, degLon2, -101.93 , 5.02, color)[0];	 P222_lon = offset_well_3(degLat2, degLon2, -101.93 , 5.02, color)[1];
    P223_lat = offset_well_3(degLat2, degLon2, -100 , 5, color)[0];	 P223_lon = offset_well_3(degLat2, degLon2, -100 , 5, color)[1];
    P224_lat = offset_well_3(degLat2, degLon2, -97.7 , 4.78, color)[0];	 P224_lon = offset_well_3(degLat2, degLon2, -97.7 , 4.78, color)[1];
    P225_lat = offset_well_3(degLat2, degLon2, -95.32 , 4.35, color)[0];	 P225_lon = offset_well_3(degLat2, degLon2, -95.32 , 4.35, color)[1];
    P226_lat = offset_well_3(degLat2, degLon2, -92.87 , 3.77, color)[0];	 P226_lon = offset_well_3(degLat2, degLon2, -92.87 , 3.77, color)[1];
    P227_lat = offset_well_3(degLat2, degLon2, -90.36 , 3.1, color)[0];	 P227_lon = offset_well_3(degLat2, degLon2, -90.36 , 3.1, color)[1];
    P228_lat = offset_well_3(degLat2, degLon2, -87.81 , 2.38, color)[0];	 P228_lon = offset_well_3(degLat2, degLon2, -87.81 , 2.38, color)[1];
    P229_lat = offset_well_3(degLat2, degLon2, -85.24 , 1.66, color)[0];	 P229_lon = offset_well_3(degLat2, degLon2, -85.24 , 1.66, color)[1];
    P230_lat = offset_well_3(degLat2, degLon2, -82.66 , 1.02, color)[0];	 P230_lon = offset_well_3(degLat2, degLon2, -82.66 , 1.02, color)[1];
    P231_lat = offset_well_3(degLat2, degLon2, -80.08 , 0.49, color)[0];	 P231_lon = offset_well_3(degLat2, degLon2, -80.08 , 0.49, color)[1];
    P232_lat = offset_well_3(degLat2, degLon2, -77.52 , 0.13, color)[0];	 P232_lon = offset_well_3(degLat2, degLon2, -77.52 , 0.13, color)[1];
    P233_lat = offset_well_3(degLat2, degLon2, -75 , 0, color)[0];	 P233_lon = offset_well_3(degLat2, degLon2, -75 , 0, color)[1];
    P234_lat = offset_well_3(degLat2, degLon2, -72.61 , 0.14, color)[0];	 P234_lon = offset_well_3(degLat2, degLon2, -72.61 , 0.14, color)[1];
    P235_lat = offset_well_3(degLat2, degLon2, -70.4 , 0.52, color)[0];	 P235_lon = offset_well_3(degLat2, degLon2, -70.4 , 0.52, color)[1];
    P236_lat = offset_well_3(degLat2, degLon2, -68.29 , 1.08, color)[0];	 P236_lon = offset_well_3(degLat2, degLon2, -68.29 , 1.08, color)[1];
    P237_lat = offset_well_3(degLat2, degLon2, -66.2 , 1.76, color)[0];	 P237_lon = offset_well_3(degLat2, degLon2, -66.2 , 1.76, color)[1];
    P238_lat = offset_well_3(degLat2, degLon2, -64.06 , 2.5, color)[0];	 P238_lon = offset_well_3(degLat2, degLon2, -64.06 , 2.5, color)[1];
    P239_lat = offset_well_3(degLat2, degLon2, -61.8 , 3.24, color)[0];	 P239_lon = offset_well_3(degLat2, degLon2, -61.8 , 3.24, color)[1];
    P240_lat = offset_well_3(degLat2, degLon2, -59.34 , 3.92, color)[0];	 P240_lon = offset_well_3(degLat2, degLon2, -59.34 , 3.92, color)[1];
    P241_lat = offset_well_3(degLat2, degLon2, -56.6 , 4.48, color)[0];	 P241_lon = offset_well_3(degLat2, degLon2, -56.6 , 4.48, color)[1];
    P242_lat = offset_well_3(degLat2, degLon2, -53.51 , 4.86, color)[0];	 P242_lon = offset_well_3(degLat2, degLon2, -53.51 , 4.86, color)[1];
    P243_lat = offset_well_3(degLat2, degLon2, -50 , 5, color)[0];	 P243_lon = offset_well_3(degLat2, degLon2, -50 , 5, color)[1];
    P244_lat = offset_well_3(degLat2, degLon2, -40.8 , 4.56, color)[0];	 P244_lon = offset_well_3(degLat2, degLon2, -40.8 , 4.56, color)[1];
    P245_lat = offset_well_3(degLat2, degLon2, -35.26 , 4.08, color)[0];	 P245_lon = offset_well_3(degLat2, degLon2, -35.26 , 4.08, color)[1];
    P246_lat = offset_well_3(degLat2, degLon2, -29.4 , 3.48, color)[0];	 P246_lon = offset_well_3(degLat2, degLon2, -29.4 , 3.48, color)[1];
    P247_lat = offset_well_3(degLat2, degLon2, -23.44 , 2.81, color)[0];	 P247_lon = offset_well_3(degLat2, degLon2, -23.44 , 2.81, color)[1];
    P248_lat = offset_well_3(degLat2, degLon2, -17.6 , 2.12, color)[0];	 P248_lon = offset_well_3(degLat2, degLon2, -17.6 , 2.12, color)[1];
    P249_lat = offset_well_3(degLat2, degLon2, -12.11 , 1.45, color)[0];	 P249_lon = offset_well_3(degLat2, degLon2, -12.11 , 1.45, color)[1];
    P250_lat = offset_well_3(degLat2, degLon2, -7.2 , 0.84, color)[0];	 P250_lon = offset_well_3(degLat2, degLon2, -7.2 , 0.84, color)[1];
    P251_lat = offset_well_3(degLat2, degLon2, -3.09 , 0.34, color)[0];	 P251_lon = offset_well_3(degLat2, degLon2, -3.09 , 0.34, color)[1];
    P252_lat = offset_well_3(degLat2, degLon2, 0 , 0, color)[0];	 P252_lon = offset_well_3(degLat2, degLon2, 0 , 0, color)[1];

    L.polygon([

    [P1_lat, P1_lon],
    [P2_lat, P2_lon],
    [P3_lat, P3_lon],
    [P4_lat, P4_lon],
    [P5_lat, P5_lon],
    [P6_lat, P6_lon],
    [P7_lat, P7_lon],
    [P8_lat, P8_lon],
    [P9_lat, P9_lon],
    [P10_lat, P10_lon],
    [P11_lat, P11_lon],
    [P12_lat, P12_lon],
    [P13_lat, P13_lon],
    [P14_lat, P14_lon],
    [P15_lat, P15_lon],
    [P16_lat, P16_lon],
    [P17_lat, P17_lon],
    [P18_lat, P18_lon],
    [P19_lat, P19_lon],
    [P20_lat, P20_lon],
    [P21_lat, P21_lon],
    [P22_lat, P22_lon],
    [P23_lat, P23_lon],
    [P24_lat, P24_lon],
    [P25_lat, P25_lon],
    [P26_lat, P26_lon],
    [P27_lat, P27_lon],
    [P28_lat, P28_lon],
    [P29_lat, P29_lon],
    [P30_lat, P30_lon],
    [P31_lat, P31_lon],
    [P32_lat, P32_lon],
    [P33_lat, P33_lon],
    [P34_lat, P34_lon],
    [P35_lat, P35_lon],
    [P36_lat, P36_lon],
    [P37_lat, P37_lon],
    [P38_lat, P38_lon],
    [P39_lat, P39_lon],
    [P40_lat, P40_lon],
    [P41_lat, P41_lon],
    [P42_lat, P42_lon],
    [P43_lat, P43_lon],
    [P44_lat, P44_lon],
    [P45_lat, P45_lon],
    [P46_lat, P46_lon],
    [P47_lat, P47_lon],
    [P48_lat, P48_lon],
    [P49_lat, P49_lon],
    [P50_lat, P50_lon],
    [P51_lat, P51_lon],
    [P52_lat, P52_lon],
    [P53_lat, P53_lon],
    [P54_lat, P54_lon],
    [P55_lat, P55_lon],
    [P56_lat, P56_lon],
    [P57_lat, P57_lon],
    [P58_lat, P58_lon],
    [P59_lat, P59_lon],
    [P60_lat, P60_lon],
    [P61_lat, P61_lon],
    [P62_lat, P62_lon],
    [P63_lat, P63_lon],
    [P64_lat, P64_lon],
    [P65_lat, P65_lon],
    [P66_lat, P66_lon],
    [P67_lat, P67_lon],
    [P68_lat, P68_lon],
    [P69_lat, P69_lon],
    [P70_lat, P70_lon],
    [P71_lat, P71_lon],
    [P72_lat, P72_lon],
    [P73_lat, P73_lon],
    [P74_lat, P74_lon],
    [P75_lat, P75_lon],
    [P76_lat, P76_lon],
    [P77_lat, P77_lon],
    [P78_lat, P78_lon],
    [P79_lat, P79_lon],
    [P80_lat, P80_lon],
    [P81_lat, P81_lon],
    [P82_lat, P82_lon],
    [P83_lat, P83_lon],
    [P84_lat, P84_lon],
    [P85_lat, P85_lon],
    [P86_lat, P86_lon],
    [P87_lat, P87_lon],
    [P88_lat, P88_lon],
    [P89_lat, P89_lon],
    [P90_lat, P90_lon],
    [P91_lat, P91_lon],
    [P92_lat, P92_lon],
    [P93_lat, P93_lon],
    [P94_lat, P94_lon],
    [P95_lat, P95_lon],
    [P96_lat, P96_lon],
    [P97_lat, P97_lon],
    [P98_lat, P98_lon],
    [P99_lat, P99_lon],
    [P100_lat, P100_lon],
    [P101_lat, P101_lon],
    [P102_lat, P102_lon],
    [P103_lat, P103_lon],
    [P104_lat, P104_lon],
    [P105_lat, P105_lon],
    [P106_lat, P106_lon],
    [P107_lat, P107_lon],
    [P108_lat, P108_lon],
    [P109_lat, P109_lon],
    [P110_lat, P110_lon],
    [P111_lat, P111_lon],
    [P112_lat, P112_lon],
    [P113_lat, P113_lon],
    [P114_lat, P114_lon],
    [P115_lat, P115_lon],
    [P116_lat, P116_lon],
    [P117_lat, P117_lon],
    [P118_lat, P118_lon],
    [P119_lat, P119_lon],
    [P120_lat, P120_lon],
    [P121_lat, P121_lon],
    [P122_lat, P122_lon],
    [P123_lat, P123_lon],
    [P124_lat, P124_lon],
    [P125_lat, P125_lon],
    [P126_lat, P126_lon],
    [P127_lat, P127_lon],
    [P128_lat, P128_lon],
    [P129_lat, P129_lon],
    [P130_lat, P130_lon],
    [P131_lat, P131_lon],
    [P132_lat, P132_lon],
    [P133_lat, P133_lon],
    [P134_lat, P134_lon],
    [P135_lat, P135_lon],
    [P136_lat, P136_lon],
    [P137_lat, P137_lon],
    [P138_lat, P138_lon],
    [P139_lat, P139_lon],
    [P140_lat, P140_lon],
    [P141_lat, P141_lon],
    [P142_lat, P142_lon],
    [P143_lat, P143_lon],
    [P144_lat, P144_lon],
    [P145_lat, P145_lon],
    [P146_lat, P146_lon],
    [P147_lat, P147_lon],
    [P148_lat, P148_lon],
    [P149_lat, P149_lon],
    [P150_lat, P150_lon],
    [P151_lat, P151_lon],
    [P152_lat, P152_lon],
    [P153_lat, P153_lon],
    [P154_lat, P154_lon],
    [P155_lat, P155_lon],
    [P156_lat, P156_lon],
    [P157_lat, P157_lon],
    [P158_lat, P158_lon],
    [P159_lat, P159_lon],
    [P160_lat, P160_lon],
    [P161_lat, P161_lon],
    [P162_lat, P162_lon],
    [P163_lat, P163_lon],
    [P164_lat, P164_lon],
    [P165_lat, P165_lon],
    [P166_lat, P166_lon],
    [P167_lat, P167_lon],
    [P168_lat, P168_lon],
    [P169_lat, P169_lon],
    [P170_lat, P170_lon],
    [P171_lat, P171_lon],
    [P172_lat, P172_lon],
    [P173_lat, P173_lon],
    [P174_lat, P174_lon],
    [P175_lat, P175_lon],
    [P176_lat, P176_lon],
    [P177_lat, P177_lon],
    [P178_lat, P178_lon],
    [P179_lat, P179_lon],
    [P180_lat, P180_lon],
    [P181_lat, P181_lon],
    [P182_lat, P182_lon],
    [P183_lat, P183_lon],
    [P184_lat, P184_lon],
    [P185_lat, P185_lon],
    [P186_lat, P186_lon],
    [P187_lat, P187_lon],
    [P188_lat, P188_lon],
    [P189_lat, P189_lon],
    [P190_lat, P190_lon],
    [P191_lat, P191_lon],
    [P192_lat, P192_lon],
    [P193_lat, P193_lon],
    [P194_lat, P194_lon],
    [P195_lat, P195_lon],
    [P196_lat, P196_lon],
    [P197_lat, P197_lon],
    [P198_lat, P198_lon],
    [P199_lat, P199_lon],
    [P200_lat, P200_lon],
    [P201_lat, P201_lon],
    [P202_lat, P202_lon],
    [P203_lat, P203_lon],
    [P204_lat, P204_lon],
    [P205_lat, P205_lon],
    [P206_lat, P206_lon],
    [P207_lat, P207_lon],
    [P208_lat, P208_lon],
    [P209_lat, P209_lon],
    [P210_lat, P210_lon],
    [P211_lat, P211_lon],
    [P212_lat, P212_lon],
    [P213_lat, P213_lon],
    [P214_lat, P214_lon],
    [P215_lat, P215_lon],
    [P216_lat, P216_lon],
    [P217_lat, P217_lon],
    [P218_lat, P218_lon],
    [P219_lat, P219_lon],
    [P220_lat, P220_lon],
    [P221_lat, P221_lon],
    [P222_lat, P222_lon],
    [P223_lat, P223_lon],
    [P224_lat, P224_lon],
    [P225_lat, P225_lon],
    [P226_lat, P226_lon],
    [P227_lat, P227_lon],
    [P228_lat, P228_lon],
    [P229_lat, P229_lon],
    [P230_lat, P230_lon],
    [P231_lat, P231_lon],
    [P232_lat, P232_lon],
    [P233_lat, P233_lon],
    [P234_lat, P234_lon],
    [P235_lat, P235_lon],
    [P236_lat, P236_lon],
    [P237_lat, P237_lon],
    [P238_lat, P238_lon],
    [P239_lat, P239_lon],
    [P240_lat, P240_lon],
    [P241_lat, P241_lon],
    [P242_lat, P242_lon],
    [P243_lat, P243_lon],
    [P244_lat, P244_lon],
    [P245_lat, P245_lon],
    [P246_lat, P246_lon],
    [P247_lat, P247_lon],
    [P248_lat, P248_lon],
    [P249_lat, P249_lon],
    [P250_lat, P250_lon],
    [P251_lat, P251_lon],
    [P252_lat, P252_lon]

  ], {
    color: color,
    fillColor: color,
    fillOpacity: 0.7,
  }).addTo(map);
  //======================================================


  map.flyTo([heelLatitude,heelLongitude],15);
})


function onMapClick(e) {
  document.getElementById('alertText').innerText = "Coordinates: " + e.latlng
  document.getElementById('alertClick').hidden=false
}
map.on('click', onMapClick);