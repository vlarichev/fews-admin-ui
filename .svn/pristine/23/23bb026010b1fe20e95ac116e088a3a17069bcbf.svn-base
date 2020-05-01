import DataTable from "datatables.net-bs4";
import parser from 'fast-xml-parser';
import moment from 'moment';

// import de from 'moment/locale/de';
// moment.locale('de');


let getFullReponceULR,table, staticURL;

let defaultDays = 0;


var showLoadEnd = () => {
    $("#tableLoaderSpinner").hide();
    $("#dataTable").css('filter','opacity(100%)');
};

var showLoadStart = () => {
    $("#tableLoaderSpinner").show();
    $("#dataTable").css('filter','opacity(50%)');
    
};


// https://datatables.net/reference/option/
let DataTable_Parameter = {
    // stateSave: true,
    "columnDefs": [
        { "width": "40%", "targets": 0 },
        { "width": "20%", "targets": 3 }
    ],
    deferRender: true,
    "search": {regex: true},
    "order": [[3, "desc"]],
    "lengthMenu": [[5, 10, 50, 100, -1],[5, 10, 50, 100, "Alle anzeigen"]],
    createdRow: function( row, data) {
        if(!data[3]) console.warn("exeption found: " + data);
        var status = data[3]? data[3] : null;
        if ( status.includes('warte')) $(row).addClass( 'table-success' );
        else if(status.includes('fully')) $(row).addClass( 'table-success' );
        else if(status.includes('running')) $(row).addClass( 'table-primary' );
        else if(status.includes('partly')) $(row).addClass( 'table-warning' );
        else if(status.includes('invalid')) $(row).addClass( 'table-danger' );
        else if(status.includes('failed')) $(row).addClass( 'table-danger' );
        else if(status.includes('terminated')) $(row).addClass( 'table-danger' );
        else if(status.includes('pending')) $(row).addClass( 'table-primary' );
        else if(status.includes('error')) $(row).addClass( 'table-danger' );
    }
};

const formatTime = "DD.MM.YY - HH:mm:ss";
// Input Daten sind GMT
var timeParse = (time) =>  moment(time, 'YYYY-MM-DD h:mm:ss').format(formatTime);


function createTable(taskrunsJson) { 
    if(!table) table = $('#dataTable').DataTable(DataTable_Parameter);
    if(taskrunsJson.length == 0) taskrunsJson = [{ description: "Keine Auff&auml;lligkeiten f&uuml;r diese Auswahl", dispatchTime: moment(), status: "warte auf updates" }];
    
    function parseLine({fssId,taskrunid,description,dispatchTime,completionTime,status,count}) {
        var pdispatchTime = dispatchTime ? timeParse(dispatchTime)  : null;
        var pcompletionTime = completionTime ? timeParse(completionTime)  : null;
        var countBadge = count && count > 1 ? `<span class="badge badge-primary">${count}</span>`: "";
        var line =    [`<span style="cursor: help;" title="${fssId}: ${taskrunid}">${description}</span> ${countBadge}`, pdispatchTime, pcompletionTime, status];
        table.row.add(line);
    }

    function drawTable(){
        table.draw();
        showLoadEnd();
    }

    function processArray(items, process) {
        table.clear();
        var workflow = items.concat();
        setTimeout(function checkBigArray() {
            process(workflow.shift());
            if (workflow.length > 0) setTimeout(checkBigArray, 10);
            else setTimeout(drawTable, 100);
        }, 0);
    }
    processArray(taskrunsJson, parseLine);
}

var updateTable = function (url){
    console.log(url + "/"+defaultDays);
    
    showLoadStart();
    $.ajax({
        url: url + "/" +defaultDays,
        dataType: "json",
        cache: false,
        success: (json) => createTable(json),
        error: (e) => console.log("Tabelle kann nicht akutlaisiert werden, Server offline?")
    });
};

