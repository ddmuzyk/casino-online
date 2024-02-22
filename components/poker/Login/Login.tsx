'use client';
import styles from './Login.module.scss'


const Login = () => {
  return (
    <form className={styles.form}>
      <input placeholder='Email' className={styles.input} type="email"/>
      <input placeholder='Password' className={styles.input} type="password"/>
      <button type='button' className={styles.button}>Login</button>
    </form>
  )
}

export default Login