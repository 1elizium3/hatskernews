import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import Clock from './component/clock';
import Search from './component/Search/';
import Table, {ButtonWithLoading} from './component/Table/';

const DEFAULT_QUERY = 'react';
const DEFAULT_HPP = '25';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {

  _isMounted = false;

  constructor() {
    super();
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };
  
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  };

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  };

  setSearchTopStories(result) {
    const { hits, page } = result;
    console.log('result', result)
    this.setState(UpdateSearchTopStoriesState(hits, page));
  };

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    axios
      .get(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
            &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  };

  componentDidMount() {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({
      searchKey: searchTerm
    });
    this.fetchSearchTopStories(searchTerm);
  };

  componentWillUnmount() {
    this._isMounted = false;
  };

  onSearchChange(event) {
    console.log('somethingText')
    this.setState({
      searchTerm: event.target.value
    });
  };

  onSearchSubmit(e) {
    const { searchTerm } = this.state;
    this.setState({
      searchKey: searchTerm
    });

    if (this.fetchSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    };
    
    e.preventDefault();
  };

  onDismiss(id) {
    console.log('onDis')

    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => item.objectID !== id;
    const updateHits = hits.filter(isNotId);

    this.setState({
      results: { 
        ...results, 
        [searchKey]: {hits: updateHits, page} 
      }
    });
  };

  render() {
    const { searchTerm, results, searchKey, 
            error, isLoading } = this.state;

    const page = (
      results && results[searchKey] && results[searchKey].page
    ) || 0;

    const list = (
      results && results[searchKey] && results[searchKey].hits
    ) || [];

    if (error) {
      return <p>ERROR</p>
    };

    return (
      <div className="page">
        <Clock />
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange} 
            onSubmit={this.onSearchSubmit}
          >
            Поиск
          </Search>
        </div>

        { error 
          ? <div className="interactions">
              <p>Somethisng went wrong</p>
            </div>  
          : <Table 
              list={list}
              onDismiss={this.onDismiss} 
          />
        } 
        
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
              Больше историй
          </ButtonWithLoading>
        </div>
      </div>
    );
  };
};

export const UpdateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey] 
    ? results[searchKey].hits 
    : [];

  const updateHits = [ ...oldHits, ...hits];

  return {
    results: {
      ...results,
      [searchKey]: {hits: updateHits, page} 
    },
    isLoading: false
  }
};

export default App;