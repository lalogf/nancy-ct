var dataToGraph = [[0,0,0]]
document.addEventListener("DOMContentLoaded", function(){
  var sys = Array.from(document.getElementsByClassName('bp'));
  sys.forEach(function(bp){
    console.log(bp.innerHTML)
  });
})



google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawLineColors);

function drawLineColors() {
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Systolic');
      data.addColumn('number', 'Diastolic');

      data.addRows([
        [0, 0, 0],    [1, 2, 1],   [2, 23, 15],  [3, 17, 9],   [4, 90, 10],  [5, 9, 5],
        [6, 11, 3]
      ]);

      var options = {
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'Popularity'
        },
        colors: ['#a52714', '#097138']
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }