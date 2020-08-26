import React from 'react';
import axios from 'axios';
import './App.css';

import Clock from './component/clock';
import Search from './component/Search';
import Table, {ButtonWithLoading} from './component/Table';

const DEFAULT_QUERY = 'react';
const DEFAULT_HPP = '20';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

interface IState {
  results: any,
  searchKey: string;
  searchTerm: string;
  error: any;
  isLoading: boolean;
};

type SearKeyTerm = string;

class App extends React.Component<{}, IState> {

  _isMounted = false;
  
  readonly state: IState = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null,
    isLoading: false,
  };

  // constructor() {
  //   super();
  //   this.state = {
  //     results: null,
  //     searchKey: '',
  //     searchTerm: DEFAULT_QUERY,
  //     error: null,
  //     isLoading: false,
  //   };
  
  //   this.onDismiss = this.onDismiss.bind(this);
  //   this.onSearchChange = this.onSearchChange.bind(this);
  //   this.onSearchSubmit = this.onSearchSubmit.bind(this);
  //   this.setSearchTopStories = this.setSearchTopStories.bind(this);
  //   this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  //   this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  // };

  needsToSearchTopStories = (searchTerm:SearKeyTerm) => {
    return !this.state.results[searchTerm];
  };

  setSearchTopStories = (result: {hits:any, page:number}) => {
    const { hits, page } = result;
    // console.log('result', result);    
    this.setState(UpdateSearchTopStoriesState(hits, page));
  };

  fetchSearchTopStories = (searchTerm:SearKeyTerm, page = 0) => {
    this.setState({ isLoading: true });
    axios
      .get(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
            &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  };

  componentDidMount():void {
    this._isMounted = true;

    const { searchTerm } = this.state;
    
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  };

  componentWillUnmount():void {
    this._isMounted = false;
  };

  onSearchChange = (e: {target: {value:string} }) => {
    this.setState({
      searchTerm: e.target.value
    });
  };
  // Поиск на стороне клиента и сервера
  onSearchSubmit = (e: {preventDefault: () => void}) => {
    const { searchTerm } = this.state;
    this.setState({
      searchKey: searchTerm
    });
    // Добавил проверко на не-null для TS
    if (this.fetchSearchTopStories(searchTerm) !== null) {
      this.fetchSearchTopStories(searchTerm);
    };
    
    e.preventDefault();
  };
  // 
  onDismiss = (id: number) => {
    console.log('onDis')

    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item: { objectID: number }) => item.objectID !== id;
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

export const UpdateSearchTopStoriesState = (hits: any, page: number) => (prevState: { searchKey: SearKeyTerm; results: any; }) => {
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