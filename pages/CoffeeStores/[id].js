import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import classnames from "classnames";

import coffeeStoresData from "../../data/coffee-stores.json";
import styles from "../../styles/CoffeeStore.module.css";

export async function getStaticProps({ params }) {
  return {
    props: {
      coffeeStore: coffeeStoresData.find(
        (cs) => cs.id.toString() === params.id
      ),
    },
  };
}

export async function getStaticPaths() {
  const paths = coffeeStoresData.map((cs) => {
    return {
      params: {
        id: cs.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const handleUpVote = () => {
  console.log("hp vote");
};

const CoffeeStores = ({ coffeeStore }) => {
  const router = useRouter();
  const { id } = router.query;

  if (router.isFallback) {
    return <div>loading...</div>;
  }

  const { address, name, neighbourhood, imgUrl } = coffeeStore;

  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>Go back home</a>
            </Link>
          </div>
          <h1 className={styles.name}>{name}</h1>
          <Image src={imgUrl} width={600} height={450} alt={name} />
        </div>
        <div className={classnames("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width={24} height={24} />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              className={styles.storeImg}
              src="/static/icons/nearMe.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>{neighbourhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={24} height={24} />
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpVote}>
            Up vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStores;
