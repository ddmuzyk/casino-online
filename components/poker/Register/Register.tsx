import React from "react";
import { useState } from "react";
import styles from "./Register.module.scss";
import Close from "./Close/Close";

import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

interface RegisterProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  isOpen: boolean
}

export default function Register({setIsOpen}: RegisterProps, isOpen: boolean) {

  return (
    <div className={styles.main}>
      <form className={`${styles.form} ${isOpen ? styles.visible : ""}`}>
        <Close setIsOpen={setIsOpen}/>
        <input placeholder='Username' className={styles.input} type="text"/>
        <input placeholder="Email" className={styles.input} type="email"/>
        <input placeholder='Password' className={styles.input} type="password"/>
        <input placeholder='Confirm Password' className={styles.input} type="password"/>
        <button type='button' className={styles.button}>Register</button>
      </form>
    </div>
  );
}
