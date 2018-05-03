import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{
    constructor(props){
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    search(){
        this.props.onSearch(this.state.term);
      }

    //Trigger a search on 'Enter' key
    handleKeyUp(event){
        if(event.keyCode === 13){
            this.search();
        }
    }


    handleTermChange(event){
        this.setState({
            term: event.target.value});
    }

    render(){
        return(
        <div className="SearchBar">
            <input 
            placeholder="Enter A Song Title"
            onChange={this.handleTermChange}
            onKeyUp={this.handleKeyUp}
             />
        <a id="myInput" onClick={this.search}>SEARCH</a>
      </div> 
      )
    }
}

export default SearchBar;