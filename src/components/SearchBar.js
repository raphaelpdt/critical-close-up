import React, { Component } from "react";
import { Segment } from 'semantic-ui-react';

class SearchBar extends Component {
    constructor(props) {
    super(props);
    this.state = {query: ''};
    }

    render() {
        return(
            <Segment>
            <form onSubmit = {this.props.performSearch}>
                <input type="text" name = "query" placeholder = "Search ..." 
                    style={{
                    'border-radius': '15px',
                    'border': '1px #000 solid',
                    'padding': '1px 1px 1px 10px',
                    'position': 'center',
                    'top': '0',
                    'left': '0',
                    'z-index': '5'}} />
                {/* <button>Search</button> */}
            </form>
            </Segment>
        )
    }
}

export default SearchBar;