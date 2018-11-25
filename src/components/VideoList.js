import React from 'react';
import VideoListEntry from "./VideoListEntry.js";
import { Item } from 'semantic-ui-react';

const VideoList = (props) => {

    const listEntries = props.videos.map(video => {
        return(
            <VideoListEntry
                onVidSelect = {props.onVidSelect}
                key={video.etag}
                video={video}
            />
        )
    });

    return(
        <Item.Group divided>
            {listEntries}
        </Item.Group>
    )
}

export default VideoList;