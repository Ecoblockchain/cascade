import {expect} from 'chai';

import Cascade, {Component, observable} from '../../scripts/modules/Cascade';

class ViewModel {
    runsA: number = 0;
    runsB: number = 0;
    @observable a: string = 'a';
    @observable b: string = 'b';
}

interface IParentProperties {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProperties> {
    render() {
        this.properties.viewModel.runsA++;
        return (
            <div>
                {this.properties.viewModel.a}
                <Child id="child" viewModel={this.properties.viewModel} />
            </div>
        );
    }
}

interface IChildProperties {
    id: string;
    viewModel: ViewModel;
}

class Child extends Component<IChildProperties> {
    render() {
        this.properties.viewModel.runsB++;
        return (
            <div>
                {this.properties.viewModel.b}
            </div>
        );
    }
}

describe('Component', function() {
    it('should updated nested Components', function() {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />);
        viewModel.a = 'a1';
        viewModel.b = 'b1';
        setTimeout(function() {
            viewModel.b = 'b2';
            setTimeout(function() {
                    expect(viewModel.runsA).to.equal(2);
                    expect(viewModel.runsB).to.equal(3);
            }, 20);
        }, 1);
    });
});