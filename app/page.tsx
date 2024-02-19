'use client'
import Image from 'next/image'
import styles from './page.module.scss'
import Link from 'next/link';
import Login from '@/components/poker/Login/Login';
import Register from '@/components/poker/Register/Register';
import { title } from 'process';
import Layout from '@/components/layout';
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { redirect } from 'next/dist/server/api-utils';
import { stat } from 'fs';
import { Redirect } from 'next';

interface HomeProps {
  isLoggedIn: boolean
}

export const getServerSideProps: GetServerSideProps = async () => {
  const isLoggedIn: boolean = false;
  return {
    props: {
      isLoggedIn
    }
  }
}

export default function Home({isLoggedIn}: HomeProps) {

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(isLoggedIn);
  return (
    <Layout siteTitle="Casino-online">
       <main className={styles.main}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Casino Online</h1>
          <p className={styles.text}>You are ready</p>
        </div>
        <Login/>
        <Link href='./game/poker' className={styles.text}>No account yet?</Link>
        <button className={styles.button} type='button'>Create a new account</button>
      </main>      
    </Layout>
  )

}
