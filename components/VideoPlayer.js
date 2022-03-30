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
        <iframe src="/silence.mp3" type="audio/mp3" allow="autoplay" id="audio" style={{display:"none"}}></iframe>
        <video autoPlay controls ref={videoElement} onPlaying={handleOnPlay}  onEnded={handleOnEnded.bind(this,()=>{amFinished(true)})} width={width} height="auto">
             <source src={`videos/c${chapter}.mp4`} type="video/mp4"/>
        </video>
    </div>
}


export default VideoPlayer;