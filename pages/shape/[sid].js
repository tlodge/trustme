import { compose } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'

const Shape = ({answers}) => {
  const router = useRouter()
  const { sid } = router.query

  return <p>Post: {sid} {JSON.stringify(answers,null,4)}</p>
}

export default Shape

export async function getServerSideProps(context) {

    const {sid} = context.query;
    const protocol = context.req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = context.req ? `${protocol}://${context.req.headers.host}` : ''
    const res = await fetch(baseUrl + `/api/shape?sid=${sid}`)
    const answers = await res.json()
    return {
      props: {answers}, // will be passed to the page component as props
    }
  }