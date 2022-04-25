import {
    useRef,
} from 'react';

import useVideoPlayer  from '/hooks/useVideoPlayer';
import styles from '../styles/Chapters.module.scss'



const VideoPlayer = ({amFinished, chapter, width}) => {
    
    const videoElement = useRef(null);
  
    const {
        playerState,
        togglePlay,
        handleOnPlay,
        handleOnEnded,
    } = useVideoPlayer(videoElement);

    return  <div className={styles.container}>
        <div className={styles.heading}>{`chapter ${chapter}`}</div>
       
        <video autoPlay ref={videoElement} onPlaying={handleOnPlay}  onEnded={handleOnEnded.bind(this,()=>{amFinished(true)})} width={width} height="auto">
             <source src={`videos/c${chapter}.mp4`} type="video/mp4"/>
        </video>
        <div  onDoubleClick={handleOnEnded.bind(this,()=>{amFinished(true)})} onClick={()=>{togglePlay()}} className={styles.playcontainer} style={{background:playerState.isPlaying?"transparent":"black"}}>
           {!playerState.isPlaying &&  <div className={styles.play}>{`Watch Chapter ${chapter}`}</div>}
        </div>
    </div>
}


export default VideoPlayer;