import { getAnswers,  } from '../lib/api';
import GalleryShape from '../components/GalleryShape';

export default function Gallery({answers}) {
    const images  = answers.map((a,i)=>{
        return <GalleryShape key={i} answers={a}/>
    })
    return <div>{images}</div>
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