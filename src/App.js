import React, { Component } from "react";
import WikiSnippet from "./components/WikiSnippet.js";
import 'semantic-ui-css/semantic.min.css';
import SearchBar from "./components/SearchBar.js";
import CurrentVideo from "./components/CurrentVideo.js";
import VideoList from "./components/VideoList.js";
import { Grid } from 'semantic-ui-react';

const parser = require('wtf_wikipedia');
const searchYouTube = require('youtube-api-v3-search');

const YOUTUBE_API_KEY = 'AIzaSyACLfTG-BOzYhwrZ_5BN529SrlmE392lSA';

class CriticalCloseUp extends Component {
  
  state = {
    image: undefined,
    title: undefined,
    genre: undefined,
    writeUp: undefined,
    error: undefined,

    videos: [],
    selectedVideo: null
  }


  // FUNCTIONS 
  performSearch = async (e) => {
    e.preventDefault();
      let query = e.target.elements.query.value;

      if(query) {
        query = (this.titleCaseQuery(query));
        await this.getWikiData(query);
        await this.getYouTubeList(query);
      }
  }

  titleCaseQuery = (query) => {
    let splitQuery = query.split(" ");
    for (let i = 0; i < splitQuery.length; i++) {
      splitQuery[i] = splitQuery[i][0].toUpperCase() + splitQuery[i].substr(1);
    }
    return splitQuery.join(" ");
  }

  getWikiData = (input) => {
    parser.fetch(input).then(doc => {
      if (doc.infoboxes(0) !== undefined && doc.infoboxes(0) !== null) {
        this.setState({
          image: doc.infoboxes(0).image().url(),
          title: doc.title(),
          genre: "Genre: " + doc.infoboxes(0).keyValue().genre,
          writeUp: doc.paragraphs(0).text(),
          error: "",
        });
      } else if (doc.infoboxes(0) === undefined && doc.infoboxes(0) === null) {
        this.setState({
          image: undefined,
          title: undefined,
          genre: undefined,
          writeUp: undefined,
          error: "Unable to pull data from Wikipedia",
        });
      }
    });
  }

  getYouTubeList = (input) => {
    const vidList = searchYouTube(YOUTUBE_API_KEY, {q: input, part: 'snippet', maxResults: 5, type: 'video'});
    console.log(vidList);

    vidList.then(videos => {
      this.setState({
        videos: videos.items,
        selectedVideo: videos.items[0]
      })
      console.log(videos);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img 
            src="http://bf4-emblems.com/wp-content/uploads/2013/11/doge-dog.jpg" 
          className="App-logo" alt="logo" />
          <h1 className="App-title">All your base are belong to us</h1>
        </header>
        <SearchBar performSearch={this.performSearch} />
        <Grid columns={3}>
          <Grid.Row stretched>
            <Grid.Column>
              <WikiSnippet 
                image = {this.state.image}
                title = {this.state.title}
                genre = {this.state.genre}
                writeUp = {this.state.writeUp}
                error = {this.state.error}
              />
            </Grid.Column>
            <Grid.Column>
                <CurrentVideo
                  video = {this.state.selectedVideo} 
                />
            </Grid.Column>
            <Grid.Column>
              <VideoList
                onVidSelect={selectedVideo => this.setState({ selectedVideo })}
                videos={this.state.videos}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default CriticalCloseUp;
