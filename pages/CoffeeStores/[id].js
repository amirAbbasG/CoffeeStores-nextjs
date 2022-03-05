import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import classnames from "classnames";
import useSWR from "swr";

import { fetchCoffeeStores } from "../../lib/coffeeStores";
import styles from "../../styles/CoffeeStore.module.css";
import { isEmpty, fetcher } from "../../utils";
import { StoreContext } from "../../store/StoreContext";

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStore = coffeeStores.find(
    (cs) => cs.id.toString() === params.id
  );

  return {
    props: {
      coffeeStore: findCoffeeStore || {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((cs) => {
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

const CoffeeStores = ({ coffeeStore }) => {
  const router = useRouter();
  const { id } = router.query;
  const [cofeeStoreData, setCofeeStoreData] = useState(coffeeStore || {});
  const [votingCount, setVotingCount] = useState(0);

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    const { id, name, address, neighbourhood, imgUrl } = coffeeStore;
    try {
      const response = await fetch("/api/createCoffeeStore", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || "",
          address: address || "",
        }),
      });
      const dbCoffeeStore = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isEmpty(coffeeStore)) {
      if (coffeeStores.length > 0) {
        const targetCoffeeStore = coffeeStores.find(
          (c) => c.id.toString() === id
        );
        if (targetCoffeeStore) {
          setCofeeStoreData(targetCoffeeStore);
          handleCreateCoffeeStore(targetCoffeeStore);
        }
      }
    } else {
      handleCreateCoffeeStore(coffeeStore);
    }
  }, [id, coffeeStore, coffeeStores]);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCofeeStoreData(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  const handleUpVote = async () => {
    try {
      const response = await fetch("/api/upVotingCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }
  };

  if (router.isFallback) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  const { address, name, neighbourhood, imgUrl } = cofeeStoreData;

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`}></meta>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Go back home</a>
            </Link>
          </div>
          <h1 className={styles.name}>{name}</h1>
          <Image
            className={styles.storeImg}
            src={
              imgUrl ||
              "https://rusticiran.com/wp-content/uploads/2018/02/14-%D8%B9%DA%A9%D8%B3-%D8%A8%D8%B1%D8%A7%DB%8C-%DA%A9%D8%A7%D9%81%DB%8C-%D8%B4%D8%A7%D9%BE-%DA%86%D9%88%D8%A8%DB%8C-9.jpg"
            }
            width={600}
            height={450}
            alt={name}
          />
        </div>
        <div className={classnames("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              alt="location"
              width={24}
              height={24}
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                alt="nearMe"
                width={24}
                height={24}
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              alt="rating"
              width={24}
              height={24}
            />
            <p className={styles.text}>{votingCount}</p>
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
