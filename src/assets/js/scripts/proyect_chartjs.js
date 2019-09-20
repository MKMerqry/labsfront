$(function() {

    var lineData = {
        labels: ["Act 01", "Act 02", "Act 03", "Act 04", "Act 05", "Act 06", "Act 07"],
        datasets: [
            {
                label: "Fase 1",
                backgroundColor: 'rgba(67,174,168,0.5)',
                borderColor: 'rgba(67,174,168,0.7)',
                pointBackgroundColor: 'rgba(67,174,168,1)',
                pointBorderColor: "#fff",
                data: [28, 48, 40, 19, 86, 27, 90],
                //fill: false, // for removing background
            },{
                label: "Fase 2",
                backgroundColor: 'rgba(213,217,219, 0.5)',
                borderColor: 'rgba(213,217,219, 1)',
                pointBorderColor: "#fff",
                data: [65, 59, 80, 81, 56, 55, 40],
                //fill: false,
            }
        ]
    };
    var lineOptions = {
        responsive: true,
        maintainAspectRatio: false
    };
    var ctx1 = document.getElementById("line_chart");
    new Chart(ctx1, {type: 'line', data: lineData, options:lineOptions});

    // Bar Chart example

var barData = {
  labels: ["Act 01", "Act 02", "Act 03", "Act 04", "Act 05", "Act 06", "Act 07"],
  datasets: [
      {
          label: "Fase 1",
          backgroundColor:'#DADDE0', //'rgba(220, 220, 220, 0.5)',
          data: [45, 80, 58, 74, 54, 59, 40]
      },
      {
          label: "Fase 2",
          //backgroundColor:'#84cac6',// 'rgba(26,179,148,0.5)',
          backgroundColor: '#18C5A9', // '#30C8B3'
          borderColor: "#fff",
          data: [29, 48, 40, 19, 78, 31, 85]
      }
  ]
};
var barOptions = {
  responsive: true,
  maintainAspectRatio: false
};

var ctx2 = document.getElementById("bar_chart");
new Chart(ctx2, {type: 'bar', data: barData, options:barOptions}); 



var doughnutData100 = {
labels: ["Fase 1","Fase 2","Fase 3" ],
datasets: [{
    data: [200,40,60],
    backgroundColor: ["#3bceb6","#bdc3c7","#8995c7"]
}]
} ;


var doughnutOptions100 = {
responsive: true
};


var ctx4 = document.getElementById("doughnut_chart100");
new Chart(ctx4, {type: 'doughnut', data: doughnutData100, options:doughnutOptions100});


var doughnutData = {
labels: ["Fase 1","Fase 2","Fase 3","Pendiente" ],
datasets: [{
  data: [180,5,15,100],
  backgroundColor: ["#3bceb6","#bdc3c7","#8995c7","#ffffff"]
}]
} ;


var doughnutOptions = {
responsive: true
};


var ctx5 = document.getElementById("doughnut_chart");
new Chart(ctx5, {type: 'doughnut', data: doughnutData, options:doughnutOptions});



});
