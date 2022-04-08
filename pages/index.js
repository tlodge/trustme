import styles from '../styles/Index.module.scss';
import {useState} from 'react';
import Link from 'next/link'
const pages = [
  "Welcome to the SHAPE OF TRUST project",
  "We are going to show you a story about taking a taxi",
  "Ready?"
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