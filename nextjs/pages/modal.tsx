import type { NextPage } from "next";
import ModalWrapper from "../components/Modal/ModalWrapper/ModalWrapper";
import NewProviderRequestModal from "../components/Modal/NewProviderRequestModal/NewProviderRequestModal";
import UnsavedModal from "../components/Modal/UnsavedModal/UnsavedModal";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <main className={styles.main}>
      <ModalWrapper>
        <NewProviderRequestModal />
      </ModalWrapper>
      <ModalWrapper>
        <UnsavedModal />
      </ModalWrapper>
    </main>
  );
};

export default Home;
