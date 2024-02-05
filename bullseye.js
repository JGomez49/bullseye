
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
    fillOpacity: 0.1,
  }).addTo(map);
  //=======================================================

  






  // Naranjas:--------------------------------------------
  color = 'orange'

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
  fillOpacity: 0.7,
}).addTo(map);
  //=======================================================







  


  // Verdes:--------------------------------------------
    color= 'green';

    P1_lat = offset_well_3(degLat2, degLon2, 0 , 120, color)[0];	 P1_lon = offset_well_3(degLat2, degLon2, 0 , 120, color)[1];
    P2_lat = offset_well_3(degLat2, degLon2, 3.09 , 119.5, color)[0];	 P2_lon = offset_well_3(degLat2, degLon2, 3.09 , 119.5, color)[1];
    P3_lat = offset_well_3(degLat2, degLon2, 7.2 , 118.96, color)[0];	 P3_lon = offset_well_3(degLat2, degLon2, 7.2 , 118.96, color)[1];
    P4_lat = offset_well_3(degLat2, degLon2, 12.11 , 118.37, color)[0];	 P4_lon = offset_well_3(degLat2, degLon2, 12.11 , 118.37, color)[1];
    P5_lat = offset_well_3(degLat2, degLon2, 17.6 , 117.68, color)[0];	 P5_lon = offset_well_3(degLat2, degLon2, 17.6 , 117.68, color)[1];
    P6_lat = offset_well_3(degLat2, degLon2, 23.44 , 116.88, color)[0];	 P6_lon = offset_well_3(degLat2, degLon2, 23.44 , 116.88, color)[1];
    P7_lat = offset_well_3(degLat2, degLon2, 29.4 , 115.92, color)[0];	 P7_lon = offset_well_3(degLat2, degLon2, 29.4 , 115.92, color)[1];
    P8_lat = offset_well_3(degLat2, degLon2, 35.26 , 114.79, color)[0];	 P8_lon = offset_well_3(degLat2, degLon2, 35.26 , 114.79, color)[1];
    P9_lat = offset_well_3(degLat2, degLon2, 40.8 , 113.44, color)[0];	 P9_lon = offset_well_3(degLat2, degLon2, 40.8 , 113.44, color)[1];
    P10_lat = offset_well_3(degLat2, degLon2, 50 , 110, color)[0];	 P10_lon = offset_well_3(degLat2, degLon2, 50 , 110, color)[1];
    P11_lat = offset_well_3(degLat2, degLon2, 53.51 , 107.81, color)[0];	 P11_lon = offset_well_3(degLat2, degLon2, 53.51 , 107.81, color)[1];
    P12_lat = offset_well_3(degLat2, degLon2, 56.6 , 105.28, color)[0];	 P12_lon = offset_well_3(degLat2, degLon2, 56.6 , 105.28, color)[1];
    P13_lat = offset_well_3(degLat2, degLon2, 59.34 , 102.47, color)[0];	 P13_lon = offset_well_3(degLat2, degLon2, 59.34 , 102.47, color)[1];
    P14_lat = offset_well_3(degLat2, degLon2, 61.8 , 99.44, color)[0];	 P14_lon = offset_well_3(degLat2, degLon2, 61.8 , 99.44, color)[1];
    P15_lat = offset_well_3(degLat2, degLon2, 64.06 , 96.25, color)[0];	 P15_lon = offset_well_3(degLat2, degLon2, 64.06 , 96.25, color)[1];
    P16_lat = offset_well_3(degLat2, degLon2, 66.2 , 92.96, color)[0];	 P16_lon = offset_well_3(degLat2, degLon2, 66.2 , 92.96, color)[1];
    P17_lat = offset_well_3(degLat2, degLon2, 68.29 , 89.63, color)[0];	 P17_lon = offset_well_3(degLat2, degLon2, 68.29 , 89.63, color)[1];
    P18_lat = offset_well_3(degLat2, degLon2, 70.4 , 86.32, color)[0];	 P18_lon = offset_well_3(degLat2, degLon2, 70.4 , 86.32, color)[1];
    P19_lat = offset_well_3(degLat2, degLon2, 72.61 , 83.09, color)[0];	 P19_lon = offset_well_3(degLat2, degLon2, 72.61 , 83.09, color)[1];
    P20_lat = offset_well_3(degLat2, degLon2, 75 , 80, color)[0];	 P20_lon = offset_well_3(degLat2, degLon2, 75 , 80, color)[1];
    P21_lat = offset_well_3(degLat2, degLon2, 77.39 , 76.89, color)[0];	 P21_lon = offset_well_3(degLat2, degLon2, 77.39 , 76.89, color)[1];
    P22_lat = offset_well_3(degLat2, degLon2, 79.6 , 73.6, color)[0];	 P22_lon = offset_well_3(degLat2, degLon2, 79.6 , 73.6, color)[1];
    P23_lat = offset_well_3(degLat2, degLon2, 81.71 , 70.21, color)[0];	 P23_lon = offset_well_3(degLat2, degLon2, 81.71 , 70.21, color)[1];
    P24_lat = offset_well_3(degLat2, degLon2, 83.8 , 66.8, color)[0];	 P24_lon = offset_well_3(degLat2, degLon2, 83.8 , 66.8, color)[1];
    P25_lat = offset_well_3(degLat2, degLon2, 85.94 , 63.44, color)[0];	 P25_lon = offset_well_3(degLat2, degLon2, 85.94 , 63.44, color)[1];
    P26_lat = offset_well_3(degLat2, degLon2, 88.2 , 60.2, color)[0];	 P26_lon = offset_well_3(degLat2, degLon2, 88.2 , 60.2, color)[1];
    P27_lat = offset_well_3(degLat2, degLon2, 90.66 , 57.16, color)[0];	 P27_lon = offset_well_3(degLat2, degLon2, 90.66 , 57.16, color)[1];
    P28_lat = offset_well_3(degLat2, degLon2, 93.4 , 54.4, color)[0];	 P28_lon = offset_well_3(degLat2, degLon2, 93.4 , 54.4, color)[1];
    P29_lat = offset_well_3(degLat2, degLon2, 96.49 , 51.99, color)[0];	 P29_lon = offset_well_3(degLat2, degLon2, 96.49 , 51.99, color)[1];
    P30_lat = offset_well_3(degLat2, degLon2, 100 , 50, color)[0];	 P30_lon = offset_well_3(degLat2, degLon2, 100 , 50, color)[1];
    P31_lat = offset_well_3(degLat2, degLon2, 103.99 , 48.33, color)[0];	 P31_lon = offset_well_3(degLat2, degLon2, 103.99 , 48.33, color)[1];
    P32_lat = offset_well_3(degLat2, degLon2, 108.4 , 46.84, color)[0];	 P32_lon = offset_well_3(degLat2, degLon2, 108.4 , 46.84, color)[1];
    P33_lat = offset_well_3(degLat2, degLon2, 113.16 , 45.56, color)[0];	 P33_lon = offset_well_3(degLat2, degLon2, 113.16 , 45.56, color)[1];
    P34_lat = offset_well_3(degLat2, degLon2, 118.2 , 44.52, color)[0];	 P34_lon = offset_well_3(degLat2, degLon2, 118.2 , 44.52, color)[1];
    P35_lat = offset_well_3(degLat2, degLon2, 123.44 , 43.75, color)[0];	 P35_lon = offset_well_3(degLat2, degLon2, 123.44 , 43.75, color)[1];
    P36_lat = offset_well_3(degLat2, degLon2, 128.8 , 43.28, color)[0];	 P36_lon = offset_well_3(degLat2, degLon2, 128.8 , 43.28, color)[1];
    P37_lat = offset_well_3(degLat2, degLon2, 134.21 , 43.14, color)[0];	 P37_lon = offset_well_3(degLat2, degLon2, 134.21 , 43.14, color)[1];
    P38_lat = offset_well_3(degLat2, degLon2, 139.6 , 43.36, color)[0];	 P38_lon = offset_well_3(degLat2, degLon2, 139.6 , 43.36, color)[1];
    P39_lat = offset_well_3(degLat2, degLon2, 144.89 , 43.97, color)[0];	 P39_lon = offset_well_3(degLat2, degLon2, 144.89 , 43.97, color)[1];
    P40_lat = offset_well_3(degLat2, degLon2, 150 , 45, color)[0];	 P40_lon = offset_well_3(degLat2, degLon2, 150 , 45, color)[1];
    P41_lat = offset_well_3(degLat2, degLon2, 155 , 46.74, color)[0];	 P41_lon = offset_well_3(degLat2, degLon2, 155 , 46.74, color)[1];
    P42_lat = offset_well_3(degLat2, degLon2, 160 , 49.32, color)[0];	 P42_lon = offset_well_3(degLat2, degLon2, 160 , 49.32, color)[1];
    P43_lat = offset_well_3(degLat2, degLon2, 165 , 52.53, color)[0];	 P43_lon = offset_well_3(degLat2, degLon2, 165 , 52.53, color)[1];
    P44_lat = offset_well_3(degLat2, degLon2, 170 , 56.16, color)[0];	 P44_lon = offset_well_3(degLat2, degLon2, 170 , 56.16, color)[1];
    P45_lat = offset_well_3(degLat2, degLon2, 175 , 60, color)[0];	 P45_lon = offset_well_3(degLat2, degLon2, 175 , 60, color)[1];
    P46_lat = offset_well_3(degLat2, degLon2, 180 , 63.84, color)[0];	 P46_lon = offset_well_3(degLat2, degLon2, 180 , 63.84, color)[1];
    P47_lat = offset_well_3(degLat2, degLon2, 185 , 67.47, color)[0];	 P47_lon = offset_well_3(degLat2, degLon2, 185 , 67.47, color)[1];
    P48_lat = offset_well_3(degLat2, degLon2, 190 , 70.68, color)[0];	 P48_lon = offset_well_3(degLat2, degLon2, 190 , 70.68, color)[1];
    P49_lat = offset_well_3(degLat2, degLon2, 195 , 73.26, color)[0];	 P49_lon = offset_well_3(degLat2, degLon2, 195 , 73.26, color)[1];
    P50_lat = offset_well_3(degLat2, degLon2, 200 , 75, color)[0];	 P50_lon = offset_well_3(degLat2, degLon2, 200 , 75, color)[1];
    P51_lat = offset_well_3(degLat2, degLon2, 205 , 75.99, color)[0];	 P51_lon = offset_well_3(degLat2, degLon2, 205 , 75.99, color)[1];
    P52_lat = offset_well_3(degLat2, degLon2, 210 , 76.48, color)[0];	 P52_lon = offset_well_3(degLat2, degLon2, 210 , 76.48, color)[1];
    P53_lat = offset_well_3(degLat2, degLon2, 215 , 76.55, color)[0];	 P53_lon = offset_well_3(degLat2, degLon2, 215 , 76.55, color)[1];
    P54_lat = offset_well_3(degLat2, degLon2, 220 , 76.24, color)[0];	 P54_lon = offset_well_3(degLat2, degLon2, 220 , 76.24, color)[1];
    P55_lat = offset_well_3(degLat2, degLon2, 225 , 75.63, color)[0];	 P55_lon = offset_well_3(degLat2, degLon2, 225 , 75.63, color)[1];
    P56_lat = offset_well_3(degLat2, degLon2, 230 , 74.76, color)[0];	 P56_lon = offset_well_3(degLat2, degLon2, 230 , 74.76, color)[1];
    P57_lat = offset_well_3(degLat2, degLon2, 235 , 73.71, color)[0];	 P57_lon = offset_well_3(degLat2, degLon2, 235 , 73.71, color)[1];
    P58_lat = offset_well_3(degLat2, degLon2, 240 , 72.52, color)[0];	 P58_lon = offset_well_3(degLat2, degLon2, 240 , 72.52, color)[1];
    P59_lat = offset_well_3(degLat2, degLon2, 245 , 71.27, color)[0];	 P59_lon = offset_well_3(degLat2, degLon2, 245 , 71.27, color)[1];
    P60_lat = offset_well_3(degLat2, degLon2, 250 , 70, color)[0];	 P60_lon = offset_well_3(degLat2, degLon2, 250 , 70, color)[1];
    P61_lat = offset_well_3(degLat2, degLon2, 255 , 68.47, color)[0];	 P61_lon = offset_well_3(degLat2, degLon2, 255 , 68.47, color)[1];
    P62_lat = offset_well_3(degLat2, degLon2, 260 , 66.48, color)[0];	 P62_lon = offset_well_3(degLat2, degLon2, 260 , 66.48, color)[1];
    P63_lat = offset_well_3(degLat2, degLon2, 265 , 64.16, color)[0];	 P63_lon = offset_well_3(degLat2, degLon2, 265 , 64.16, color)[1];
    P64_lat = offset_well_3(degLat2, degLon2, 270 , 61.64, color)[0];	 P64_lon = offset_well_3(degLat2, degLon2, 270 , 61.64, color)[1];
    P65_lat = offset_well_3(degLat2, degLon2, 275 , 59.06, color)[0];	 P65_lon = offset_well_3(degLat2, degLon2, 275 , 59.06, color)[1];
    P66_lat = offset_well_3(degLat2, degLon2, 280 , 56.56, color)[0];	 P66_lon = offset_well_3(degLat2, degLon2, 280 , 56.56, color)[1];
    P67_lat = offset_well_3(degLat2, degLon2, 285 , 54.27, color)[0];	 P67_lon = offset_well_3(degLat2, degLon2, 285 , 54.27, color)[1];
    P68_lat = offset_well_3(degLat2, degLon2, 290 , 52.32, color)[0];	 P68_lon = offset_well_3(degLat2, degLon2, 290 , 52.32, color)[1];
    P69_lat = offset_well_3(degLat2, degLon2, 295 , 50.85, color)[0];	 P69_lon = offset_well_3(degLat2, degLon2, 295 , 50.85, color)[1];
    P70_lat = offset_well_3(degLat2, degLon2, 300 , 50, color)[0];	 P70_lon = offset_well_3(degLat2, degLon2, 300 , 50, color)[1];
    P71_lat = offset_well_3(degLat2, degLon2, 305.11 , 49.56, color)[0];	 P71_lon = offset_well_3(degLat2, degLon2, 305.11 , 49.56, color)[1];
    P72_lat = offset_well_3(degLat2, degLon2, 310.4 , 49.28, color)[0];	 P72_lon = offset_well_3(degLat2, degLon2, 310.4 , 49.28, color)[1];
    P73_lat = offset_well_3(degLat2, degLon2, 315.79 , 49.22, color)[0];	 P73_lon = offset_well_3(degLat2, degLon2, 315.79 , 49.22, color)[1];
    P74_lat = offset_well_3(degLat2, degLon2, 321.2 , 49.44, color)[0];	 P74_lon = offset_well_3(degLat2, degLon2, 321.2 , 49.44, color)[1];
    P75_lat = offset_well_3(degLat2, degLon2, 326.56 , 50, color)[0];	 P75_lon = offset_well_3(degLat2, degLon2, 326.56 , 50, color)[1];
    P76_lat = offset_well_3(degLat2, degLon2, 331.8 , 50.96, color)[0];	 P76_lon = offset_well_3(degLat2, degLon2, 331.8 , 50.96, color)[1];
    P77_lat = offset_well_3(degLat2, degLon2, 336.84 , 52.38, color)[0];	 P77_lon = offset_well_3(degLat2, degLon2, 336.84 , 52.38, color)[1];
    P78_lat = offset_well_3(degLat2, degLon2, 341.6 , 54.32, color)[0];	 P78_lon = offset_well_3(degLat2, degLon2, 341.6 , 54.32, color)[1];
    P79_lat = offset_well_3(degLat2, degLon2, 346.01 , 56.84, color)[0];	 P79_lon = offset_well_3(degLat2, degLon2, 346.01 , 56.84, color)[1];
    P80_lat = offset_well_3(degLat2, degLon2, 350 , 60, color)[0];	 P80_lon = offset_well_3(degLat2, degLon2, 350 , 60, color)[1];
    P81_lat = offset_well_3(degLat2, degLon2, 353.51 , 64.34, color)[0];	 P81_lon = offset_well_3(degLat2, degLon2, 353.51 , 64.34, color)[1];
    P82_lat = offset_well_3(degLat2, degLon2, 356.6 , 70.08, color)[0];	 P82_lon = offset_well_3(degLat2, degLon2, 356.6 , 70.08, color)[1];
    P83_lat = offset_well_3(degLat2, degLon2, 359.34 , 76.85, color)[0];	 P83_lon = offset_well_3(degLat2, degLon2, 359.34 , 76.85, color)[1];
    P84_lat = offset_well_3(degLat2, degLon2, 361.8 , 84.24, color)[0];	 P84_lon = offset_well_3(degLat2, degLon2, 361.8 , 84.24, color)[1];
    P85_lat = offset_well_3(degLat2, degLon2, 364.06 , 91.88, color)[0];	 P85_lon = offset_well_3(degLat2, degLon2, 364.06 , 91.88, color)[1];
    P86_lat = offset_well_3(degLat2, degLon2, 366.2 , 99.36, color)[0];	 P86_lon = offset_well_3(degLat2, degLon2, 366.2 , 99.36, color)[1];
    P87_lat = offset_well_3(degLat2, degLon2, 368.29 , 106.31, color)[0];	 P87_lon = offset_well_3(degLat2, degLon2, 368.29 , 106.31, color)[1];
    P88_lat = offset_well_3(degLat2, degLon2, 370.4 , 112.32, color)[0];	 P88_lon = offset_well_3(degLat2, degLon2, 370.4 , 112.32, color)[1];
    P89_lat = offset_well_3(degLat2, degLon2, 372.61 , 117.02, color)[0];	 P89_lon = offset_well_3(degLat2, degLon2, 372.61 , 117.02, color)[1];
    P90_lat = offset_well_3(degLat2, degLon2, 375 , 120, color)[0];	 P90_lon = offset_well_3(degLat2, degLon2, 375 , 120, color)[1];
    P91_lat = offset_well_3(degLat2, degLon2, 377.57 , 121.33, color)[0];	 P91_lon = offset_well_3(degLat2, degLon2, 377.57 , 121.33, color)[1];
    P92_lat = offset_well_3(degLat2, degLon2, 380.24 , 121.44, color)[0];	 P92_lon = offset_well_3(degLat2, degLon2, 380.24 , 121.44, color)[1];
    P93_lat = offset_well_3(degLat2, degLon2, 382.97 , 120.51, color)[0];	 P93_lon = offset_well_3(degLat2, degLon2, 382.97 , 120.51, color)[1];
    P94_lat = offset_well_3(degLat2, degLon2, 385.72 , 118.72, color)[0];	 P94_lon = offset_well_3(degLat2, degLon2, 385.72 , 118.72, color)[1];
    P95_lat = offset_well_3(degLat2, degLon2, 388.44 , 116.25, color)[0];	 P95_lon = offset_well_3(degLat2, degLon2, 388.44 , 116.25, color)[1];
    P96_lat = offset_well_3(degLat2, degLon2, 391.08 , 113.28, color)[0];	 P96_lon = offset_well_3(degLat2, degLon2, 391.08 , 113.28, color)[1];
    P97_lat = offset_well_3(degLat2, degLon2, 393.6 , 109.99, color)[0];	 P97_lon = offset_well_3(degLat2, degLon2, 393.6 , 109.99, color)[1];
    P98_lat = offset_well_3(degLat2, degLon2, 395.96 , 106.56, color)[0];	 P98_lon = offset_well_3(degLat2, degLon2, 395.96 , 106.56, color)[1];
    P99_lat = offset_well_3(degLat2, degLon2, 398.11 , 103.17, color)[0];	 P99_lon = offset_well_3(degLat2, degLon2, 398.11 , 103.17, color)[1];
    P100_lat = offset_well_3(degLat2, degLon2, 400 , 100, color)[0];	 P100_lon = offset_well_3(degLat2, degLon2, 400 , 100, color)[1];
    P101_lat = offset_well_3(degLat2, degLon2, 401.61 , 96.9, color)[0];	 P101_lon = offset_well_3(degLat2, degLon2, 401.61 , 96.9, color)[1];
    P102_lat = offset_well_3(degLat2, degLon2, 402.96 , 93.6, color)[0];	 P102_lon = offset_well_3(degLat2, degLon2, 402.96 , 93.6, color)[1];
    P103_lat = offset_well_3(degLat2, degLon2, 404.1 , 90.1, color)[0];	 P103_lon = offset_well_3(degLat2, degLon2, 404.1 , 90.1, color)[1];
    P104_lat = offset_well_3(degLat2, degLon2, 405.08 , 86.4, color)[0];	 P104_lon = offset_well_3(degLat2, degLon2, 405.08 , 86.4, color)[1];
    P105_lat = offset_well_3(degLat2, degLon2, 405.94 , 82.5, color)[0];	 P105_lon = offset_well_3(degLat2, degLon2, 405.94 , 82.5, color)[1];
    P106_lat = offset_well_3(degLat2, degLon2, 406.72 , 78.4, color)[0];	 P106_lon = offset_well_3(degLat2, degLon2, 406.72 , 78.4, color)[1];
    P107_lat = offset_well_3(degLat2, degLon2, 407.47 , 74.1, color)[0];	 P107_lon = offset_well_3(degLat2, degLon2, 407.47 , 74.1, color)[1];
    P108_lat = offset_well_3(degLat2, degLon2, 408.24 , 69.6, color)[0];	 P108_lon = offset_well_3(degLat2, degLon2, 408.24 , 69.6, color)[1];
    P109_lat = offset_well_3(degLat2, degLon2, 409.07 , 64.9, color)[0];	 P109_lon = offset_well_3(degLat2, degLon2, 409.07 , 64.9, color)[1];
    P110_lat = offset_well_3(degLat2, degLon2, 410 , 60, color)[0];	 P110_lon = offset_well_3(degLat2, degLon2, 410 , 60, color)[1];
    P111_lat = offset_well_3(degLat2, degLon2, 411.05 , 54.54, color)[0];	 P111_lon = offset_well_3(degLat2, degLon2, 411.05 , 54.54, color)[1];
    P112_lat = offset_well_3(degLat2, degLon2, 412.16 , 48.32, color)[0];	 P112_lon = offset_well_3(degLat2, degLon2, 412.16 , 48.32, color)[1];
    P113_lat = offset_well_3(degLat2, degLon2, 413.32 , 41.58, color)[0];	 P113_lon = offset_well_3(degLat2, degLon2, 413.32 , 41.58, color)[1];
    P114_lat = offset_well_3(degLat2, degLon2, 414.48 , 34.56, color)[0];	 P114_lon = offset_well_3(degLat2, degLon2, 414.48 , 34.56, color)[1];
    P115_lat = offset_well_3(degLat2, degLon2, 415.63 , 27.5, color)[0];	 P115_lon = offset_well_3(degLat2, degLon2, 415.63 , 27.5, color)[1];
    P116_lat = offset_well_3(degLat2, degLon2, 416.72 , 20.64, color)[0];	 P116_lon = offset_well_3(degLat2, degLon2, 416.72 , 20.64, color)[1];
    P117_lat = offset_well_3(degLat2, degLon2, 417.74 , 14.22, color)[0];	 P117_lon = offset_well_3(degLat2, degLon2, 417.74 , 14.22, color)[1];
    P118_lat = offset_well_3(degLat2, degLon2, 418.64 , 8.48, color)[0];	 P118_lon = offset_well_3(degLat2, degLon2, 418.64 , 8.48, color)[1];
    P119_lat = offset_well_3(degLat2, degLon2, 419.41 , 3.66, color)[0];	 P119_lon = offset_well_3(degLat2, degLon2, 419.41 , 3.66, color)[1];
    P120_lat = offset_well_3(degLat2, degLon2, 415 , 0, color)[0];	 P120_lon = offset_well_3(degLat2, degLon2, 415 , 0, color)[1];
    P121_lat = offset_well_3(degLat2, degLon2, 415 , 0, color)[0];	 P121_lon = offset_well_3(degLat2, degLon2, 415 , 0, color)[1];
    P122_lat = offset_well_3(degLat2, degLon2, 419.41 , -3.66, color)[0];	 P122_lon = offset_well_3(degLat2, degLon2, 419.41 , -3.66, color)[1];
    P123_lat = offset_well_3(degLat2, degLon2, 418.64 , -8.48, color)[0];	 P123_lon = offset_well_3(degLat2, degLon2, 418.64 , -8.48, color)[1];
    P124_lat = offset_well_3(degLat2, degLon2, 417.74 , -14.22, color)[0];	 P124_lon = offset_well_3(degLat2, degLon2, 417.74 , -14.22, color)[1];
    P125_lat = offset_well_3(degLat2, degLon2, 416.72 , -20.64, color)[0];	 P125_lon = offset_well_3(degLat2, degLon2, 416.72 , -20.64, color)[1];
    P126_lat = offset_well_3(degLat2, degLon2, 415.63 , -27.5, color)[0];	 P126_lon = offset_well_3(degLat2, degLon2, 415.63 , -27.5, color)[1];
    P127_lat = offset_well_3(degLat2, degLon2, 414.48 , -34.56, color)[0];	 P127_lon = offset_well_3(degLat2, degLon2, 414.48 , -34.56, color)[1];
    P128_lat = offset_well_3(degLat2, degLon2, 413.32 , -41.58, color)[0];	 P128_lon = offset_well_3(degLat2, degLon2, 413.32 , -41.58, color)[1];
    P129_lat = offset_well_3(degLat2, degLon2, 412.16 , -48.32, color)[0];	 P129_lon = offset_well_3(degLat2, degLon2, 412.16 , -48.32, color)[1];
    P130_lat = offset_well_3(degLat2, degLon2, 411.05 , -54.54, color)[0];	 P130_lon = offset_well_3(degLat2, degLon2, 411.05 , -54.54, color)[1];
    P131_lat = offset_well_3(degLat2, degLon2, 410 , -60, color)[0];	 P131_lon = offset_well_3(degLat2, degLon2, 410 , -60, color)[1];
    P132_lat = offset_well_3(degLat2, degLon2, 409.07 , -64.9, color)[0];	 P132_lon = offset_well_3(degLat2, degLon2, 409.07 , -64.9, color)[1];
    P133_lat = offset_well_3(degLat2, degLon2, 408.24 , -69.6, color)[0];	 P133_lon = offset_well_3(degLat2, degLon2, 408.24 , -69.6, color)[1];
    P134_lat = offset_well_3(degLat2, degLon2, 407.47 , -74.1, color)[0];	 P134_lon = offset_well_3(degLat2, degLon2, 407.47 , -74.1, color)[1];
    P135_lat = offset_well_3(degLat2, degLon2, 406.72 , -78.4, color)[0];	 P135_lon = offset_well_3(degLat2, degLon2, 406.72 , -78.4, color)[1];
    P136_lat = offset_well_3(degLat2, degLon2, 405.94 , -82.5, color)[0];	 P136_lon = offset_well_3(degLat2, degLon2, 405.94 , -82.5, color)[1];
    P137_lat = offset_well_3(degLat2, degLon2, 405.08 , -86.4, color)[0];	 P137_lon = offset_well_3(degLat2, degLon2, 405.08 , -86.4, color)[1];
    P138_lat = offset_well_3(degLat2, degLon2, 404.1 , -90.1, color)[0];	 P138_lon = offset_well_3(degLat2, degLon2, 404.1 , -90.1, color)[1];
    P139_lat = offset_well_3(degLat2, degLon2, 402.96 , -93.6, color)[0];	 P139_lon = offset_well_3(degLat2, degLon2, 402.96 , -93.6, color)[1];
    P140_lat = offset_well_3(degLat2, degLon2, 401.61 , -96.9, color)[0];	 P140_lon = offset_well_3(degLat2, degLon2, 401.61 , -96.9, color)[1];
    P141_lat = offset_well_3(degLat2, degLon2, 400 , -100, color)[0];	 P141_lon = offset_well_3(degLat2, degLon2, 400 , -100, color)[1];
    P142_lat = offset_well_3(degLat2, degLon2, 398.11 , -103.17, color)[0];	 P142_lon = offset_well_3(degLat2, degLon2, 398.11 , -103.17, color)[1];
    P143_lat = offset_well_3(degLat2, degLon2, 395.96 , -106.56, color)[0];	 P143_lon = offset_well_3(degLat2, degLon2, 395.96 , -106.56, color)[1];
    P144_lat = offset_well_3(degLat2, degLon2, 393.6 , -109.99, color)[0];	 P144_lon = offset_well_3(degLat2, degLon2, 393.6 , -109.99, color)[1];
    P145_lat = offset_well_3(degLat2, degLon2, 391.08 , -113.28, color)[0];	 P145_lon = offset_well_3(degLat2, degLon2, 391.08 , -113.28, color)[1];
    P146_lat = offset_well_3(degLat2, degLon2, 388.44 , -116.25, color)[0];	 P146_lon = offset_well_3(degLat2, degLon2, 388.44 , -116.25, color)[1];
    P147_lat = offset_well_3(degLat2, degLon2, 385.72 , -118.72, color)[0];	 P147_lon = offset_well_3(degLat2, degLon2, 385.72 , -118.72, color)[1];
    P148_lat = offset_well_3(degLat2, degLon2, 382.97 , -120.51, color)[0];	 P148_lon = offset_well_3(degLat2, degLon2, 382.97 , -120.51, color)[1];
    P149_lat = offset_well_3(degLat2, degLon2, 380.24 , -121.44, color)[0];	 P149_lon = offset_well_3(degLat2, degLon2, 380.24 , -121.44, color)[1];
    P150_lat = offset_well_3(degLat2, degLon2, 377.57 , -121.33, color)[0];	 P150_lon = offset_well_3(degLat2, degLon2, 377.57 , -121.33, color)[1];
    P151_lat = offset_well_3(degLat2, degLon2, 375 , -120, color)[0];	 P151_lon = offset_well_3(degLat2, degLon2, 375 , -120, color)[1];
    P152_lat = offset_well_3(degLat2, degLon2, 372.61 , -117.02, color)[0];	 P152_lon = offset_well_3(degLat2, degLon2, 372.61 , -117.02, color)[1];
    P153_lat = offset_well_3(degLat2, degLon2, 370.4 , -112.32, color)[0];	 P153_lon = offset_well_3(degLat2, degLon2, 370.4 , -112.32, color)[1];
    P154_lat = offset_well_3(degLat2, degLon2, 368.29 , -106.31, color)[0];	 P154_lon = offset_well_3(degLat2, degLon2, 368.29 , -106.31, color)[1];
    P155_lat = offset_well_3(degLat2, degLon2, 366.2 , -99.36, color)[0];	 P155_lon = offset_well_3(degLat2, degLon2, 366.2 , -99.36, color)[1];
    P156_lat = offset_well_3(degLat2, degLon2, 364.06 , -91.88, color)[0];	 P156_lon = offset_well_3(degLat2, degLon2, 364.06 , -91.88, color)[1];
    P157_lat = offset_well_3(degLat2, degLon2, 361.8 , -84.24, color)[0];	 P157_lon = offset_well_3(degLat2, degLon2, 361.8 , -84.24, color)[1];
    P158_lat = offset_well_3(degLat2, degLon2, 359.34 , -76.85, color)[0];	 P158_lon = offset_well_3(degLat2, degLon2, 359.34 , -76.85, color)[1];
    P159_lat = offset_well_3(degLat2, degLon2, 356.6 , -70.08, color)[0];	 P159_lon = offset_well_3(degLat2, degLon2, 356.6 , -70.08, color)[1];
    P160_lat = offset_well_3(degLat2, degLon2, 353.51 , -64.34, color)[0];	 P160_lon = offset_well_3(degLat2, degLon2, 353.51 , -64.34, color)[1];
    P161_lat = offset_well_3(degLat2, degLon2, 350 , -60, color)[0];	 P161_lon = offset_well_3(degLat2, degLon2, 350 , -60, color)[1];
    P162_lat = offset_well_3(degLat2, degLon2, 346.01 , -56.84, color)[0];	 P162_lon = offset_well_3(degLat2, degLon2, 346.01 , -56.84, color)[1];
    P163_lat = offset_well_3(degLat2, degLon2, 341.6 , -54.32, color)[0];	 P163_lon = offset_well_3(degLat2, degLon2, 341.6 , -54.32, color)[1];
    P164_lat = offset_well_3(degLat2, degLon2, 336.84 , -52.38, color)[0];	 P164_lon = offset_well_3(degLat2, degLon2, 336.84 , -52.38, color)[1];
    P165_lat = offset_well_3(degLat2, degLon2, 331.8 , -50.96, color)[0];	 P165_lon = offset_well_3(degLat2, degLon2, 331.8 , -50.96, color)[1];
    P166_lat = offset_well_3(degLat2, degLon2, 326.56 , -50, color)[0];	 P166_lon = offset_well_3(degLat2, degLon2, 326.56 , -50, color)[1];
    P167_lat = offset_well_3(degLat2, degLon2, 321.2 , -49.44, color)[0];	 P167_lon = offset_well_3(degLat2, degLon2, 321.2 , -49.44, color)[1];
    P168_lat = offset_well_3(degLat2, degLon2, 315.79 , -49.22, color)[0];	 P168_lon = offset_well_3(degLat2, degLon2, 315.79 , -49.22, color)[1];
    P169_lat = offset_well_3(degLat2, degLon2, 310.4 , -49.28, color)[0];	 P169_lon = offset_well_3(degLat2, degLon2, 310.4 , -49.28, color)[1];
    P170_lat = offset_well_3(degLat2, degLon2, 305.11 , -49.56, color)[0];	 P170_lon = offset_well_3(degLat2, degLon2, 305.11 , -49.56, color)[1];
    P171_lat = offset_well_3(degLat2, degLon2, 300 , -50, color)[0];	 P171_lon = offset_well_3(degLat2, degLon2, 300 , -50, color)[1];
    P172_lat = offset_well_3(degLat2, degLon2, 295 , -50.85, color)[0];	 P172_lon = offset_well_3(degLat2, degLon2, 295 , -50.85, color)[1];
    P173_lat = offset_well_3(degLat2, degLon2, 290 , -52.32, color)[0];	 P173_lon = offset_well_3(degLat2, degLon2, 290 , -52.32, color)[1];
    P174_lat = offset_well_3(degLat2, degLon2, 285 , -54.27, color)[0];	 P174_lon = offset_well_3(degLat2, degLon2, 285 , -54.27, color)[1];
    P175_lat = offset_well_3(degLat2, degLon2, 280 , -56.56, color)[0];	 P175_lon = offset_well_3(degLat2, degLon2, 280 , -56.56, color)[1];
    P176_lat = offset_well_3(degLat2, degLon2, 275 , -59.06, color)[0];	 P176_lon = offset_well_3(degLat2, degLon2, 275 , -59.06, color)[1];
    P177_lat = offset_well_3(degLat2, degLon2, 270 , -61.64, color)[0];	 P177_lon = offset_well_3(degLat2, degLon2, 270 , -61.64, color)[1];
    P178_lat = offset_well_3(degLat2, degLon2, 265 , -64.16, color)[0];	 P178_lon = offset_well_3(degLat2, degLon2, 265 , -64.16, color)[1];
    P179_lat = offset_well_3(degLat2, degLon2, 260 , -66.48, color)[0];	 P179_lon = offset_well_3(degLat2, degLon2, 260 , -66.48, color)[1];
    P180_lat = offset_well_3(degLat2, degLon2, 255 , -68.47, color)[0];	 P180_lon = offset_well_3(degLat2, degLon2, 255 , -68.47, color)[1];
    P181_lat = offset_well_3(degLat2, degLon2, 250 , -70, color)[0];	 P181_lon = offset_well_3(degLat2, degLon2, 250 , -70, color)[1];
    P182_lat = offset_well_3(degLat2, degLon2, 245 , -71.27, color)[0];	 P182_lon = offset_well_3(degLat2, degLon2, 245 , -71.27, color)[1];
    P183_lat = offset_well_3(degLat2, degLon2, 240 , -72.52, color)[0];	 P183_lon = offset_well_3(degLat2, degLon2, 240 , -72.52, color)[1];
    P184_lat = offset_well_3(degLat2, degLon2, 235 , -73.71, color)[0];	 P184_lon = offset_well_3(degLat2, degLon2, 235 , -73.71, color)[1];
    P185_lat = offset_well_3(degLat2, degLon2, 230 , -74.76, color)[0];	 P185_lon = offset_well_3(degLat2, degLon2, 230 , -74.76, color)[1];
    P186_lat = offset_well_3(degLat2, degLon2, 225 , -75.63, color)[0];	 P186_lon = offset_well_3(degLat2, degLon2, 225 , -75.63, color)[1];
    P187_lat = offset_well_3(degLat2, degLon2, 220 , -76.24, color)[0];	 P187_lon = offset_well_3(degLat2, degLon2, 220 , -76.24, color)[1];
    P188_lat = offset_well_3(degLat2, degLon2, 215 , -76.55, color)[0];	 P188_lon = offset_well_3(degLat2, degLon2, 215 , -76.55, color)[1];
    P189_lat = offset_well_3(degLat2, degLon2, 210 , -76.48, color)[0];	 P189_lon = offset_well_3(degLat2, degLon2, 210 , -76.48, color)[1];
    P190_lat = offset_well_3(degLat2, degLon2, 205 , -75.99, color)[0];	 P190_lon = offset_well_3(degLat2, degLon2, 205 , -75.99, color)[1];
    P191_lat = offset_well_3(degLat2, degLon2, 200 , -75, color)[0];	 P191_lon = offset_well_3(degLat2, degLon2, 200 , -75, color)[1];
    P192_lat = offset_well_3(degLat2, degLon2, 195 , -73.26, color)[0];	 P192_lon = offset_well_3(degLat2, degLon2, 195 , -73.26, color)[1];
    P193_lat = offset_well_3(degLat2, degLon2, 190 , -70.68, color)[0];	 P193_lon = offset_well_3(degLat2, degLon2, 190 , -70.68, color)[1];
    P194_lat = offset_well_3(degLat2, degLon2, 185 , -67.47, color)[0];	 P194_lon = offset_well_3(degLat2, degLon2, 185 , -67.47, color)[1];
    P195_lat = offset_well_3(degLat2, degLon2, 180 , -63.84, color)[0];	 P195_lon = offset_well_3(degLat2, degLon2, 180 , -63.84, color)[1];
    P196_lat = offset_well_3(degLat2, degLon2, 175 , -60, color)[0];	 P196_lon = offset_well_3(degLat2, degLon2, 175 , -60, color)[1];
    P197_lat = offset_well_3(degLat2, degLon2, 170 , -56.16, color)[0];	 P197_lon = offset_well_3(degLat2, degLon2, 170 , -56.16, color)[1];
    P198_lat = offset_well_3(degLat2, degLon2, 165 , -52.53, color)[0];	 P198_lon = offset_well_3(degLat2, degLon2, 165 , -52.53, color)[1];
    P199_lat = offset_well_3(degLat2, degLon2, 160 , -49.32, color)[0];	 P199_lon = offset_well_3(degLat2, degLon2, 160 , -49.32, color)[1];
    P200_lat = offset_well_3(degLat2, degLon2, 155 , -46.74, color)[0];	 P200_lon = offset_well_3(degLat2, degLon2, 155 , -46.74, color)[1];
    P201_lat = offset_well_3(degLat2, degLon2, 150 , -45, color)[0];	 P201_lon = offset_well_3(degLat2, degLon2, 150 , -45, color)[1];
    P202_lat = offset_well_3(degLat2, degLon2, 144.89 , -43.97, color)[0];	 P202_lon = offset_well_3(degLat2, degLon2, 144.89 , -43.97, color)[1];
    P203_lat = offset_well_3(degLat2, degLon2, 139.6 , -43.36, color)[0];	 P203_lon = offset_well_3(degLat2, degLon2, 139.6 , -43.36, color)[1];
    P204_lat = offset_well_3(degLat2, degLon2, 134.21 , -43.14, color)[0];	 P204_lon = offset_well_3(degLat2, degLon2, 134.21 , -43.14, color)[1];
    P205_lat = offset_well_3(degLat2, degLon2, 128.8 , -43.28, color)[0];	 P205_lon = offset_well_3(degLat2, degLon2, 128.8 , -43.28, color)[1];
    P206_lat = offset_well_3(degLat2, degLon2, 123.44 , -43.75, color)[0];	 P206_lon = offset_well_3(degLat2, degLon2, 123.44 , -43.75, color)[1];
    P207_lat = offset_well_3(degLat2, degLon2, 118.2 , -44.52, color)[0];	 P207_lon = offset_well_3(degLat2, degLon2, 118.2 , -44.52, color)[1];
    P208_lat = offset_well_3(degLat2, degLon2, 113.16 , -45.56, color)[0];	 P208_lon = offset_well_3(degLat2, degLon2, 113.16 , -45.56, color)[1];
    P209_lat = offset_well_3(degLat2, degLon2, 108.4 , -46.84, color)[0];	 P209_lon = offset_well_3(degLat2, degLon2, 108.4 , -46.84, color)[1];
    P210_lat = offset_well_3(degLat2, degLon2, 103.99 , -48.33, color)[0];	 P210_lon = offset_well_3(degLat2, degLon2, 103.99 , -48.33, color)[1];
    P211_lat = offset_well_3(degLat2, degLon2, 100 , -50, color)[0];	 P211_lon = offset_well_3(degLat2, degLon2, 100 , -50, color)[1];
    P212_lat = offset_well_3(degLat2, degLon2, 96.49 , -51.99, color)[0];	 P212_lon = offset_well_3(degLat2, degLon2, 96.49 , -51.99, color)[1];
    P213_lat = offset_well_3(degLat2, degLon2, 93.4 , -54.4, color)[0];	 P213_lon = offset_well_3(degLat2, degLon2, 93.4 , -54.4, color)[1];
    P214_lat = offset_well_3(degLat2, degLon2, 90.66 , -57.16, color)[0];	 P214_lon = offset_well_3(degLat2, degLon2, 90.66 , -57.16, color)[1];
    P215_lat = offset_well_3(degLat2, degLon2, 88.2 , -60.2, color)[0];	 P215_lon = offset_well_3(degLat2, degLon2, 88.2 , -60.2, color)[1];
    P216_lat = offset_well_3(degLat2, degLon2, 85.94 , -63.44, color)[0];	 P216_lon = offset_well_3(degLat2, degLon2, 85.94 , -63.44, color)[1];
    P217_lat = offset_well_3(degLat2, degLon2, 83.8 , -66.8, color)[0];	 P217_lon = offset_well_3(degLat2, degLon2, 83.8 , -66.8, color)[1];
    P218_lat = offset_well_3(degLat2, degLon2, 81.71 , -70.21, color)[0];	 P218_lon = offset_well_3(degLat2, degLon2, 81.71 , -70.21, color)[1];
    P219_lat = offset_well_3(degLat2, degLon2, 79.6 , -73.6, color)[0];	 P219_lon = offset_well_3(degLat2, degLon2, 79.6 , -73.6, color)[1];
    P220_lat = offset_well_3(degLat2, degLon2, 77.39 , -76.89, color)[0];	 P220_lon = offset_well_3(degLat2, degLon2, 77.39 , -76.89, color)[1];
    P221_lat = offset_well_3(degLat2, degLon2, 75 , -80, color)[0];	 P221_lon = offset_well_3(degLat2, degLon2, 75 , -80, color)[1];
    P222_lat = offset_well_3(degLat2, degLon2, 72.61 , -83.09, color)[0];	 P222_lon = offset_well_3(degLat2, degLon2, 72.61 , -83.09, color)[1];
    P223_lat = offset_well_3(degLat2, degLon2, 70.4 , -86.32, color)[0];	 P223_lon = offset_well_3(degLat2, degLon2, 70.4 , -86.32, color)[1];
    P224_lat = offset_well_3(degLat2, degLon2, 68.29 , -89.63, color)[0];	 P224_lon = offset_well_3(degLat2, degLon2, 68.29 , -89.63, color)[1];
    P225_lat = offset_well_3(degLat2, degLon2, 66.2 , -92.96, color)[0];	 P225_lon = offset_well_3(degLat2, degLon2, 66.2 , -92.96, color)[1];
    P226_lat = offset_well_3(degLat2, degLon2, 64.06 , -96.25, color)[0];	 P226_lon = offset_well_3(degLat2, degLon2, 64.06 , -96.25, color)[1];
    P227_lat = offset_well_3(degLat2, degLon2, 61.8 , -99.44, color)[0];	 P227_lon = offset_well_3(degLat2, degLon2, 61.8 , -99.44, color)[1];
    P228_lat = offset_well_3(degLat2, degLon2, 59.34 , -102.47, color)[0];	 P228_lon = offset_well_3(degLat2, degLon2, 59.34 , -102.47, color)[1];
    P229_lat = offset_well_3(degLat2, degLon2, 56.6 , -105.28, color)[0];	 P229_lon = offset_well_3(degLat2, degLon2, 56.6 , -105.28, color)[1];
    P230_lat = offset_well_3(degLat2, degLon2, 53.51 , -107.81, color)[0];	 P230_lon = offset_well_3(degLat2, degLon2, 53.51 , -107.81, color)[1];
    P231_lat = offset_well_3(degLat2, degLon2, 50 , -110, color)[0];	 P231_lon = offset_well_3(degLat2, degLon2, 50 , -110, color)[1];
    P232_lat = offset_well_3(degLat2, degLon2, 40.8 , -113.44, color)[0];	 P232_lon = offset_well_3(degLat2, degLon2, 40.8 , -113.44, color)[1];
    P233_lat = offset_well_3(degLat2, degLon2, 35.26 , -114.79, color)[0];	 P233_lon = offset_well_3(degLat2, degLon2, 35.26 , -114.79, color)[1];
    P234_lat = offset_well_3(degLat2, degLon2, 29.4 , -115.92, color)[0];	 P234_lon = offset_well_3(degLat2, degLon2, 29.4 , -115.92, color)[1];
    P235_lat = offset_well_3(degLat2, degLon2, 23.44 , -116.88, color)[0];	 P235_lon = offset_well_3(degLat2, degLon2, 23.44 , -116.88, color)[1];
    P236_lat = offset_well_3(degLat2, degLon2, 17.6 , -117.68, color)[0];	 P236_lon = offset_well_3(degLat2, degLon2, 17.6 , -117.68, color)[1];
    P237_lat = offset_well_3(degLat2, degLon2, 12.11 , -118.37, color)[0];	 P237_lon = offset_well_3(degLat2, degLon2, 12.11 , -118.37, color)[1];
    P238_lat = offset_well_3(degLat2, degLon2, 7.2 , -118.96, color)[0];	 P238_lon = offset_well_3(degLat2, degLon2, 7.2 , -118.96, color)[1];
    P239_lat = offset_well_3(degLat2, degLon2, 3.09 , -119.5, color)[0];	 P239_lon = offset_well_3(degLat2, degLon2, 3.09 , -119.5, color)[1];
    P240_lat = offset_well_3(degLat2, degLon2, 0 , -120, color)[0];	 P240_lon = offset_well_3(degLat2, degLon2, 0 , -120, color)[1];
    P241_lat = offset_well_3(degLat2, degLon2, 0 , -120, color)[0];	 P241_lon = offset_well_3(degLat2, degLon2, 0 , -120, color)[1];
    P242_lat = offset_well_3(degLat2, degLon2, -3.09 , -119.5, color)[0];	 P242_lon = offset_well_3(degLat2, degLon2, -3.09 , -119.5, color)[1];
    P243_lat = offset_well_3(degLat2, degLon2, -7.2 , -118.96, color)[0];	 P243_lon = offset_well_3(degLat2, degLon2, -7.2 , -118.96, color)[1];
    P244_lat = offset_well_3(degLat2, degLon2, -12.11 , -118.37, color)[0];	 P244_lon = offset_well_3(degLat2, degLon2, -12.11 , -118.37, color)[1];
    P245_lat = offset_well_3(degLat2, degLon2, -17.6 , -117.68, color)[0];	 P245_lon = offset_well_3(degLat2, degLon2, -17.6 , -117.68, color)[1];
    P246_lat = offset_well_3(degLat2, degLon2, -23.44 , -116.88, color)[0];	 P246_lon = offset_well_3(degLat2, degLon2, -23.44 , -116.88, color)[1];
    P247_lat = offset_well_3(degLat2, degLon2, -29.4 , -115.92, color)[0];	 P247_lon = offset_well_3(degLat2, degLon2, -29.4 , -115.92, color)[1];
    P248_lat = offset_well_3(degLat2, degLon2, -35.26 , -114.79, color)[0];	 P248_lon = offset_well_3(degLat2, degLon2, -35.26 , -114.79, color)[1];
    P249_lat = offset_well_3(degLat2, degLon2, -40.8 , -113.44, color)[0];	 P249_lon = offset_well_3(degLat2, degLon2, -40.8 , -113.44, color)[1];
    P250_lat = offset_well_3(degLat2, degLon2, -50 , -110, color)[0];	 P250_lon = offset_well_3(degLat2, degLon2, -50 , -110, color)[1];
    P251_lat = offset_well_3(degLat2, degLon2, -53.51 , -107.81, color)[0];	 P251_lon = offset_well_3(degLat2, degLon2, -53.51 , -107.81, color)[1];
    P252_lat = offset_well_3(degLat2, degLon2, -56.6 , -105.28, color)[0];	 P252_lon = offset_well_3(degLat2, degLon2, -56.6 , -105.28, color)[1];
    P253_lat = offset_well_3(degLat2, degLon2, -59.34 , -102.47, color)[0];	 P253_lon = offset_well_3(degLat2, degLon2, -59.34 , -102.47, color)[1];
    P254_lat = offset_well_3(degLat2, degLon2, -61.8 , -99.44, color)[0];	 P254_lon = offset_well_3(degLat2, degLon2, -61.8 , -99.44, color)[1];
    P255_lat = offset_well_3(degLat2, degLon2, -64.06 , -96.25, color)[0];	 P255_lon = offset_well_3(degLat2, degLon2, -64.06 , -96.25, color)[1];
    P256_lat = offset_well_3(degLat2, degLon2, -66.2 , -92.96, color)[0];	 P256_lon = offset_well_3(degLat2, degLon2, -66.2 , -92.96, color)[1];
    P257_lat = offset_well_3(degLat2, degLon2, -68.29 , -89.63, color)[0];	 P257_lon = offset_well_3(degLat2, degLon2, -68.29 , -89.63, color)[1];
    P258_lat = offset_well_3(degLat2, degLon2, -70.4 , -86.32, color)[0];	 P258_lon = offset_well_3(degLat2, degLon2, -70.4 , -86.32, color)[1];
    P259_lat = offset_well_3(degLat2, degLon2, -72.61 , -83.09, color)[0];	 P259_lon = offset_well_3(degLat2, degLon2, -72.61 , -83.09, color)[1];
    P260_lat = offset_well_3(degLat2, degLon2, -75 , -80, color)[0];	 P260_lon = offset_well_3(degLat2, degLon2, -75 , -80, color)[1];
    P261_lat = offset_well_3(degLat2, degLon2, -77.39 , -76.89, color)[0];	 P261_lon = offset_well_3(degLat2, degLon2, -77.39 , -76.89, color)[1];
    P262_lat = offset_well_3(degLat2, degLon2, -79.6 , -73.6, color)[0];	 P262_lon = offset_well_3(degLat2, degLon2, -79.6 , -73.6, color)[1];
    P263_lat = offset_well_3(degLat2, degLon2, -81.71 , -70.21, color)[0];	 P263_lon = offset_well_3(degLat2, degLon2, -81.71 , -70.21, color)[1];
    P264_lat = offset_well_3(degLat2, degLon2, -83.8 , -66.8, color)[0];	 P264_lon = offset_well_3(degLat2, degLon2, -83.8 , -66.8, color)[1];
    P265_lat = offset_well_3(degLat2, degLon2, -85.94 , -63.44, color)[0];	 P265_lon = offset_well_3(degLat2, degLon2, -85.94 , -63.44, color)[1];
    P266_lat = offset_well_3(degLat2, degLon2, -88.2 , -60.2, color)[0];	 P266_lon = offset_well_3(degLat2, degLon2, -88.2 , -60.2, color)[1];
    P267_lat = offset_well_3(degLat2, degLon2, -90.66 , -57.16, color)[0];	 P267_lon = offset_well_3(degLat2, degLon2, -90.66 , -57.16, color)[1];
    P268_lat = offset_well_3(degLat2, degLon2, -93.4 , -54.4, color)[0];	 P268_lon = offset_well_3(degLat2, degLon2, -93.4 , -54.4, color)[1];
    P269_lat = offset_well_3(degLat2, degLon2, -96.49 , -51.99, color)[0];	 P269_lon = offset_well_3(degLat2, degLon2, -96.49 , -51.99, color)[1];
    P270_lat = offset_well_3(degLat2, degLon2, -100 , -50, color)[0];	 P270_lon = offset_well_3(degLat2, degLon2, -100 , -50, color)[1];
    P271_lat = offset_well_3(degLat2, degLon2, -103.99 , -48.33, color)[0];	 P271_lon = offset_well_3(degLat2, degLon2, -103.99 , -48.33, color)[1];
    P272_lat = offset_well_3(degLat2, degLon2, -108.4 , -46.84, color)[0];	 P272_lon = offset_well_3(degLat2, degLon2, -108.4 , -46.84, color)[1];
    P273_lat = offset_well_3(degLat2, degLon2, -113.16 , -45.56, color)[0];	 P273_lon = offset_well_3(degLat2, degLon2, -113.16 , -45.56, color)[1];
    P274_lat = offset_well_3(degLat2, degLon2, -118.2 , -44.52, color)[0];	 P274_lon = offset_well_3(degLat2, degLon2, -118.2 , -44.52, color)[1];
    P275_lat = offset_well_3(degLat2, degLon2, -123.44 , -43.75, color)[0];	 P275_lon = offset_well_3(degLat2, degLon2, -123.44 , -43.75, color)[1];
    P276_lat = offset_well_3(degLat2, degLon2, -128.8 , -43.28, color)[0];	 P276_lon = offset_well_3(degLat2, degLon2, -128.8 , -43.28, color)[1];
    P277_lat = offset_well_3(degLat2, degLon2, -134.21 , -43.14, color)[0];	 P277_lon = offset_well_3(degLat2, degLon2, -134.21 , -43.14, color)[1];
    P278_lat = offset_well_3(degLat2, degLon2, -139.6 , -43.36, color)[0];	 P278_lon = offset_well_3(degLat2, degLon2, -139.6 , -43.36, color)[1];
    P279_lat = offset_well_3(degLat2, degLon2, -144.89 , -43.97, color)[0];	 P279_lon = offset_well_3(degLat2, degLon2, -144.89 , -43.97, color)[1];
    P280_lat = offset_well_3(degLat2, degLon2, -150 , -45, color)[0];	 P280_lon = offset_well_3(degLat2, degLon2, -150 , -45, color)[1];
    P281_lat = offset_well_3(degLat2, degLon2, -155 , -46.74, color)[0];	 P281_lon = offset_well_3(degLat2, degLon2, -155 , -46.74, color)[1];
    P282_lat = offset_well_3(degLat2, degLon2, -160 , -49.32, color)[0];	 P282_lon = offset_well_3(degLat2, degLon2, -160 , -49.32, color)[1];
    P283_lat = offset_well_3(degLat2, degLon2, -165 , -52.53, color)[0];	 P283_lon = offset_well_3(degLat2, degLon2, -165 , -52.53, color)[1];
    P284_lat = offset_well_3(degLat2, degLon2, -170 , -56.16, color)[0];	 P284_lon = offset_well_3(degLat2, degLon2, -170 , -56.16, color)[1];
    P285_lat = offset_well_3(degLat2, degLon2, -175 , -60, color)[0];	 P285_lon = offset_well_3(degLat2, degLon2, -175 , -60, color)[1];
    P286_lat = offset_well_3(degLat2, degLon2, -180 , -63.84, color)[0];	 P286_lon = offset_well_3(degLat2, degLon2, -180 , -63.84, color)[1];
    P287_lat = offset_well_3(degLat2, degLon2, -185 , -67.47, color)[0];	 P287_lon = offset_well_3(degLat2, degLon2, -185 , -67.47, color)[1];
    P288_lat = offset_well_3(degLat2, degLon2, -190 , -70.68, color)[0];	 P288_lon = offset_well_3(degLat2, degLon2, -190 , -70.68, color)[1];
    P289_lat = offset_well_3(degLat2, degLon2, -195 , -73.26, color)[0];	 P289_lon = offset_well_3(degLat2, degLon2, -195 , -73.26, color)[1];
    P290_lat = offset_well_3(degLat2, degLon2, -200 , -75, color)[0];	 P290_lon = offset_well_3(degLat2, degLon2, -200 , -75, color)[1];
    P291_lat = offset_well_3(degLat2, degLon2, -205 , -75.99, color)[0];	 P291_lon = offset_well_3(degLat2, degLon2, -205 , -75.99, color)[1];
    P292_lat = offset_well_3(degLat2, degLon2, -210 , -76.48, color)[0];	 P292_lon = offset_well_3(degLat2, degLon2, -210 , -76.48, color)[1];
    P293_lat = offset_well_3(degLat2, degLon2, -215 , -76.55, color)[0];	 P293_lon = offset_well_3(degLat2, degLon2, -215 , -76.55, color)[1];
    P294_lat = offset_well_3(degLat2, degLon2, -220 , -76.24, color)[0];	 P294_lon = offset_well_3(degLat2, degLon2, -220 , -76.24, color)[1];
    P295_lat = offset_well_3(degLat2, degLon2, -225 , -75.63, color)[0];	 P295_lon = offset_well_3(degLat2, degLon2, -225 , -75.63, color)[1];
    P296_lat = offset_well_3(degLat2, degLon2, -230 , -74.76, color)[0];	 P296_lon = offset_well_3(degLat2, degLon2, -230 , -74.76, color)[1];
    P297_lat = offset_well_3(degLat2, degLon2, -235 , -73.71, color)[0];	 P297_lon = offset_well_3(degLat2, degLon2, -235 , -73.71, color)[1];
    P298_lat = offset_well_3(degLat2, degLon2, -240 , -72.52, color)[0];	 P298_lon = offset_well_3(degLat2, degLon2, -240 , -72.52, color)[1];
    P299_lat = offset_well_3(degLat2, degLon2, -245 , -71.27, color)[0];	 P299_lon = offset_well_3(degLat2, degLon2, -245 , -71.27, color)[1];
    P300_lat = offset_well_3(degLat2, degLon2, -250 , -70, color)[0];	 P300_lon = offset_well_3(degLat2, degLon2, -250 , -70, color)[1];
    P301_lat = offset_well_3(degLat2, degLon2, -255 , -68.47, color)[0];	 P301_lon = offset_well_3(degLat2, degLon2, -255 , -68.47, color)[1];
    P302_lat = offset_well_3(degLat2, degLon2, -260 , -66.48, color)[0];	 P302_lon = offset_well_3(degLat2, degLon2, -260 , -66.48, color)[1];
    P303_lat = offset_well_3(degLat2, degLon2, -265 , -64.16, color)[0];	 P303_lon = offset_well_3(degLat2, degLon2, -265 , -64.16, color)[1];
    P304_lat = offset_well_3(degLat2, degLon2, -270 , -61.64, color)[0];	 P304_lon = offset_well_3(degLat2, degLon2, -270 , -61.64, color)[1];
    P305_lat = offset_well_3(degLat2, degLon2, -275 , -59.06, color)[0];	 P305_lon = offset_well_3(degLat2, degLon2, -275 , -59.06, color)[1];
    P306_lat = offset_well_3(degLat2, degLon2, -280 , -56.56, color)[0];	 P306_lon = offset_well_3(degLat2, degLon2, -280 , -56.56, color)[1];
    P307_lat = offset_well_3(degLat2, degLon2, -285 , -54.27, color)[0];	 P307_lon = offset_well_3(degLat2, degLon2, -285 , -54.27, color)[1];
    P308_lat = offset_well_3(degLat2, degLon2, -290 , -52.32, color)[0];	 P308_lon = offset_well_3(degLat2, degLon2, -290 , -52.32, color)[1];
    P309_lat = offset_well_3(degLat2, degLon2, -295 , -50.85, color)[0];	 P309_lon = offset_well_3(degLat2, degLon2, -295 , -50.85, color)[1];
    P310_lat = offset_well_3(degLat2, degLon2, -300 , -50, color)[0];	 P310_lon = offset_well_3(degLat2, degLon2, -300 , -50, color)[1];
    P311_lat = offset_well_3(degLat2, degLon2, -305.11 , -49.56, color)[0];	 P311_lon = offset_well_3(degLat2, degLon2, -305.11 , -49.56, color)[1];
    P312_lat = offset_well_3(degLat2, degLon2, -310.4 , -49.28, color)[0];	 P312_lon = offset_well_3(degLat2, degLon2, -310.4 , -49.28, color)[1];
    P313_lat = offset_well_3(degLat2, degLon2, -315.79 , -49.22, color)[0];	 P313_lon = offset_well_3(degLat2, degLon2, -315.79 , -49.22, color)[1];
    P314_lat = offset_well_3(degLat2, degLon2, -321.2 , -49.44, color)[0];	 P314_lon = offset_well_3(degLat2, degLon2, -321.2 , -49.44, color)[1];
    P315_lat = offset_well_3(degLat2, degLon2, -326.56 , -50, color)[0];	 P315_lon = offset_well_3(degLat2, degLon2, -326.56 , -50, color)[1];
    P316_lat = offset_well_3(degLat2, degLon2, -331.8 , -50.96, color)[0];	 P316_lon = offset_well_3(degLat2, degLon2, -331.8 , -50.96, color)[1];
    P317_lat = offset_well_3(degLat2, degLon2, -336.84 , -52.38, color)[0];	 P317_lon = offset_well_3(degLat2, degLon2, -336.84 , -52.38, color)[1];
    P318_lat = offset_well_3(degLat2, degLon2, -341.6 , -54.32, color)[0];	 P318_lon = offset_well_3(degLat2, degLon2, -341.6 , -54.32, color)[1];
    P319_lat = offset_well_3(degLat2, degLon2, -346.01 , -56.84, color)[0];	 P319_lon = offset_well_3(degLat2, degLon2, -346.01 , -56.84, color)[1];
    P320_lat = offset_well_3(degLat2, degLon2, -350 , -60, color)[0];	 P320_lon = offset_well_3(degLat2, degLon2, -350 , -60, color)[1];
    P321_lat = offset_well_3(degLat2, degLon2, -353.51 , -64.34, color)[0];	 P321_lon = offset_well_3(degLat2, degLon2, -353.51 , -64.34, color)[1];
    P322_lat = offset_well_3(degLat2, degLon2, -356.6 , -70.08, color)[0];	 P322_lon = offset_well_3(degLat2, degLon2, -356.6 , -70.08, color)[1];
    P323_lat = offset_well_3(degLat2, degLon2, -359.34 , -76.85, color)[0];	 P323_lon = offset_well_3(degLat2, degLon2, -359.34 , -76.85, color)[1];
    P324_lat = offset_well_3(degLat2, degLon2, -361.8 , -84.24, color)[0];	 P324_lon = offset_well_3(degLat2, degLon2, -361.8 , -84.24, color)[1];
    P325_lat = offset_well_3(degLat2, degLon2, -364.06 , -91.88, color)[0];	 P325_lon = offset_well_3(degLat2, degLon2, -364.06 , -91.88, color)[1];
    P326_lat = offset_well_3(degLat2, degLon2, -366.2 , -99.36, color)[0];	 P326_lon = offset_well_3(degLat2, degLon2, -366.2 , -99.36, color)[1];
    P327_lat = offset_well_3(degLat2, degLon2, -368.29 , -106.31, color)[0];	 P327_lon = offset_well_3(degLat2, degLon2, -368.29 , -106.31, color)[1];
    P328_lat = offset_well_3(degLat2, degLon2, -370.4 , -112.32, color)[0];	 P328_lon = offset_well_3(degLat2, degLon2, -370.4 , -112.32, color)[1];
    P329_lat = offset_well_3(degLat2, degLon2, -372.61 , -117.02, color)[0];	 P329_lon = offset_well_3(degLat2, degLon2, -372.61 , -117.02, color)[1];
    P330_lat = offset_well_3(degLat2, degLon2, -375 , -120, color)[0];	 P330_lon = offset_well_3(degLat2, degLon2, -375 , -120, color)[1];
    P331_lat = offset_well_3(degLat2, degLon2, -377.57 , -121.33, color)[0];	 P331_lon = offset_well_3(degLat2, degLon2, -377.57 , -121.33, color)[1];
    P332_lat = offset_well_3(degLat2, degLon2, -380.24 , -121.44, color)[0];	 P332_lon = offset_well_3(degLat2, degLon2, -380.24 , -121.44, color)[1];
    P333_lat = offset_well_3(degLat2, degLon2, -382.97 , -120.51, color)[0];	 P333_lon = offset_well_3(degLat2, degLon2, -382.97 , -120.51, color)[1];
    P334_lat = offset_well_3(degLat2, degLon2, -385.72 , -118.72, color)[0];	 P334_lon = offset_well_3(degLat2, degLon2, -385.72 , -118.72, color)[1];
    P335_lat = offset_well_3(degLat2, degLon2, -388.44 , -116.25, color)[0];	 P335_lon = offset_well_3(degLat2, degLon2, -388.44 , -116.25, color)[1];
    P336_lat = offset_well_3(degLat2, degLon2, -391.08 , -113.28, color)[0];	 P336_lon = offset_well_3(degLat2, degLon2, -391.08 , -113.28, color)[1];
    P337_lat = offset_well_3(degLat2, degLon2, -393.6 , -109.99, color)[0];	 P337_lon = offset_well_3(degLat2, degLon2, -393.6 , -109.99, color)[1];
    P338_lat = offset_well_3(degLat2, degLon2, -395.96 , -106.56, color)[0];	 P338_lon = offset_well_3(degLat2, degLon2, -395.96 , -106.56, color)[1];
    P339_lat = offset_well_3(degLat2, degLon2, -398.11 , -103.17, color)[0];	 P339_lon = offset_well_3(degLat2, degLon2, -398.11 , -103.17, color)[1];
    P340_lat = offset_well_3(degLat2, degLon2, -400 , -100, color)[0];	 P340_lon = offset_well_3(degLat2, degLon2, -400 , -100, color)[1];
    P341_lat = offset_well_3(degLat2, degLon2, -401.61 , -96.9, color)[0];	 P341_lon = offset_well_3(degLat2, degLon2, -401.61 , -96.9, color)[1];
    P342_lat = offset_well_3(degLat2, degLon2, -402.96 , -93.6, color)[0];	 P342_lon = offset_well_3(degLat2, degLon2, -402.96 , -93.6, color)[1];
    P343_lat = offset_well_3(degLat2, degLon2, -404.1 , -90.1, color)[0];	 P343_lon = offset_well_3(degLat2, degLon2, -404.1 , -90.1, color)[1];
    P344_lat = offset_well_3(degLat2, degLon2, -405.08 , -86.4, color)[0];	 P344_lon = offset_well_3(degLat2, degLon2, -405.08 , -86.4, color)[1];
    P345_lat = offset_well_3(degLat2, degLon2, -405.94 , -82.5, color)[0];	 P345_lon = offset_well_3(degLat2, degLon2, -405.94 , -82.5, color)[1];
    P346_lat = offset_well_3(degLat2, degLon2, -406.72 , -78.4, color)[0];	 P346_lon = offset_well_3(degLat2, degLon2, -406.72 , -78.4, color)[1];
    P347_lat = offset_well_3(degLat2, degLon2, -407.47 , -74.1, color)[0];	 P347_lon = offset_well_3(degLat2, degLon2, -407.47 , -74.1, color)[1];
    P348_lat = offset_well_3(degLat2, degLon2, -408.24 , -69.6, color)[0];	 P348_lon = offset_well_3(degLat2, degLon2, -408.24 , -69.6, color)[1];
    P349_lat = offset_well_3(degLat2, degLon2, -409.07 , -64.9, color)[0];	 P349_lon = offset_well_3(degLat2, degLon2, -409.07 , -64.9, color)[1];
    P350_lat = offset_well_3(degLat2, degLon2, -410 , -60, color)[0];	 P350_lon = offset_well_3(degLat2, degLon2, -410 , -60, color)[1];
    P351_lat = offset_well_3(degLat2, degLon2, -411.05 , -54.54, color)[0];	 P351_lon = offset_well_3(degLat2, degLon2, -411.05 , -54.54, color)[1];
    P352_lat = offset_well_3(degLat2, degLon2, -412.16 , -48.32, color)[0];	 P352_lon = offset_well_3(degLat2, degLon2, -412.16 , -48.32, color)[1];
    P353_lat = offset_well_3(degLat2, degLon2, -413.32 , -41.58, color)[0];	 P353_lon = offset_well_3(degLat2, degLon2, -413.32 , -41.58, color)[1];
    P354_lat = offset_well_3(degLat2, degLon2, -414.48 , -34.56, color)[0];	 P354_lon = offset_well_3(degLat2, degLon2, -414.48 , -34.56, color)[1];
    P355_lat = offset_well_3(degLat2, degLon2, -415.63 , -27.5, color)[0];	 P355_lon = offset_well_3(degLat2, degLon2, -415.63 , -27.5, color)[1];
    P356_lat = offset_well_3(degLat2, degLon2, -416.72 , -20.64, color)[0];	 P356_lon = offset_well_3(degLat2, degLon2, -416.72 , -20.64, color)[1];
    P357_lat = offset_well_3(degLat2, degLon2, -417.74 , -14.22, color)[0];	 P357_lon = offset_well_3(degLat2, degLon2, -417.74 , -14.22, color)[1];
    P358_lat = offset_well_3(degLat2, degLon2, -418.64 , -8.48, color)[0];	 P358_lon = offset_well_3(degLat2, degLon2, -418.64 , -8.48, color)[1];
    P359_lat = offset_well_3(degLat2, degLon2, -419.41 , -3.66, color)[0];	 P359_lon = offset_well_3(degLat2, degLon2, -419.41 , -3.66, color)[1];
    P360_lat = offset_well_3(degLat2, degLon2, -415 , 0, color)[0];	 P360_lon = offset_well_3(degLat2, degLon2, -415 , 0, color)[1];
    P361_lat = offset_well_3(degLat2, degLon2, -415 , 0, color)[0];	 P361_lon = offset_well_3(degLat2, degLon2, -415 , 0, color)[1];
    P362_lat = offset_well_3(degLat2, degLon2, -419.41 , 3.66, color)[0];	 P362_lon = offset_well_3(degLat2, degLon2, -419.41 , 3.66, color)[1];
    P363_lat = offset_well_3(degLat2, degLon2, -418.64 , 8.48, color)[0];	 P363_lon = offset_well_3(degLat2, degLon2, -418.64 , 8.48, color)[1];
    P364_lat = offset_well_3(degLat2, degLon2, -417.74 , 14.22, color)[0];	 P364_lon = offset_well_3(degLat2, degLon2, -417.74 , 14.22, color)[1];
    P365_lat = offset_well_3(degLat2, degLon2, -416.72 , 20.64, color)[0];	 P365_lon = offset_well_3(degLat2, degLon2, -416.72 , 20.64, color)[1];
    P366_lat = offset_well_3(degLat2, degLon2, -415.63 , 27.5, color)[0];	 P366_lon = offset_well_3(degLat2, degLon2, -415.63 , 27.5, color)[1];
    P367_lat = offset_well_3(degLat2, degLon2, -414.48 , 34.56, color)[0];	 P367_lon = offset_well_3(degLat2, degLon2, -414.48 , 34.56, color)[1];
    P368_lat = offset_well_3(degLat2, degLon2, -413.32 , 41.58, color)[0];	 P368_lon = offset_well_3(degLat2, degLon2, -413.32 , 41.58, color)[1];
    P369_lat = offset_well_3(degLat2, degLon2, -412.16 , 48.32, color)[0];	 P369_lon = offset_well_3(degLat2, degLon2, -412.16 , 48.32, color)[1];
    P370_lat = offset_well_3(degLat2, degLon2, -411.05 , 54.54, color)[0];	 P370_lon = offset_well_3(degLat2, degLon2, -411.05 , 54.54, color)[1];
    P371_lat = offset_well_3(degLat2, degLon2, -410 , 60, color)[0];	 P371_lon = offset_well_3(degLat2, degLon2, -410 , 60, color)[1];
    P372_lat = offset_well_3(degLat2, degLon2, -409.07 , 64.9, color)[0];	 P372_lon = offset_well_3(degLat2, degLon2, -409.07 , 64.9, color)[1];
    P373_lat = offset_well_3(degLat2, degLon2, -408.24 , 69.6, color)[0];	 P373_lon = offset_well_3(degLat2, degLon2, -408.24 , 69.6, color)[1];
    P374_lat = offset_well_3(degLat2, degLon2, -407.47 , 74.1, color)[0];	 P374_lon = offset_well_3(degLat2, degLon2, -407.47 , 74.1, color)[1];
    P375_lat = offset_well_3(degLat2, degLon2, -406.72 , 78.4, color)[0];	 P375_lon = offset_well_3(degLat2, degLon2, -406.72 , 78.4, color)[1];
    P376_lat = offset_well_3(degLat2, degLon2, -405.94 , 82.5, color)[0];	 P376_lon = offset_well_3(degLat2, degLon2, -405.94 , 82.5, color)[1];
    P377_lat = offset_well_3(degLat2, degLon2, -405.08 , 86.4, color)[0];	 P377_lon = offset_well_3(degLat2, degLon2, -405.08 , 86.4, color)[1];
    P378_lat = offset_well_3(degLat2, degLon2, -404.1 , 90.1, color)[0];	 P378_lon = offset_well_3(degLat2, degLon2, -404.1 , 90.1, color)[1];
    P379_lat = offset_well_3(degLat2, degLon2, -402.96 , 93.6, color)[0];	 P379_lon = offset_well_3(degLat2, degLon2, -402.96 , 93.6, color)[1];
    P380_lat = offset_well_3(degLat2, degLon2, -401.61 , 96.9, color)[0];	 P380_lon = offset_well_3(degLat2, degLon2, -401.61 , 96.9, color)[1];
    P381_lat = offset_well_3(degLat2, degLon2, -400 , 100, color)[0];	 P381_lon = offset_well_3(degLat2, degLon2, -400 , 100, color)[1];
    P382_lat = offset_well_3(degLat2, degLon2, -398.11 , 103.17, color)[0];	 P382_lon = offset_well_3(degLat2, degLon2, -398.11 , 103.17, color)[1];
    P383_lat = offset_well_3(degLat2, degLon2, -395.96 , 106.56, color)[0];	 P383_lon = offset_well_3(degLat2, degLon2, -395.96 , 106.56, color)[1];
    P384_lat = offset_well_3(degLat2, degLon2, -393.6 , 109.99, color)[0];	 P384_lon = offset_well_3(degLat2, degLon2, -393.6 , 109.99, color)[1];
    P385_lat = offset_well_3(degLat2, degLon2, -391.08 , 113.28, color)[0];	 P385_lon = offset_well_3(degLat2, degLon2, -391.08 , 113.28, color)[1];
    P386_lat = offset_well_3(degLat2, degLon2, -388.44 , 116.25, color)[0];	 P386_lon = offset_well_3(degLat2, degLon2, -388.44 , 116.25, color)[1];
    P387_lat = offset_well_3(degLat2, degLon2, -385.72 , 118.72, color)[0];	 P387_lon = offset_well_3(degLat2, degLon2, -385.72 , 118.72, color)[1];
    P388_lat = offset_well_3(degLat2, degLon2, -382.97 , 120.51, color)[0];	 P388_lon = offset_well_3(degLat2, degLon2, -382.97 , 120.51, color)[1];
    P389_lat = offset_well_3(degLat2, degLon2, -380.24 , 121.44, color)[0];	 P389_lon = offset_well_3(degLat2, degLon2, -380.24 , 121.44, color)[1];
    P390_lat = offset_well_3(degLat2, degLon2, -377.57 , 121.33, color)[0];	 P390_lon = offset_well_3(degLat2, degLon2, -377.57 , 121.33, color)[1];
    P391_lat = offset_well_3(degLat2, degLon2, -375 , 120, color)[0];	 P391_lon = offset_well_3(degLat2, degLon2, -375 , 120, color)[1];
    P392_lat = offset_well_3(degLat2, degLon2, -372.61 , 117.02, color)[0];	 P392_lon = offset_well_3(degLat2, degLon2, -372.61 , 117.02, color)[1];
    P393_lat = offset_well_3(degLat2, degLon2, -370.4 , 112.32, color)[0];	 P393_lon = offset_well_3(degLat2, degLon2, -370.4 , 112.32, color)[1];
    P394_lat = offset_well_3(degLat2, degLon2, -368.29 , 106.31, color)[0];	 P394_lon = offset_well_3(degLat2, degLon2, -368.29 , 106.31, color)[1];
    P395_lat = offset_well_3(degLat2, degLon2, -366.2 , 99.36, color)[0];	 P395_lon = offset_well_3(degLat2, degLon2, -366.2 , 99.36, color)[1];
    P396_lat = offset_well_3(degLat2, degLon2, -364.06 , 91.88, color)[0];	 P396_lon = offset_well_3(degLat2, degLon2, -364.06 , 91.88, color)[1];
    P397_lat = offset_well_3(degLat2, degLon2, -361.8 , 84.24, color)[0];	 P397_lon = offset_well_3(degLat2, degLon2, -361.8 , 84.24, color)[1];
    P398_lat = offset_well_3(degLat2, degLon2, -359.34 , 76.85, color)[0];	 P398_lon = offset_well_3(degLat2, degLon2, -359.34 , 76.85, color)[1];
    P399_lat = offset_well_3(degLat2, degLon2, -356.6 , 70.08, color)[0];	 P399_lon = offset_well_3(degLat2, degLon2, -356.6 , 70.08, color)[1];
    P400_lat = offset_well_3(degLat2, degLon2, -353.51 , 64.34, color)[0];	 P400_lon = offset_well_3(degLat2, degLon2, -353.51 , 64.34, color)[1];
    P401_lat = offset_well_3(degLat2, degLon2, -350 , 60, color)[0];	 P401_lon = offset_well_3(degLat2, degLon2, -350 , 60, color)[1];
    P402_lat = offset_well_3(degLat2, degLon2, -346.01 , 56.84, color)[0];	 P402_lon = offset_well_3(degLat2, degLon2, -346.01 , 56.84, color)[1];
    P403_lat = offset_well_3(degLat2, degLon2, -341.6 , 54.32, color)[0];	 P403_lon = offset_well_3(degLat2, degLon2, -341.6 , 54.32, color)[1];
    P404_lat = offset_well_3(degLat2, degLon2, -336.84 , 52.38, color)[0];	 P404_lon = offset_well_3(degLat2, degLon2, -336.84 , 52.38, color)[1];
    P405_lat = offset_well_3(degLat2, degLon2, -331.8 , 50.96, color)[0];	 P405_lon = offset_well_3(degLat2, degLon2, -331.8 , 50.96, color)[1];
    P406_lat = offset_well_3(degLat2, degLon2, -326.56 , 50, color)[0];	 P406_lon = offset_well_3(degLat2, degLon2, -326.56 , 50, color)[1];
    P407_lat = offset_well_3(degLat2, degLon2, -321.2 , 49.44, color)[0];	 P407_lon = offset_well_3(degLat2, degLon2, -321.2 , 49.44, color)[1];
    P408_lat = offset_well_3(degLat2, degLon2, -315.79 , 49.22, color)[0];	 P408_lon = offset_well_3(degLat2, degLon2, -315.79 , 49.22, color)[1];
    P409_lat = offset_well_3(degLat2, degLon2, -310.4 , 49.28, color)[0];	 P409_lon = offset_well_3(degLat2, degLon2, -310.4 , 49.28, color)[1];
    P410_lat = offset_well_3(degLat2, degLon2, -305.11 , 49.56, color)[0];	 P410_lon = offset_well_3(degLat2, degLon2, -305.11 , 49.56, color)[1];
    P411_lat = offset_well_3(degLat2, degLon2, -300 , 50, color)[0];	 P411_lon = offset_well_3(degLat2, degLon2, -300 , 50, color)[1];
    P412_lat = offset_well_3(degLat2, degLon2, -295 , 50.85, color)[0];	 P412_lon = offset_well_3(degLat2, degLon2, -295 , 50.85, color)[1];
    P413_lat = offset_well_3(degLat2, degLon2, -290 , 52.32, color)[0];	 P413_lon = offset_well_3(degLat2, degLon2, -290 , 52.32, color)[1];
    P414_lat = offset_well_3(degLat2, degLon2, -285 , 54.27, color)[0];	 P414_lon = offset_well_3(degLat2, degLon2, -285 , 54.27, color)[1];
    P415_lat = offset_well_3(degLat2, degLon2, -280 , 56.56, color)[0];	 P415_lon = offset_well_3(degLat2, degLon2, -280 , 56.56, color)[1];
    P416_lat = offset_well_3(degLat2, degLon2, -275 , 59.06, color)[0];	 P416_lon = offset_well_3(degLat2, degLon2, -275 , 59.06, color)[1];
    P417_lat = offset_well_3(degLat2, degLon2, -270 , 61.64, color)[0];	 P417_lon = offset_well_3(degLat2, degLon2, -270 , 61.64, color)[1];
    P418_lat = offset_well_3(degLat2, degLon2, -265 , 64.16, color)[0];	 P418_lon = offset_well_3(degLat2, degLon2, -265 , 64.16, color)[1];
    P419_lat = offset_well_3(degLat2, degLon2, -260 , 66.48, color)[0];	 P419_lon = offset_well_3(degLat2, degLon2, -260 , 66.48, color)[1];
    P420_lat = offset_well_3(degLat2, degLon2, -255 , 68.47, color)[0];	 P420_lon = offset_well_3(degLat2, degLon2, -255 , 68.47, color)[1];
    P421_lat = offset_well_3(degLat2, degLon2, -250 , 70, color)[0];	 P421_lon = offset_well_3(degLat2, degLon2, -250 , 70, color)[1];
    P422_lat = offset_well_3(degLat2, degLon2, -245 , 71.27, color)[0];	 P422_lon = offset_well_3(degLat2, degLon2, -245 , 71.27, color)[1];
    P423_lat = offset_well_3(degLat2, degLon2, -240 , 72.52, color)[0];	 P423_lon = offset_well_3(degLat2, degLon2, -240 , 72.52, color)[1];
    P424_lat = offset_well_3(degLat2, degLon2, -235 , 73.71, color)[0];	 P424_lon = offset_well_3(degLat2, degLon2, -235 , 73.71, color)[1];
    P425_lat = offset_well_3(degLat2, degLon2, -230 , 74.76, color)[0];	 P425_lon = offset_well_3(degLat2, degLon2, -230 , 74.76, color)[1];
    P426_lat = offset_well_3(degLat2, degLon2, -225 , 75.63, color)[0];	 P426_lon = offset_well_3(degLat2, degLon2, -225 , 75.63, color)[1];
    P427_lat = offset_well_3(degLat2, degLon2, -220 , 76.24, color)[0];	 P427_lon = offset_well_3(degLat2, degLon2, -220 , 76.24, color)[1];
    P428_lat = offset_well_3(degLat2, degLon2, -215 , 76.55, color)[0];	 P428_lon = offset_well_3(degLat2, degLon2, -215 , 76.55, color)[1];
    P429_lat = offset_well_3(degLat2, degLon2, -210 , 76.48, color)[0];	 P429_lon = offset_well_3(degLat2, degLon2, -210 , 76.48, color)[1];
    P430_lat = offset_well_3(degLat2, degLon2, -205 , 75.99, color)[0];	 P430_lon = offset_well_3(degLat2, degLon2, -205 , 75.99, color)[1];
    P431_lat = offset_well_3(degLat2, degLon2, -200 , 75, color)[0];	 P431_lon = offset_well_3(degLat2, degLon2, -200 , 75, color)[1];
    P432_lat = offset_well_3(degLat2, degLon2, -195 , 73.26, color)[0];	 P432_lon = offset_well_3(degLat2, degLon2, -195 , 73.26, color)[1];
    P433_lat = offset_well_3(degLat2, degLon2, -190 , 70.68, color)[0];	 P433_lon = offset_well_3(degLat2, degLon2, -190 , 70.68, color)[1];
    P434_lat = offset_well_3(degLat2, degLon2, -185 , 67.47, color)[0];	 P434_lon = offset_well_3(degLat2, degLon2, -185 , 67.47, color)[1];
    P435_lat = offset_well_3(degLat2, degLon2, -180 , 63.84, color)[0];	 P435_lon = offset_well_3(degLat2, degLon2, -180 , 63.84, color)[1];
    P436_lat = offset_well_3(degLat2, degLon2, -175 , 60, color)[0];	 P436_lon = offset_well_3(degLat2, degLon2, -175 , 60, color)[1];
    P437_lat = offset_well_3(degLat2, degLon2, -170 , 56.16, color)[0];	 P437_lon = offset_well_3(degLat2, degLon2, -170 , 56.16, color)[1];
    P438_lat = offset_well_3(degLat2, degLon2, -165 , 52.53, color)[0];	 P438_lon = offset_well_3(degLat2, degLon2, -165 , 52.53, color)[1];
    P439_lat = offset_well_3(degLat2, degLon2, -160 , 49.32, color)[0];	 P439_lon = offset_well_3(degLat2, degLon2, -160 , 49.32, color)[1];
    P440_lat = offset_well_3(degLat2, degLon2, -155 , 46.74, color)[0];	 P440_lon = offset_well_3(degLat2, degLon2, -155 , 46.74, color)[1];
    P441_lat = offset_well_3(degLat2, degLon2, -150 , 45, color)[0];	 P441_lon = offset_well_3(degLat2, degLon2, -150 , 45, color)[1];
    P442_lat = offset_well_3(degLat2, degLon2, -144.89 , 43.97, color)[0];	 P442_lon = offset_well_3(degLat2, degLon2, -144.89 , 43.97, color)[1];
    P443_lat = offset_well_3(degLat2, degLon2, -139.6 , 43.36, color)[0];	 P443_lon = offset_well_3(degLat2, degLon2, -139.6 , 43.36, color)[1];
    P444_lat = offset_well_3(degLat2, degLon2, -134.21 , 43.14, color)[0];	 P444_lon = offset_well_3(degLat2, degLon2, -134.21 , 43.14, color)[1];
    P445_lat = offset_well_3(degLat2, degLon2, -128.8 , 43.28, color)[0];	 P445_lon = offset_well_3(degLat2, degLon2, -128.8 , 43.28, color)[1];
    P446_lat = offset_well_3(degLat2, degLon2, -123.44 , 43.75, color)[0];	 P446_lon = offset_well_3(degLat2, degLon2, -123.44 , 43.75, color)[1];
    P447_lat = offset_well_3(degLat2, degLon2, -118.2 , 44.52, color)[0];	 P447_lon = offset_well_3(degLat2, degLon2, -118.2 , 44.52, color)[1];
    P448_lat = offset_well_3(degLat2, degLon2, -113.16 , 45.56, color)[0];	 P448_lon = offset_well_3(degLat2, degLon2, -113.16 , 45.56, color)[1];
    P449_lat = offset_well_3(degLat2, degLon2, -108.4 , 46.84, color)[0];	 P449_lon = offset_well_3(degLat2, degLon2, -108.4 , 46.84, color)[1];
    P450_lat = offset_well_3(degLat2, degLon2, -103.99 , 48.33, color)[0];	 P450_lon = offset_well_3(degLat2, degLon2, -103.99 , 48.33, color)[1];
    P451_lat = offset_well_3(degLat2, degLon2, -100 , 50, color)[0];	 P451_lon = offset_well_3(degLat2, degLon2, -100 , 50, color)[1];
    P452_lat = offset_well_3(degLat2, degLon2, -96.49 , 51.99, color)[0];	 P452_lon = offset_well_3(degLat2, degLon2, -96.49 , 51.99, color)[1];
    P453_lat = offset_well_3(degLat2, degLon2, -93.4 , 54.4, color)[0];	 P453_lon = offset_well_3(degLat2, degLon2, -93.4 , 54.4, color)[1];
    P454_lat = offset_well_3(degLat2, degLon2, -90.66 , 57.16, color)[0];	 P454_lon = offset_well_3(degLat2, degLon2, -90.66 , 57.16, color)[1];
    P455_lat = offset_well_3(degLat2, degLon2, -88.2 , 60.2, color)[0];	 P455_lon = offset_well_3(degLat2, degLon2, -88.2 , 60.2, color)[1];
    P456_lat = offset_well_3(degLat2, degLon2, -85.94 , 63.44, color)[0];	 P456_lon = offset_well_3(degLat2, degLon2, -85.94 , 63.44, color)[1];
    P457_lat = offset_well_3(degLat2, degLon2, -83.8 , 66.8, color)[0];	 P457_lon = offset_well_3(degLat2, degLon2, -83.8 , 66.8, color)[1];
    P458_lat = offset_well_3(degLat2, degLon2, -81.71 , 70.21, color)[0];	 P458_lon = offset_well_3(degLat2, degLon2, -81.71 , 70.21, color)[1];
    P459_lat = offset_well_3(degLat2, degLon2, -79.6 , 73.6, color)[0];	 P459_lon = offset_well_3(degLat2, degLon2, -79.6 , 73.6, color)[1];
    P460_lat = offset_well_3(degLat2, degLon2, -77.39 , 76.89, color)[0];	 P460_lon = offset_well_3(degLat2, degLon2, -77.39 , 76.89, color)[1];
    P461_lat = offset_well_3(degLat2, degLon2, -75 , 80, color)[0];	 P461_lon = offset_well_3(degLat2, degLon2, -75 , 80, color)[1];
    P462_lat = offset_well_3(degLat2, degLon2, -72.61 , 83.09, color)[0];	 P462_lon = offset_well_3(degLat2, degLon2, -72.61 , 83.09, color)[1];
    P463_lat = offset_well_3(degLat2, degLon2, -70.4 , 86.32, color)[0];	 P463_lon = offset_well_3(degLat2, degLon2, -70.4 , 86.32, color)[1];
    P464_lat = offset_well_3(degLat2, degLon2, -68.29 , 89.63, color)[0];	 P464_lon = offset_well_3(degLat2, degLon2, -68.29 , 89.63, color)[1];
    P465_lat = offset_well_3(degLat2, degLon2, -66.2 , 92.96, color)[0];	 P465_lon = offset_well_3(degLat2, degLon2, -66.2 , 92.96, color)[1];
    P466_lat = offset_well_3(degLat2, degLon2, -64.06 , 96.25, color)[0];	 P466_lon = offset_well_3(degLat2, degLon2, -64.06 , 96.25, color)[1];
    P467_lat = offset_well_3(degLat2, degLon2, -61.8 , 99.44, color)[0];	 P467_lon = offset_well_3(degLat2, degLon2, -61.8 , 99.44, color)[1];
    P468_lat = offset_well_3(degLat2, degLon2, -59.34 , 102.47, color)[0];	 P468_lon = offset_well_3(degLat2, degLon2, -59.34 , 102.47, color)[1];
    P469_lat = offset_well_3(degLat2, degLon2, -56.6 , 105.28, color)[0];	 P469_lon = offset_well_3(degLat2, degLon2, -56.6 , 105.28, color)[1];
    P470_lat = offset_well_3(degLat2, degLon2, -53.51 , 107.81, color)[0];	 P470_lon = offset_well_3(degLat2, degLon2, -53.51 , 107.81, color)[1];
    P471_lat = offset_well_3(degLat2, degLon2, -50 , 110, color)[0];	 P471_lon = offset_well_3(degLat2, degLon2, -50 , 110, color)[1];
    P472_lat = offset_well_3(degLat2, degLon2, -40.8 , 113.44, color)[0];	 P472_lon = offset_well_3(degLat2, degLon2, -40.8 , 113.44, color)[1];
    P473_lat = offset_well_3(degLat2, degLon2, -35.26 , 114.79, color)[0];	 P473_lon = offset_well_3(degLat2, degLon2, -35.26 , 114.79, color)[1];
    P474_lat = offset_well_3(degLat2, degLon2, -29.4 , 115.92, color)[0];	 P474_lon = offset_well_3(degLat2, degLon2, -29.4 , 115.92, color)[1];
    P475_lat = offset_well_3(degLat2, degLon2, -23.44 , 116.88, color)[0];	 P475_lon = offset_well_3(degLat2, degLon2, -23.44 , 116.88, color)[1];
    P476_lat = offset_well_3(degLat2, degLon2, -17.6 , 117.68, color)[0];	 P476_lon = offset_well_3(degLat2, degLon2, -17.6 , 117.68, color)[1];
    P477_lat = offset_well_3(degLat2, degLon2, -12.11 , 118.37, color)[0];	 P477_lon = offset_well_3(degLat2, degLon2, -12.11 , 118.37, color)[1];
    P478_lat = offset_well_3(degLat2, degLon2, -7.2 , 118.96, color)[0];	 P478_lon = offset_well_3(degLat2, degLon2, -7.2 , 118.96, color)[1];
    P479_lat = offset_well_3(degLat2, degLon2, -3.09 , 119.5, color)[0];	 P479_lon = offset_well_3(degLat2, degLon2, -3.09 , 119.5, color)[1];
    P480_lat = offset_well_3(degLat2, degLon2, 0 , 120, color)[0];	 P480_lon = offset_well_3(degLat2, degLon2, 0 , 120, color)[1];

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
      [P300_lat, P300_lon],
      [P301_lat, P301_lon],
      [P302_lat, P302_lon],
      [P303_lat, P303_lon],
      [P304_lat, P304_lon],
      [P305_lat, P305_lon],
      [P306_lat, P306_lon],
      [P307_lat, P307_lon],
      [P308_lat, P308_lon],
      [P309_lat, P309_lon],
      [P310_lat, P310_lon],
      [P311_lat, P311_lon],
      [P312_lat, P312_lon],
      [P313_lat, P313_lon],
      [P314_lat, P314_lon],
      [P315_lat, P315_lon],
      [P316_lat, P316_lon],
      [P317_lat, P317_lon],
      [P318_lat, P318_lon],
      [P319_lat, P319_lon],
      [P320_lat, P320_lon],
      [P321_lat, P321_lon],
      [P322_lat, P322_lon],
      [P323_lat, P323_lon],
      [P324_lat, P324_lon],
      [P325_lat, P325_lon],
      [P326_lat, P326_lon],
      [P327_lat, P327_lon],
      [P328_lat, P328_lon],
      [P329_lat, P329_lon],
      [P330_lat, P330_lon],
      [P331_lat, P331_lon],
      [P332_lat, P332_lon],
      [P333_lat, P333_lon],
      [P334_lat, P334_lon],
      [P335_lat, P335_lon],
      [P336_lat, P336_lon],
      [P337_lat, P337_lon],
      [P338_lat, P338_lon],
      [P339_lat, P339_lon],
      [P340_lat, P340_lon],
      [P341_lat, P341_lon],
      [P342_lat, P342_lon],
      [P343_lat, P343_lon],
      [P344_lat, P344_lon],
      [P345_lat, P345_lon],
      [P346_lat, P346_lon],
      [P347_lat, P347_lon],
      [P348_lat, P348_lon],
      [P349_lat, P349_lon],
      [P350_lat, P350_lon],
      [P351_lat, P351_lon],
      [P352_lat, P352_lon],
      [P353_lat, P353_lon],
      [P354_lat, P354_lon],
      [P355_lat, P355_lon],
      [P356_lat, P356_lon],
      [P357_lat, P357_lon],
      [P358_lat, P358_lon],
      [P359_lat, P359_lon],
      [P360_lat, P360_lon],
      [P361_lat, P361_lon],
      [P362_lat, P362_lon],
      [P363_lat, P363_lon],
      [P364_lat, P364_lon],
      [P365_lat, P365_lon],
      [P366_lat, P366_lon],
      [P367_lat, P367_lon],
      [P368_lat, P368_lon],
      [P369_lat, P369_lon],
      [P370_lat, P370_lon],
      [P371_lat, P371_lon],
      [P372_lat, P372_lon],
      [P373_lat, P373_lon],
      [P374_lat, P374_lon],
      [P375_lat, P375_lon],
      [P376_lat, P376_lon],
      [P377_lat, P377_lon],
      [P378_lat, P378_lon],
      [P379_lat, P379_lon],
      [P380_lat, P380_lon],
      [P381_lat, P381_lon],
      [P382_lat, P382_lon],
      [P383_lat, P383_lon],
      [P384_lat, P384_lon],
      [P385_lat, P385_lon],
      [P386_lat, P386_lon],
      [P387_lat, P387_lon],
      [P388_lat, P388_lon],
      [P389_lat, P389_lon],
      [P390_lat, P390_lon],
      [P391_lat, P391_lon],
      [P392_lat, P392_lon],
      [P393_lat, P393_lon],
      [P394_lat, P394_lon],
      [P395_lat, P395_lon],
      [P396_lat, P396_lon],
      [P397_lat, P397_lon],
      [P398_lat, P398_lon],
      [P399_lat, P399_lon],
      [P400_lat, P400_lon],
      [P401_lat, P401_lon],
      [P402_lat, P402_lon],
      [P403_lat, P403_lon],
      [P404_lat, P404_lon],
      [P405_lat, P405_lon],
      [P406_lat, P406_lon],
      [P407_lat, P407_lon],
      [P408_lat, P408_lon],
      [P409_lat, P409_lon],
      [P410_lat, P410_lon],
      [P411_lat, P411_lon],
      [P412_lat, P412_lon],
      [P413_lat, P413_lon],
      [P414_lat, P414_lon],
      [P415_lat, P415_lon],
      [P416_lat, P416_lon],
      [P417_lat, P417_lon],
      [P418_lat, P418_lon],
      [P419_lat, P419_lon],
      [P420_lat, P420_lon],
      [P421_lat, P421_lon],
      [P422_lat, P422_lon],
      [P423_lat, P423_lon],
      [P424_lat, P424_lon],
      [P425_lat, P425_lon],
      [P426_lat, P426_lon],
      [P427_lat, P427_lon],
      [P428_lat, P428_lon],
      [P429_lat, P429_lon],
      [P430_lat, P430_lon],
      [P431_lat, P431_lon],
      [P432_lat, P432_lon],
      [P433_lat, P433_lon],
      [P434_lat, P434_lon],
      [P435_lat, P435_lon],
      [P436_lat, P436_lon],
      [P437_lat, P437_lon],
      [P438_lat, P438_lon],
      [P439_lat, P439_lon],
      [P440_lat, P440_lon],
      [P441_lat, P441_lon],
      [P442_lat, P442_lon],
      [P443_lat, P443_lon],
      [P444_lat, P444_lon],
      [P445_lat, P445_lon],
      [P446_lat, P446_lon],
      [P447_lat, P447_lon],
      [P448_lat, P448_lon],
      [P449_lat, P449_lon],
      [P450_lat, P450_lon],
      [P451_lat, P451_lon],
      [P452_lat, P452_lon],
      [P453_lat, P453_lon],
      [P454_lat, P454_lon],
      [P455_lat, P455_lon],
      [P456_lat, P456_lon],
      [P457_lat, P457_lon],
      [P458_lat, P458_lon],
      [P459_lat, P459_lon],
      [P460_lat, P460_lon],
      [P461_lat, P461_lon],
      [P462_lat, P462_lon],
      [P463_lat, P463_lon],
      [P464_lat, P464_lon],
      [P465_lat, P465_lon],
      [P466_lat, P466_lon],
      [P467_lat, P467_lon],
      [P468_lat, P468_lon],
      [P469_lat, P469_lon],
      [P470_lat, P470_lon],
      [P471_lat, P471_lon],
      [P472_lat, P472_lon],
      [P473_lat, P473_lon],
      [P474_lat, P474_lon],
      [P475_lat, P475_lon],
      [P476_lat, P476_lon],
      [P477_lat, P477_lon],
      [P478_lat, P478_lon],
      [P479_lat, P479_lon],
      [P480_lat, P480_lon]

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