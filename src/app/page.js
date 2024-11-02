'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Compare from "./components/Compare/Compare";

export default function Home() {
  return (
    <div className={styles.page}>
      <Compare />
    </div>
  );
}
