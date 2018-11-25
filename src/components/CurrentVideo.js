import React from 'react';
import { Segment } from 'semantic-ui-react';

const CurrentVideo = ({video}) => {
    if(!video) {
        return <Segment color='red'><h4>Select a video to watch</h4></Segment>
    }

    const vidID = video.id.videoId;
    const vidURL = `https://www.youtube.com/embed/${vidID}`;

    return(
        <Segment inverted color='black' compact size='large'>
        <div>
            <iframe src={vidURL} id="ytplayer" allowFullScreen frameBorder='0' height="250" width="350"></iframe>
            {/* <h2>{video.snippet.title}</h2>
            <h3>{video.snippet.channelTitle}</h3> */}
            {/* {video.snippet.description} */}
        </div>
        </Segment>
    );
};

export default CurrentVideo;