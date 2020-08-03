import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, { Search, Button, 
              Table, UpdateSearchTopStoriesState } from './App';

Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {

  it('отрисовывает без ошибки', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('есть корректный снимок', () => {
    const component = renderer.create(
      <App />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Search', () => {

  it('отрисовывает без ошибки', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search>Поиск</Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('есть корректный снимок', () =>{
    const component = renderer.create(
      <Search>Поиск</Search>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Button', () => {
 
  it('отрисовывает без ошибки', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button>Give Me More</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('кнопка присутствует', () => {
    const element = shallow(
      <Button>Give Me More</Button>
    );
    expect(element.find('.button-inline'));
  });

  test('есть корректный снимок', () =>{
    const component = renderer.create(
      <Button>Give Me More</Button>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Table', () => {

  const props = {
    list: [
      {title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y'},
      {title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z'},
    ],
    sortKey: 'TITLE',
    isSortRevers: false
  };

  it('отрисовать без ошибки', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table {...props} onDismiss={() => {}}/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('show two items in list', () => {
    const element = shallow(
      <Table {...props} onDismiss={() => {}}/>
    );
    expect(element.find('.table-row').length).toBe(2);
  });

  test('есть корректный снимок', () => {
    const component = renderer.create(
      <Table {...props} onDismiss={() => {}}/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('UpdateSearchTopStoriesState', () => {

  it('отрисовывает без ошибки', () => {
    const upSerState = renderer.create(
      <UpdateSearchTopStoriesState />
    ).toJSON();
    expect(upSerState).toMatchSnapshot();
  });
});





