'use client';
import styles from './Login.module.scss'
import { login } from '@/lib/poker/poker-logic/functions/requests';
import { useState } from 'react';


const Login = () => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const tryLogin = async (email: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    const data = await res.json()
    if (data.success) {
      window.location.href = '/game/poker'
    } else {
      console.log('error')
    }
  }

  return (
    <form className={styles.form}>
      <input onChange={(e) => setEmail(e.target.value)} placeholder='Email' className={styles.input} type="email"/>
      <input onChange={(e) => setPassword(e.target.value)} placeholder='Password' className={styles.input} type="password"/>
      <button onClick={async () => {await tryLogin(email, password)}} type='button' className={styles.button}>Log in</button>
    </form>
  )
}

export default Login