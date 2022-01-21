import {
    useRef,
} from 'react';

import useVideoPlayer  from '/hooks/useVideoPlayer';
import styles from '../styles/Chapters.module.css'



const VideoPlayer = ({amFinished, chapter, width}) => {
    
    const videoElement = useRef(null);
  
    const {
        playerState,
        handleOnPlay,
        handleOnEnded,
    } = useVideoPlayer(videoElement);

    return  <div className={styles.container}>
        <div className={styles.heading}>{`chapter ${chapter}`}</div>
        <video ref={videoElement} onPlaying={handleOnPlay} onEnded={handleOnEnded.bind(this,()=>{amFinished(true)})} width={width} height="auto" src="scene_1.mp4" controls> 
            Sorry, your browser does not support HTML5 <code>video</code>
        </video>
    </div>
}


export default VideoPlayer;