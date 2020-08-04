import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {sortBy} from 'lodash';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),  /*возврат списка в обратном порядке*/
  POINTS: list => sortBy(list, 'points').reverse()          /*возврат списка в обратном порядке*/
};

class Table extends React.Component {

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

export const Button = ({ onClick, className='', children }) => {
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
    isLoading ? <Loading /> : <Component {...rest} />
  )
};

export const ButtonWithLoading = withLoading(Button);

export default Table;