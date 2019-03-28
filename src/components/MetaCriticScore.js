import React, { Component } from "react";
import { Segment } from "semantic-ui-react";

const square = { width: 175, height: 175 }

class MetaCriticScore extends Component {
    render() {
        return(
            <div>
                {this.props.reviewScore && this.props.reviewColor &&
                    <Segment circular inverted color={this.props.reviewColor} style={square}>
                    <h1>{this.props.reviewScore}</h1>
                    <h4>from metacritic</h4>
                    </Segment>}
                {this.props.reviewError && <p>{this.props.reviewError}</p>}
            </div>
        )
    }
}

export default MetaCriticScore;