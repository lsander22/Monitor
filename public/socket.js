//Make connection 
var socket = io('http://localhost:3000');


//Hier werden die Canvas Elemente erstellt! 
//CPU Auslastung
const chart = new Chart(document.getElementById("cpu"), {
    type: 'line',
    data: {
        labels: [],
        datasets:[{
            label: "CPU",
            backgroundColor: 'rgb(0,116,217)',
            data:[]
        }] 
    },
        options: {
            title: {
                display: true, 
                
                position: 'top',
                fontsize: 20
            },
            animation: {
                duration: 0
            },
            scales:{
                yAxes:[{
                    ticks: {
                        beginAtZero: true,
                        max: 1,
                        steps: 0.1,
                        stepValue: 0.1,
                        
                        /*userCallback: function (label, index, labels){
                            if (Math.floor(label) === label){
                                return label; 
                            }
                        } */
                    }
                }]
            }
        }
});
const chartmem = new Chart(document.getElementById("memory"), {
    type: 'line',
     data: {
        labels: [],
        datasets:[{
            label: "Free Memory",
            backgroundColor: 'rgb(50, 168, 82)',
            data:[]
        }] 
        },
        options: {
            title: {
                display: true, 
                        
                position: 'top',
                fontsize: 20
            },
            animation: {
                duration: 0
            },
            scales:{
                yAxes:[{
                    ticks: {
                    beginAtZero: true,
                    max: 1,
                    steps: 0.1,
                    stepValue: 0.1,             
            }
         }]
       }
     }
});
const chartwbyte = new Chart(document.getElementById("writtenbytes"), {
    type: 'line',
     data: {
        labels: [],
        datasets:[{
            label: "Written MB per sec",
            backgroundColor: '#FF4136',
            data:[]
        }] 
        },
        options: {
            title: {
                display: true, 
                        
                position: 'top',
                fontsize: 20
            },
            animation: {
                duration: 0
            },
            scales:{
                yAxes:[{
                    ticks: {
                    beginAtZero: true,
                    max: 250,
                    steps: 10,
                    stepValue: 10             
            }
         }]
       }
     }
});
const chartrecivedB = new Chart(document.getElementById("recievedBytes"), {
    type: 'line',
     data: {
        labels: [],
        datasets:[{
            label: "Recieved MB via Network per sec ",
            backgroundColor: '#FFDC00',
            data:[]
        }] 
        },
        options: {
            title: {
                display: true, 
                        
                position: 'top',
                fontsize: 20
            },
            animation: {
                duration: 0
            },
            scales:{
                yAxes:[{
                    ticks: {
                    beginAtZero: true,
                    max: 250,
                    steps: 10,
                    stepValue: 10             
            }
         }]
       }
     }
});
socket.on('liveData',function(msg){
    console.log(msg);

    let liveData = {
        cpu: [],
        time: [],
        platform: "platform",
        freemem: [],
        writtenMb: [],
        recBytes: [],
        sysuptime: 1,
       
    };
    liveData = msg;
    //CPU Chart
    chart.data.labels = liveData.time;
    chart.data.datasets[0].data = liveData.cpu;
    chart.update();
    
    //Memory Chart
    chartmem.data.labels = liveData.time;
    chartmem.data.datasets[0].data = liveData.freemem;
    chartmem.update();

    //Written Bytes per sec
    chartwbyte.data.labels = liveData.time;
    chartwbyte.data.datasets[0].data = liveData.writtenMb;
    chartwbyte.update();

    //Recieved Bytes per sec via Network 
    chartrecivedB.data.labels = liveData.time; 
    chartrecivedB.data.datasets[0].data = liveData.recBytes;
    chartrecivedB.update();

    //Platform to FrontEnd
    const platform = document.getElementById("hostname"); 
    platform.innerHTML = "Hostname: "+liveData.hostname;

    //Uptime to FrontEnd  
    String.prototype.toHHMMSS = function () {
        var sec_num = parseInt(this, 10);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
    
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours + ':' + minutes + ':' + seconds;
    }

    const uptime = document.getElementById("uptime"); 
    var input = liveData.sysuptime;
    uptime.innerHTML = (liveData.sysuptime.toString().toHHMMSS());
});