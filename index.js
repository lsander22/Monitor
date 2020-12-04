//CPUMonitor
const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var os = require('os-utils');
const si = require('systeminformation');
const osn = require('os');

//Variablen für die Arrays
var cpuSource = 0;
var mem = 0; 
var ms = 0;
const dataCount = 20;
var recByte = 0; 

const liveData = {
    cpu: [],
    time: [],
    hostname: "hostname",
    freemem: [],
    writtenMb: [],
    recBytes: [],
    sysuptime: 1,
};

for (let i = 0; i < dataCount; i++) {
    liveData.cpu.push('');
    liveData.freemem.push('');
    liveData.time.push('');
    liveData.writtenMb.push('');
    liveData.recBytes.push('');
    
}

app.use(express.static('public'));


http.listen(3000, function () {
    console.log('listening on *:3000');
});


function getCpu(){
    os.cpuUsage(function(v){
        //cpuSource = v*100;
        cpuSource = v;
    });
}
function bytesToMb(bytes) {
    return (bytes / 1000000);
};

function getData(){
    mem = os.freememPercentage();
    liveData.hostname = osn.hostname(); 
    liveData.sysuptime = os.sysUptime(); 
    si.fsStats().then(data => {
        ms = bytesToMb(data.wx_sec); 
    })
    si.networkStats().then(data => {
        recByte = bytesToMb(data[0].rx_sec);
    })
    

}

//Send Live Data Object
const onlineEmit = () => {
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
   
    // console.log(`${time} - CPU (%): ${cpuSource}`);
    if (liveData.time.length >= dataCount){
        liveData.time.shift();
    }
    if (liveData.cpu.length >= dataCount){
        liveData.cpu.shift();
    }
    if (liveData.freemem.length >= dataCount){
        liveData.freemem.shift();
    }
    if (liveData.writtenMb.length >= dataCount){
        liveData.writtenMb.shift();
    }
    if (liveData.recBytes.length >= dataCount){
        liveData.recBytes.shift();
    } 

    liveData.cpu.push(cpuSource);
    liveData.freemem.push(mem);
    liveData.time.push(time);
    liveData.writtenMb.push(ms);
    liveData.recBytes.push(recByte);

    io.emit('liveData', liveData);
  
};
onlineEmit();
setInterval(function(){
    onlineEmit();
    getCpu();
    getData();
}, 1000);

