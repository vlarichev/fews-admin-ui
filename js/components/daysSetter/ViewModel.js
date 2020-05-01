import { connect } from 'knockout-store';

function viewModel(params) {
    const self = this;
    self.days = params.loadDays;
    self.decrease = () => self.days(self.days() - 1);
    self.increase = () => self.days(self.days() + 1);
}

function mapStateToParams({ loadDays }) {
    return { loadDays };
}

export default connect(mapStateToParams)(viewModel);
