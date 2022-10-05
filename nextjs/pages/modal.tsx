import type { NextPage } from "next";
import UnsavedModal from "../components/Modal/UnsavedModal";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <main className={styles.main}>
      <UnsavedModal />
    </main>
  );
};

export default Home;
