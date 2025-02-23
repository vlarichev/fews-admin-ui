import { statuswidget } from './fews-workflowWidget';
import { chartFEWS } from './fews-chart';
import { dataTable } from './fews-dataTable';

var ProgressBar = require('progressbar.js');


var maxDays = 100;
export const main = {
    init:function(cfg){
        var strokeWidth = 14;
        
        // test if IE, IE kann nicht strokeWidth >= 7 vverarbeiten, warum auch immer: 
        var usaerAgent = window.navigator.userAgent;
        var msie = usaerAgent.indexOf("MSIE ");
    
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
            strokeWidth = 6;
        }

        //Ladenanimation initaialisieren und an den Widget abegeben      
        var bar = new ProgressBar.Circle(loadingStatus, {
            strokeWidth: strokeWidth,
            easing: 'linear',
            duration: cfg.refreshRate?cfg.refreshRate:1400,
            // color: '#FFEA82',
            color: '#e9ecef',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: null
        });
          
        maxDays = cfg.maxDays ? cfg.maxDays : 31;
		setTimeout(() => { statuswidget.init(cfg, bar); }, 0);
        setTimeout(() => { chartFEWS.init(cfg); }, 0);
        setTimeout(() => { dataTable.getTableFromTaskruns(cfg); }, 0);
        bar.animate(1.0);  // Animation von 0.0 bis 1.0

    }
};


var update = function(newVal){
    var update = parseInt(newVal); 
    if(update >= 0 && update <= maxDays+1){
        chartFEWS.update(update);
        statuswidget.setDays(update);
        dataTable.setDays(update);
    }
};


var delayTimer;
$("input#chartDaySetter").on('keyup', function(obj){
    var val = obj.target.value;
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
        if (obj.keyCode === 13) obj.target.blur();
        if (val == "") console.log(val);
        else if (val<= 0) {obj.target.value = 0; update(val);}
        else if (val >= maxDays) {obj.target.value = 31; update(val);}
        else update(val);
    }, 1000);
});

$(document).on('click', '.number-spinner button', function () {    
	var btn = $(this),
		oldValue = $("#chartDaySetter").val().trim(),
		newVal = 0;
	if (btn.attr('data-dir') == 'up') newVal = parseInt(oldValue) + 1;
	else {
		if (oldValue > 1) newVal = parseInt(oldValue) - 1;
		else newVal = 1;	
	}
    btn.closest('.number-spinner').find('input').val(newVal);
    update(newVal);
});