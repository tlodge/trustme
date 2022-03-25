import { getAnswers,  } from '../lib/api';
import GalleryShape from '../components/GalleryShape';
import styles from '../styles/Gallery.module.scss';

export default function Gallery({answers:_answers}) {

    const images  = _answers.map((a,i)=>{
        const {ts, answers} = a;
        return <GalleryShape key={i} ts={ts} answers={answers}/>
    })
    return <div className={styles.container}>
        <div className={styles.gallerycontainer}>{images}</div>
        </div>
}

export async function getStaticProps(context) {
  const answers = await getAnswers();
 
  return {
    props: {
      answers,
    },
    revalidate: 1, 
  };
}