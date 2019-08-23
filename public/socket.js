
//Make connection 

var socket = io('http://localhost:3000');
const ctx = document.getElementById('cpu'); 

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



socket.on('liveData',function(msg){
    //console.log(msg);

    let liveData = {
        cpu: [],
        time: []
    };

    liveData = msg;
    
    chart.data.labels = liveData.time;
    chart.data.datasets[0].data = liveData.cpu;
    
    chart.update();
})