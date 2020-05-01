import { connect } from 'knockout-store';

function viewModel(params) {
    const self = this;
    self.refreshRate = params.refreshRate;
    self.days = params.loadDays;
    self.showDoneOnStart = params.showDoneOnStart;
}

function mapStateToParams({ loadDays, showDoneOnStart, refreshRate }) {
    return { loadDays, showDoneOnStart, refreshRate };
}

export default connect(mapStateToParams)(viewModel);
