import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link';
import Login from '@/components/poker/Login/Login';
import { title } from 'process';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Casino Online</h1>
        <p className={styles.desc}>You were always ready for this</p>
      </div>
      <Login />
    </main>
  )
}
