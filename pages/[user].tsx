import { useRouter } from 'next/router'
import { getUserData } from '@/lib/poker/poker-logic/functions/requests'
import { Props } from './game/poker';

export const getServerSideProps = async (context:any) => {
  const response = await getUserData(context);
  if (response.props.data) {
    return response;
  }
  return {
    redirect: {
      destination: '/',
      permanent: false,
    }
  }
}

export default function User({data}: Props) {
  const router = useRouter()
  const { user } = router.query

  return (
    <div>
      <p>User: {user}</p>
      <p>Money: {data.money}</p>
    </div>
  )
}