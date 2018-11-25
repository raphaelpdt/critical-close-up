import React, { Component } from "react";
import "../App.css";
import { Card, Image } from "semantic-ui-react";

class WikiSnippet extends Component {
  render() {
    return (
      <div>
      {this.props.image && this.props.title && this.props.genre && this.props.writeUp && 
      <Card fluid color = 'grey'>
        {this.props.image && <Image size='medium' centered src= {this.props.image} />}
        <Card.Content>
          {this.props.title && <Card.Header>{this.props.title}</Card.Header>}
          <Card.Meta>
            {this.props.genre && <span>{this.props.genre}</span>}
          </Card.Meta>
          {this.props.writeUp && <Card.Description>{this.props.writeUp}</Card.Description>}
        </Card.Content>
      </Card>}
      {this.props.error && <p>{this.props.error}</p>}
      </div>

    )
  }
}

export default WikiSnippet;
