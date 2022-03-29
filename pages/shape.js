import { getAnswers,  } from '../lib/api';
import styles from '../styles/Gallery.module.scss';

export default function Gallery({answers:_answers}) {
    return <div>PRINTABLE!</div>
}

export async function getStaticProps(context) {
  const _answers = await getAnswers();
  const answers = _answers || [];
  console.log(context);
  return {
    props: {
      answers,
    },
    revalidate: 1, 
  };
}