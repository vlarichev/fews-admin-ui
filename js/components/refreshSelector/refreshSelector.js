import ko from 'knockout';
import "./style.css";
import template  from "./template.html";
import viewModel  from "./ViewModel";


ko.components.register('refresh-selector', {
    viewModel: viewModel,
    template: template
});
