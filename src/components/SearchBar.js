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
                <input type="text" name = "query" placeholder = "Search ..." />
                <button>Search</button>
            </form>
            </Segment>
        )
    }
}

export default SearchBar;