var useClickMode = function(){   
    $('#card_fertig').on( "click",  function(){enableCompleted(); searchTerm("completed|approved");}).on("dblclick", resetSearch);
    $('#card_laufend').on( "click", function(){searchTerm("running|pending");}).on("dblclick", resetSearch);
    $('#card_warnung').on( "click", function(){searchTerm("partly");}).on("dblclick", resetSearch);
    $('#card_fehler').on( "click",  function(){searchTerm("failed|invalid|terminated");}).on("dblclick", resetSearch);
};

var enableCompleted = () => {
    // nicht enabled
    if(!$('#doneIsEnabled').is(':checked')) $("#doneIsEnabled").click();
};

var resetSearch = () => {
    $(".filterBeschreibung").html("");
    table.column(3).search("").draw();
};

var searchTerm = function(searchTerm){
    $(".filterBeschreibung").html("<span title='Filter löschen' class='btn badge btn-sm btn-success'> Filter nach <b>" + searchTerm.split("|").join("</b> und <b>")+ "</b> <i class='fa fa-times' aria-hidden='true'></i><span>");
    table.column(3).search(searchTerm, true).draw();
};

var useStatic   = () => getDataFromXML(staticURL);

DataTable();


$.fn.dataTable.moment = function ( format, locale ) {
    var types = $.fn.dataTable.ext.type;
    // Add type detection
    types.detect.unshift( function ( d ) { return moment( d, format, locale, true ).isValid() ? 'moment-'+format : null; } );
    // Add sorting method - use an integer for the sorting
    types.order[ 'moment-'+format+'-pre' ] = function ( d ) { return moment( d, format, locale, true ).unix(); };
};

var setDays = (days) => defaultDays = days;

var getData = (url) => {
	window.console.log("using " + url);
    $.ajax({
        url: url + "/"+defaultDays,
        dataType: "json",
        success: function(jsonReponce) {
            // console.log(jsonReponce);
            createTable(jsonReponce);
            useClickMode();
        },
        error: function(e){
            console.log("server ist offline, verwende cache");
        	useStatic();
        }
    });
};


 var getDataFromXML = (url) => {
    var xml2jsonOptions = {
        attributeNamePrefix : "",
        ignoreAttributes : false,
    };
	window.console.log("using xml " + url);
    $.ajax({
        url: url,
        dataType: "xml",
        success: function(xmlResponse) {
            //wegen IE
            var s = new XMLSerializer();
            var newXmlStr = s.serializeToString(xmlResponse.firstChild);
            var taskrunsJson = parser.parse(newXmlStr, xml2jsonOptions);
            createTable(taskrunsJson.TaskRuns.taskRun);

        },
        error: function(e){
            console.log("server ist offline, verwende cache");
        	useStatic(); 
        }
    });
};


//initiale Darstellung:
$('#doneIsEnabled').prop('checked',false);
$("#tableLoaderSpinner").hide();

$(".filterBeschreibung").on("click", function(){resetSearch();});

$('#doneIsEnabled').on("click",function(div){
    if(div.target.checked) getFullReponceULR = getFullReponceULR.replace("/table/","/tableFull/");
    else getFullReponceULR = getFullReponceULR.replace("/tableFull/","/table/");
    updateTable(getFullReponceULR);
});



export const dataTable = {
    getTableFromTaskruns: function(conf){
        DataTable_Parameter.language = conf.language_settings;
        defaultDays = conf.defaultChartDays ? conf.defaultChartDays : 14;
        if(conf.dev.hydrotecServerOnline) getFullReponceULR = `${window.location.protocol}//${window.location.host}${conf.restCallTable}`;
        else getFullReponceULR = `${conf.currentDomain}/${conf.TomcatPIWebServiceRestBezeichnung}`;
        staticURL  = conf.dev.localCache;
        getData(getFullReponceULR);
        DataTable();
    },
    update: () => updateTable(getFullReponceULR),
    setDays: (days) => setDays(days)
    // getTableFromTaskruns: () => useStatic(),
	// searchForUrl: () => searchUrl(url)
};