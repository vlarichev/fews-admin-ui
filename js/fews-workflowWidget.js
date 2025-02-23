import { dataTable } from "./fews-dataTable";
import { chartFEWS }  from "./fews-chart";
import formatStatusResults from "./fews-returnStatus";
import objectsAreSame  from "./util/objectsareSame";
import  "./components/statusBar/statusBar";



var updateBadge = (newnum) => {
    $('#workflowImportStatus').fadeOut(100);
    var message = (oldNum == newnum) ? `<span class="badge badge-success">${newnum} - keine &Auml;nderungen</span>` : `<span class="badge badge-success">${newnum}</span>`;
    $("#workflowImportStatus")[0].innerHTML = message;
    $('#workflowImportStatus').fadeIn(250); 
    oldNum = newnum;
};

var updateValues = function(statusLib){
    // $('#fews_approved').text(statusLib['approved']?statusLib['approved']:0);
    $('#fews_fertig').text(statusLib.done);
    $('#fews_laufend').html((statusLib.running ? statusLib.running : 0)+"/<sub>"+(statusLib.pending? statusLib.pending : 0)+"</sub>");
    $('#fews_warnungen').text(statusLib.partly);
    $('#fews_fehler').text(statusLib.bad);
};

var setDays = (days) => defaultDays = !!days ? days : 0;

var refreshWidgetAnimation;
var defaultDays = 0;
var refreshRate;
var urlRequest;
var oldNum;
var oldLibStatus;

var vm = {

};

$("#resfreshSelector").on("change", function(div){
    update();
    refreshRate = parseInt(div.target.value);
});

function update(){
    refreshWidgetAnimation.set(0);
    refreshWidgetAnimation.animate(1, {duration: refreshRate});
    $.ajax({
        url: `..${urlRequest}/${defaultDays}`,
        dataType: "json",
        cache: false,
        success: (json) => showResults(json, true),
        error: (e) => console.log("Tabelle kann nicht aktualisiert werden, Server offline? " +  e.status)
    });
}

var init = function(url, refreshrate, defaultChartDays, bar){
    urlRequest = url;
    refreshRate = refreshrate ? refreshrate:100000;
    refreshWidgetAnimation = bar;
    defaultDays = defaultChartDays? defaultChartDays : 14;
    (function watchService(){
        update();
        setTimeout(watchService,refreshRate);
    })();
};


var showResults = function (arrayOfStatus, isHydrotecService) {
    var statusLib = {};
    var placeholderCounter = 0;  
    
    if(isHydrotecService)arrayOfStatus.forEach( ({status, COUNT}) => statusLib[status] = COUNT );
    else arrayOfStatus.forEach(function({status}){ statusLib[status] ? statusLib[status]++ : statusLib[status] = 1 ; });
    
    for (var key in statusLib) {
        placeholderCounter = placeholderCounter + statusLib[key];
    }

    if(oldLibStatus && !objectsAreSame(statusLib,oldLibStatus)) {
        dataTable.update();
        chartFEWS.refresh();
    }
    oldLibStatus = statusLib;

    var formated = formatStatusResults(statusLib);

    updateValues(formated);   
    updateBadge(placeholderCounter);
};


export const statuswidget = {
    init: (cfg, bar) => init(cfg.widgetURL, cfg.refreshRate, cfg.defaultChartDays, bar),
    setDays: (days) => setDays(days)
};