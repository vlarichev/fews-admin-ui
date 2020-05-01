import moment from 'moment';
import Chart from "chart.js";
import de from 'moment/locale/de';
import ChartDataLabels from  "chartjs-plugin-datalabels"; 
import formatStatusResults from "./fews-returnStatus";

var Set = require('es6-set');

moment.locale('de');

const theme     = { primary: 'rgb(45,149,230)', success: 'rgb(51,168,90)', warning: 'rgb(209,207,76)', danger: 'rgb(168,76,43)'};
const g_options = {
    animation: { easing: 'easeInOutQuart', duration: 850 },
    // animation: false,
    title: { display: false },
    legend: { display: true },
    responsive: true,
    plugins: {
        datalabels: {
            color: 'white',
            display: 'auto',
            font: {
                    weight: 'bold',
                    size: 14
            },
            formatter: function(num){
            if(num != 0)  return Math.round(num);
            else return null;
            }
        }
    }, 
    tooltips: { displayColors: false },
    maintainAspectRatio: false,
    scales: {
        xAxes: [{ gridLines: {display:false }, stacked: true }],
        yAxes: [{ ticks: {display: false }, gridLines: {drawBorder: true, display:true }, stacked: true }]
    }
};

const ctx       = document.getElementById("myChart").getContext('2d');

let restChart;
let defDays;
let reqURL;
var myChart;

var g_dataset   = { datasets:[] };

var params      = { 
    plugins: [ChartDataLabels],
    type: 'bar', 
    data: g_dataset, 
    options: g_options
};

    
var requestUrl;

var getChartData = function(url){
    if(url) requestUrl = url;
    console.info(requestUrl);
    $.ajax({
        url: requestUrl,
        dataType: "json",
        cache: false,
        success: (json) => createLabels(json),
        error: function(e){
            console.warn("nicht erreichbar - ", e.statusText);
            getChartData("fulltimeline.json");
        }
    });
};

function createLabels(json){
    console.log(json);
    
    /**alle Daten ein mal holen */    
    var uniqueDatumLabels = json.length ? [...new Set(json.map(a=> a.DATE))]: [];

    var dataset = {};
    var formatedLabels = [];
    var flat = { "done":[], "running":[], "partly":[], "error":[]};

    uniqueDatumLabels.forEach(function(datum){
        /** Labels sammeln für die x-Asche, min 1- max 31 */
        var resultDate = moment(datum, 'YYYY-MM-DD').format("Do MM");
        if (resultDate === moment().format("Do MM")) resultDate = "heute";
        formatedLabels.push(resultDate);


        /** Alle Statuseinträge für diesen datum sammeln*/
        json.filter(json => json.DATE===datum)
            .forEach((entry) => dataset[entry.status] = entry.count );
        

        var resultLib = formatStatusResults(dataset);
 
        flat.partly.push(resultLib.partly);
        flat.done.push(resultLib.done);
        flat.running.push(resultLib.run);
        flat.error.push(resultLib.bad);        
    });
    
    g_dataset.datasets = [
        {label: 'Laufend', data: flat.running, hoverBackgroundColor: theme.primary, backgroundColor: theme.primary}, 
        {label: 'Warnungen', data: flat.partly, hoverBackgroundColor: theme.warning, backgroundColor: theme.warning}, 
        {label: 'Fehler', data: flat.error, hoverBackgroundColor: theme.danger, backgroundColor: theme.danger},
        {label: 'Abgeschlossen', data: flat.done, hoverBackgroundColor: theme.success, backgroundColor: theme.success},
    ];

    g_dataset.labels = formatedLabels;

    myChart.update();
}


export const chartFEWS = {
    init:  function(cfg){
        $(".form-control").val(cfg.defaultChartDays);
        restChart = cfg.restCallChartJS ? cfg.restCallChartJS : "";
        defDays   = cfg.defaultChartDays ? cfg.defaultChartDays : 7;
        reqURL    = window.location.protocol + "//" + window.location.host + restChart;
        myChart   = new Chart(ctx,params);
        getChartData(reqURL + defDays);
    },
    update: (days) => getChartData(reqURL + days),
    refresh: () => getChartData()
};