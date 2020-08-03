import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'
import { sortBy } from 'lodash';
import classNames from 'classnames';
import './App.css';

import Clock from './component/clock';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '25';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),  /*возврат списка в обратном порядке*/
  POINTS: list => sortBy(list, 'points').reverse() /*возврат списка в обратном порядке*/
};

// const list = [
//   {
//     title: 'React',
//     url: 'https://reactjs.org',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0
//   },
//   {
//     title: 'Redux',
//     url: 'https://redux.js.org',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1
//   },
// ];

// function isSearched(searchTerm) {
//   console.log('filter()');
//   return function(item) {
//     return (
//       item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
//     );
//   };
// };

// const isSearched = (searchTerm) => (item) => 
//     item.title.toLowerCase().includes(searchTerm.toLowerCase());

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

    const isNotId = (item) => {
      return item.objectID !== id;
    };
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

        <Clock />
      </div>
    );
  };
};

class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  };

  render() {
    const { value, onChange, onSubmit, children } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}  
          ref={(node) => {this.input = node}}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
};
  
Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

// const Search = ({value, onChange,onSubmit,children }) => {
//   let input;
//   return (
//     <form onSubmit={onSubmit}>
//       <input
//         type="text"
//         value={value}
//         onChange={onChange}
//         ref={(node) => input = node}
//       />
//       <button type="submit">
//         {children}
//       </button>
//     </form>
//   );
// }

class Table extends Component {

  state = {
    sortKey: 'NONE',
    isSortRevers: false,
  }

  onSort = (sortKey) => {
    const isSortRevers = (
      this.state.sortKey === sortKey && !this.state.isSortRevers
    );
    this.setState({ sortKey, isSortRevers });
  };

  render() {
    const { list, onDismiss } = this.props;

    const { sortKey, isSortRevers } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reversSortedList = (
      isSortRevers ? sortedList.reverse() : sortedList
    );
  
    return (
      <div className="table">
        <div className="table-header">
          <span style={{width: '40%'}} >
            <Sort 
              sortKey={'TITLE'} 
              onSort={this.onSort} 
              activeSortKey={sortKey}>
                Заголовок
            </Sort>
          </span>
          <span style={{width: '30%'}}>
            <Sort 
              sortKey={'AUTHOR'} 
              onSort={this.onSort} 
              activeSortKey={sortKey}>
                Автор
            </Sort>
          </span>
          <span style={{width: '10%'}}>
            <Sort 
              sortKey={'COMMENTS'} 
              onSort={this.onSort} 
              activeSortKey={sortKey}>
                Комментарии
            </Sort>
          </span>
          <span style={{width: '10%'}}>
            <Sort 
              sortKey={'POINTS'} 
              onSort={this.onSort} 
              activeSortKey={sortKey}>
                Очки
            </Sort>
          </span>
          <span style={{width: '10%'}}>
            Архив
          </span>
        </div>
      { reversSortedList.map((item) => 
        <div key={item.objectID} className="table-row">
          <span style={{width: '40%'}}>
            <a href={item.url}>{item.title} </a>
          </span>
          <span style={{width: '30%'}}>{item.author}</span> 
          <span style={{width: '10%'}}>{item.num_comments}</span> 
          <span style={{width: '10%'}}>{item.points}</span> 
          <span style={{width: '10%'}}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline" >
                Отбросить
            </Button>
          </span>
        </div>
      )}
    </div>
    )
  };
};

const Sort = ({ sortKey, onSort, children, activeSortKey }) => {
  const sortClass = classNames(
    'button-inline',
    {'button-active' : sortKey === activeSortKey}
  );

  return (
    <Button 
      onClick={() => onSort(sortKey)}
      className={sortClass} >
        {children}
    </Button>
  );
}
  
Table.propTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
};

const Button = ({ onClick, className='', children }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      type="button" 
    >
      {children}
    </button>
  )
};

Button.defaultProps = {
  className: '',
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const Loading = () => {
  return(
    <div><h1><i className="fas fa-yin-yang"></i></h1></div>
  )
};
  
const withLoading = (Component) => ({isLoading, ...rest}) => {
  return (
    isLoading ? <Loading/> : <Component {...rest} />
  )
};

const ButtonWithLoading = withLoading(Button);

const UpdateSearchTopStoriesState = (hits, page) => (prevState) => {
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

export { Button, Search, Table, UpdateSearchTopStoriesState };