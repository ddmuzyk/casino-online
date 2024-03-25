import { useRouter } from 'next/router'
import styles from './[user].module.scss'
import { getCurrentUserData } from '@/lib/poker/poker-logic/functions/requests'
import { Props } from './game/poker';
import Layout from '@/components/layout';

export const getServerSideProps = async (context:any) => {
  const response = await getCurrentUserData(context);
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
  console.log(data)

  return (
    <Layout siteTitle={`${data.name} | Casino Online`}>
      <main className={styles.main}>
        <img src="poker/images/gambler.png" alt="Profile photo" className={styles.profile_picture}/>
        <h1>{user}</h1>
        <p>Money: {data.money}</p>
      </main>
    </Layout>
  )
}