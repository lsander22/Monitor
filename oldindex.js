const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var os = require('os-utils');
var cpuSource = 0; 
const dataCount = 20;
//Vielleicht lieber Objekte 
const liveData = {
    cpu: [],
    time: [],
    platform: "platform",
    freemem: 1,
    totalmem: 1,
    sysuptime: 1,

};

for (let i = 0; i < dataCount; i++) {
    liveData.cpu.push('');
    liveData.time.push('');
    
}

app.use(express.static('public'));


http.listen(3000, function () {
    console.log('listening on *:3000');
});
app.get('/test',function(req, res){
    res.send('index');
});

function getCpu(){
    os.cpuUsage(function(v){
        //cpuSource = v*100;
        cpuSource = v;
    });
}

function getData(){
    liveData.freemem = os.freemem();
    liveData.totalmem = os.totalmem();
    liveData.platform = os.platform(); 
    liveData.sysuptime = os.sysUptime(); 

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
    liveData.cpu.push(cpuSource);
    liveData.time.push(time);
    
    io.emit('liveData', liveData);
  
};
onlineEmit();
setInterval(function(){
    onlineEmit();
    getCpu();
    getData();
}, 1000);

