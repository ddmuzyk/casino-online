'use client';
import styles from './Login.module.scss'
import { login } from '@/lib/poker/poker-logic/functions/requests';
import { useState } from 'react';


const Login = () => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <form className={styles.form}>
      <input onChange={(e) => setEmail(e.target.value)} placeholder='Email' className={styles.input} type="email"/>
      <input onChange={(e) => setPassword(e.target.value)} placeholder='Password' className={styles.input} type="password"/>
      <button onClick={() => {login(email, password)}} type='button' className={styles.button}>Log in</button>
    </form>
  )
}

export default Login