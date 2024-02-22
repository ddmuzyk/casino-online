import React, { use } from "react";
import { useState } from "react";
import styles from "./Register.module.scss";
import Close from "./Close/Close";

import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

interface RegisterProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  isOpen: boolean
}

export default function Register({setIsOpen}: RegisterProps, isOpen: boolean) {

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");

  const [message, setMessage] = useState<string>("");

  const onButtonClick = () => {
    if (!username || !email || !password || !confirmedPassword) {
      setMessage("Please fill all the fields");
      return;
    }
    if (password !== confirmedPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setMessage("");
  }

  return (
    <div className={styles.main}>
      <form className={`${styles.form} ${isOpen ? styles.visible : ""}`}>
        <Close setIsOpen={setIsOpen}/>
        <input onChange={(e) => setUsername(e.target.value)} placeholder='Username' className={styles.input} type="text"/>
        <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={styles.input} type="email"/>
        <input onChange={(e) => setPassword(e.target.value)} placeholder='Password' className={styles.input} type="password"/>
        <input onChange={(e) => setConfirmedPassword(e.target.value)} placeholder='Confirm Password' className={styles.input} type="password"/>
        <p className={styles.message}>{message === "" ? '\u00A0' : message}</p>
        <button onClick={() => onButtonClick()} type='button' className={styles.button}>Register</button>
      </form>
    </div>
  );
}
