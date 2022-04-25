import styles from '../styles/Index.module.scss';
import {useState} from 'react';
import Link from 'next/link'
const pages = [
  "Welcome to the SHAPE OF TRUST project",
  "We are trying to understand how we learn to trust automated systems",
  "To do this we are going to show you a story about taking a self-driving taxi",
  "After each stage of the journey we will ask you some questions",
  "By the end of the journey you will have have created your own unique SHAPE OF TRUST - and you can take it home with you!",
  "Are you ready? When you press go the video will load, click on it to play it"
]

export default function Gallery({answers:_answers}) {

    const [page, setPage] =  useState(0);

    const _setPage = ()=>{
      setPage(page++)
    }
    return <div className={styles.container}>
            <div onClick={_setPage} className={styles.shapecontainer}>
                
                  <div className={styles.heading}>{pages[page]}</div>
                  {page < pages.length - 1 && <div onClick={_setPage} className={styles.button}>Next</div>}
                  {page == pages.length - 1 && <Link href="/shapes"><a className={styles.button}>GO</a></Link>}
                
            </div>
          </div>
        
}