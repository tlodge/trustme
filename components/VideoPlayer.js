import {
    useRef,
} from 'react';

import useVideoPlayer  from '/hooks/useVideoPlayer';
import styles from '../styles/Chapters.module.scss'



const VideoPlayer = ({amFinished, chapter, width}) => {
    
    const videoElement = useRef(null);
  
    const {
        playerState,
        handleOnPlay,
        handleOnEnded,
    } = useVideoPlayer(videoElement);

    return  <div className={styles.container}>
        <div className={styles.heading}>{`chapter ${chapter}`}</div>
        <video ref={videoElement} onPlaying={handleOnPlay} autoPlay onEnded={handleOnEnded.bind(this,()=>{amFinished(true)})} width={width} height="auto" src={`videos/c${chapter}.mp4`} controls> 
            Sorry, your browser does not support HTML5 <code>video</code>
        </video>
    </div>
}


export default VideoPlayer;