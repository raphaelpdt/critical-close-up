import React from 'react';
import {Item, Button, Icon} from 'semantic-ui-react';

const VideoListEntry = ({video, onVidSelect}) => {
    const vidThumbnail = video.snippet.thumbnails.default.url;
    
    return (
        <Item>
            <Item.Image src={vidThumbnail} />

            <Item.Content>
                <Item.Header>{video.snippet.title}</Item.Header>
                <Item.Meta>{video.snippet.channelTitle}</Item.Meta>
                <Item.Extra>
                    <Button color='youtube' onClick={() => onVidSelect(video)}>
                        <Icon name='youtube' />
                        Watch it
                    </Button>
                </Item.Extra>
            </Item.Content>
        </Item>
    )
}

export default VideoListEntry;