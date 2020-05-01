import { connect } from 'knockout-store';
import ko from 'knockout';

class Timestep {
    constructor(delay, name) {
        this.delay = delay;
        this.name = name;
    }
}

function viewModel(params) {
    const self = this;

    self.refreshRate = params.refreshRate;
    
    self.availableTimevalues = ko.observableArray([
        new Timestep(  5000, "5  s."),
        new Timestep( 10000, "10 s."),
        new Timestep( 15000, "15 s."),
        new Timestep( 30000, "30 s."),
        new Timestep( 60000, "1 min."),
        new Timestep(120000, "5 min."),
    ]);
    self.selectedTimevalue = ko.observable();
    
    self.selectedTimevalue.subscribe((newValue) => self.refreshRate(newValue));


}

function mapStateToParams({  refreshRate }) {
    return {  refreshRate };
}


export default connect(mapStateToParams)(viewModel);
