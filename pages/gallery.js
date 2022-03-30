import { getAnswers,  } from '../lib/api';
import GalleryShape from '../components/GalleryShape';
import styles from '../styles/Gallery.module.scss';

export default function Gallery({answers:_answers}) {

    const images  = (_answers||[]).map((a,i)=>{
        const {ts, answers, id} = a;
        return <GalleryShape key={i} ts={ts} id={id} answers={answers}/>
    })
    return <div className={styles.container}>
        <div className={styles.gallerycontainer}>{images}</div>
        <div className={styles.logocontainer}>
                <div className={styles.heading}>The Shape of Trust</div>
            </div>
        </div>
}

export async function getStaticProps(context) {
  const _answers = await getAnswers();
  const answers = _answers || [];

  return {
    props: {
      answers,
    },
    revalidate: 1, 
  };
}