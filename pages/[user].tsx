import { useRouter } from 'next/router'

export const getServerSideProps = async (context:any) => {

}

export default function User() {
  const router = useRouter()
  const { user } = router.query

  return <p>User: {user}</p>
}