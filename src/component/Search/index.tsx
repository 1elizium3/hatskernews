import React from 'react';

interface IProps { 
  children: string; 
  value: any; 
  onChange: (e: { target: { value: any; }; }) => void; 
  onSubmit: (e: { preventDefault: () => void; }) => void; 
  [propName: string]: any,
};

class Search extends React.Component<IProps, {}> {
  // Явно указал HTMLInputElement | null 
  input = document.querySelector('input');
  
  componentDidMount(): void {
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
  
export default Search;