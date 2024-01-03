'use client';
import Image from 'next/image'
import styles from './page.module.scss'
import Link from 'next/link';
import Login from '@/components/poker/Login/Login';
import Register from '@/components/poker/Register/Register';
import { title } from 'process';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Casino Online</h1>
        <p className={styles.text}>You're ready</p>
      </div>
      <Login/>
      <Link href='./game/poker' className={styles.text}>No account yet?</Link>
      <button className={styles.button} type='button'>Create a new account</button>
    </main>
  )
}
