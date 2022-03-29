import { getAnswers,  } from '../lib/api';
import GalleryShape from '../components/GalleryShape';
import styles from '../styles/Gallery.module.scss';

export default function Gallery({answers:_answers}) {

    const images  = (_answers||[]).map((a,i)=>{
        console.log("ok a is", a);
        const {ts, answers} = a;
        console.log(ts, answers);
        return <GalleryShape key={i} ts={ts} answers={answers}/>
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
  console.log("nice answrers are", _answers);
  const answers = _answers || [];

  return {
    props: {
      answers,
    },
    revalidate: 1, 
  };
}