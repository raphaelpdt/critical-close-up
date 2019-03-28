import React, { Component } from 'react';
import Script from 'react-load-script';

class RedditScript extends Component {

    render() {
        return(
            <div>
            {this.props.subReddit && this.props.redditScript &&
            <Script
                url={this.props.redditScript} 
                attributes={this.props.subReddit}
                onCreate={this.props.scriptLoaded}
                onError={this.props.scriptError}
                onLoad={this.props.scriptLoaded}
            />}
            </div>
            
        )
    }
}

export default RedditScript;