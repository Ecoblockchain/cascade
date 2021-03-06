import { expect } from 'chai';

import Cascade, { Component, observable } from '../scripts/modules/Cascade';

class ViewModel {
    runsA: number = 0;
    runsB: number = 0;
    @observable a: string = 'a';
    @observable b: string = 'b';
}

interface IParentProps {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProps> {
    render() {
        this.props.viewModel.runsA++;
        return (
            <Child id="child" viewModel={this.props.viewModel}>
                <div>
                    {this.props.viewModel.a}
                </div>
            </Child>
        );
    }
}

interface IChildProps {
    id: string;
    viewModel: ViewModel;
}

class Child extends Component<IChildProps> {
    render() {
        this.props.viewModel.runsB++;
        return (
            <div>
                <div>
                    {this.props.viewModel.b}
                </div>
                <div>
                    {this.children}
                </div>
            </div>
        );
    }
}

describe('Component', function () {
    it('should updated directly nested Components with children', function () {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />);
        viewModel.a = 'a1';
        viewModel.b = 'b1';
        setTimeout(function () {
            viewModel.b = 'b2';
            setTimeout(function () {
                expect(viewModel.runsA).to.equal(2);
                expect(viewModel.runsB).to.equal(3);
            }, 1);
        }, 1);
    });
});
