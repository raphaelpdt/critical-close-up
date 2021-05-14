import React, { Component } from "react";
import dogeLogo from "./doge-logo.png"
import WikiSnippet from "./components/WikiSnippet.js";
import 'semantic-ui-css/semantic.min.css';
import SearchBar from "./components/SearchBar.js";
import CurrentVideo from "./components/CurrentVideo.js";
import VideoList from "./components/VideoList.js";
import MetaCriticScore from "./components/MetaCriticScore.js"
import { Grid } from 'semantic-ui-react';
import RedditScript from './components/RedditScript';

const parser = require('wtf_wikipedia');
const searchYouTube = require('youtube-api-v3-search');

const YOUTUBE_API_KEY = 'AIzaSyCP1wBOuT4i1HRspEFL_YvN-rejMkQNz0I';
const REDDIT_SCRIPT = 'https://redditjs.com/subreddit.js';

class CriticalCloseUp extends Component {
  
  state = {
    // Wikipedia
    image: undefined,
    title: undefined,
    genre: undefined,
    writeUp: undefined,
    error: undefined,

    // YouTube
    videos: [],
    selectedVideo: null,

    // Reddit
    redditScript: undefined,
    subReddit: undefined,
    scriptLoaded: undefined,
    scriptError: undefined,

    // Metacritic Score
    reviewScore: undefined,
    reviewColor: undefined,
    reviewError: undefined
  }


  /*
   * 
   * FUNCTIONS
   *  
   */
  // Extracts search query from search bar and loads results  
  performSearch = async (e) => {
    e.preventDefault();
      let query = e.target.elements.query.value;

      if (query) {

        query = (this.titleCaseQuery(query));
        await this.getWikiData(query); // load wikipedia data
        //await this.getScore(query); // parse score
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

  removeWhiteSpace = (input) => {
    let trimmedString = input.replace(/\s/g, '');
    return trimmedString;
  }

  removeElem = (targetVal, elem)  => {
    let targetAttr = (elem==="script")? "src": "style"
    let targetElems = document.getElementsByTagName(elem);
    
    for (let i=targetElems.length; i>=0; i--) {
      if(targetElems[i] &&
        targetElems[i].getAttribute(targetAttr) !== null &&
        targetElems[i].getAttribute(targetAttr) === targetVal) {
          targetElems[i].parentNode.removeChild(targetElems[i]);
      }
    }
  }

  // Create script object for appended subreddit
  addScript = (filename, series) => {
    let script = document.createElement("script");
    let attributes = this.setSubReddit(series);

    script.setAttribute("type", "text/javascript");
    script.setAttribute("data-subreddit", series);
    script.setAttribute('data-height', attributes["data-height"]);
    script.setAttribute('data-width',  attributes["data-width"]);
    script.setAttribute('data-theme', attributes["data-theme"]);
    script.setAttribute('data-timeframe', attributes["data-timeframe"]);
    script.setAttribute('data-subreddit-mode', attributes["data-subreddit-mode"]);
    script.setAttribute("src", filename);

    // check if subreddit snippet is successfully loaded, append to the document if so
    if(typeof script !== undefined) {
      document.body.appendChild(script);
    }
  }

  setSubReddit = (input) => {
    var attributes = {
      'data-subreddit': input,
      'data-height': '800',
      'data-width': '1500',
      'data-theme': 'dark',
      'data-timeframe': 'month',
      'data-subreddit-mode': 'grid'
    }

    return attributes;
  }

  getWikiData = (input) => {
    parser.fetch(input).then(doc => {
      if (doc !== null) {
        if (doc.infoboxes(0).keyValue().series !== undefined) {
          var series = this.removeWhiteSpace(doc.infoboxes(0).keyValue().series);

          // Restart reddit script if script is loaded
          if (this.state.redditScript !== undefined && this.state.subReddit !== undefined) {
            this.removeElem(REDDIT_SCRIPT, "script");
            this.removeElem("width: 100%;", "div");
            this.addScript(REDDIT_SCRIPT, series);
          } else {
            let subReddit = this.setSubReddit(series);
            this.setState({ 
              redditScript: REDDIT_SCRIPT, 
              subReddit: subReddit,
            });
          }
        }

        this.setState({
          image: doc.infoboxes(0).image().url(),
          title: doc.title(),
          genre: "Genre: " + doc.infoboxes(0).keyValue().genre,
          writeUp: doc.paragraphs(0).text(),
          error: "",
        });

        this.getScore(doc);
      } else if (doc === null) {
        this.setState({
          image: undefined,
          title: undefined,
          genre: undefined,
          writeUp: undefined,
          error: <h2>Unable to retrieve data from Wikipedia</h2>
        });
      }
    });
  }

  setReviewColor = (input) => {
    input = parseInt(input);

    let reviewColor = null;

    if (input < 45) reviewColor = 'red'; 
    else if (input < 80) reviewColor = 'yellow';
    else reviewColor = 'olive';

    return reviewColor;
  }

  // Parse score from wikipedia
  getScore = (doc) => {
    // parser.fetch(input).then(doc => {

      //if (doc !== null) {
        for(let template of doc.templates()) {
          if (template.template === "video game reviews") {
            let metaCriticScore = template.data.mc;

            if (metaCriticScore === undefined) {
              this.setState({ reviewScore: undefined, reviewError: <h2>Unable to retrieve review score</h2>});
              break;
            }

            if (metaCriticScore.match(/[a-z]/i)) {
              let splitString = metaCriticScore.split(" ");
              metaCriticScore = splitString[1];
            }
            metaCriticScore = metaCriticScore.substr(0, 2);
            let reviewColor = this.setReviewColor(metaCriticScore);
            this.setState({ reviewScore: metaCriticScore, reviewColor: reviewColor, reviewError: undefined });
          }
        }
      //}
    // });
  }

  getYouTubeList = (input) => {
    const vidList = searchYouTube(YOUTUBE_API_KEY, {q: input, part: 'snippet', maxResults: 5, type: 'video'});

    vidList.then(videos => {
      this.setState({
        videos: videos.items,
        selectedVideo: videos.items[0]
      })
    });
  }

  handleScriptCreate() {
    this.setState({
      scriptLoaded: "https://cdn.dribbble.com/users/255512/screenshots/2251246/gifloader.gif" })
  }

  handleScriptError() {
    this.setState({ scriptError: true })
  }

  handleScriptLoad() {
    this.setState({ scriptLoaded: true })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img 
            src={dogeLogo} 
          className="App-logo" alt="logo" />
        </header>
        <SearchBar performSearch={this.performSearch} />

        <RedditScript
           redditScript={this.state.redditScript}
           subReddit={this.state.subReddit}
           scriptLoaded={this.state.scriptLoaded}
           scriptError={this.state.scriptError}
        />
        
        
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
              <CurrentVideo video={this.state.selectedVideo} />
              <MetaCriticScore 
                reviewScore = {this.state.reviewScore}
                reviewColor = {this.state.reviewColor}
                reviewError = {this.state.reviewError}
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