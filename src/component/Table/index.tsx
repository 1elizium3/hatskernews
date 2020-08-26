import React, { ReactNode } from 'react';
import classNames from 'classnames';
import {sortBy} from 'lodash';

type State = {
  sortKey: any,
  isSortRevers: Boolean,
};

interface IProps { 
  list: Array<object>; 
  onDismiss: (id: number) => void; 
};

const SORTS: { [key: string]: any} = {
  NONE: (list:any) => list,
  TITLE: (list: string) => sortBy(list, 'title'),
  AUTHOR: (list: string) => sortBy(list, 'author'),
  COMMENTS: (list: string) => sortBy(list, 'num_comments').reverse(),  /*возврат списка в обратном порядке*/
  POINTS: (list: string) => sortBy(list, 'points').reverse()          /*возврат списка в обратном порядке*/
};

class Table extends React.Component<IProps, State > {

  state = {
    sortKey: 'NONE',
    isSortRevers: false,
  }

  onSort = (sortKey: any) => {
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
      {/*Проверяю что данные являются массивом Array.isArray(reversSortedList) для Теста */}
      { Array.isArray(reversSortedList) && reversSortedList.map((item: any, idx: number) =>  
        <div key={item.objectID + idx} className="table-row">
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
      ) }
    </div>
    )
  };
};

interface PSort {
  children: ReactNode;
  sortKey: string; 
  onSort: (sortKey: any) => void;
  activeSortKey: string;
}

// Не должно быть any
const Sort: React.FC<PSort> = ({ sortKey, onSort, children, activeSortKey }) => {
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

interface PButton { 
  onClick: () => void; 
  className: string;
  children: ReactNode;
}

export const Button: React.FC<PButton> = ({ onClick, className = '', children }) => {
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

const Loading = () => {
  return(
    <div><h1><i className="fas fa-yin-yang"></i></h1></div>
  )
};
  
interface OnLoadingHocProps {
  isLoading: any;
  onClick: () => void;
  children: ReactNode;
}

const withLoading = (Component: React.ReactType) => ({isLoading, ...props}: OnLoadingHocProps) => {
  return (
    isLoading ? <Loading /> : <Component {...props} />
  ) 
};

export const ButtonWithLoading = withLoading(Button);

export default Table;