import './scss/main.scss';
import './js/import-jquery';

import 'babel-polyfill';
import './lib/sb-admin.min';

// die beiden sind hier notwendig, damit dropdown Menue bei mobilen Geraeten funktioniert 
import popper from "popper.js";
import bootstrap from "bootstrap";
// import { fetch } from 'whatwg-fetch'; 
import { main } from './js/fews';

import ko from 'knockout';
import { setState } from 'knockout-store';

import './js/components/daysSetter/daysSetter';
import './js/components/refreshSelector/refreshSelector';

setState({ 
	count: ko.observable(3), 			// test
	showDoneOnStart: false,  			// laden Status "done" am Start?
	loadDays: ko.observable(2),			// wieviele Tage in die Vergangenheit?
	refreshRate: ko.observable(1000)	// wie haeufig aktualisieren?
});


ko.applyBindings();

$(document).ready(function() {
	$.ajax({
        url: 'config.json',
		dataType: "json",
		cache: false,
        success: (json) => {
			$("#projectName").html(json.projectName);
			main.init(json);
		},
        error: (e) => console.warn("config nicht erreichbar - ")
    });
});
