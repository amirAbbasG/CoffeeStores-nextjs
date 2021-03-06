import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";
import Banner from "../components/Banner";
import Card from "../components/Card";
import { fetchCoffeeStores } from "../lib/coffeeStores";
import useTrackLocation from "../hooks/useTrackLocation";
import { StoreContext, actionType } from "../store/StoreContext";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home({ coffeeStores }) {
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { state, dispatch } = useContext(StoreContext);

  const { locationErrorMsg, handleTrackLocation, isFindingLocation } =
    useTrackLocation();

  const handleBannerButtonClick = () => {
    handleTrackLocation();
  };

  useEffect(async () => {
    if (state.latLong) {
      try {
        const response = await fetch(
          `/api/getCoffeeStoresByLocation?latLong=${state.latLong}&limit=29`
        );
        const coffeeStores = await response.json();
        dispatch({
          type: actionType.SET_COFFEE_STORES,
          payload: { coffeeStores },
        });
      } catch (error) {
        console.log({ error });
        setCoffeeStoresError(error.message);
      }
    }
  }, [state.latLong]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />

        <meta
          name="description"
          content="allows you to discover coffee stores"
        ></meta>
      </Head>

      <main className={styles.main}>
        <Banner
          buttonTitle={isFindingLocation ? "loading..." : "view stores nearby"}
          buttonClick={handleBannerButtonClick}
        />
        {locationErrorMsg && (
          <p>{`somthing went wrong : ${locationErrorMsg}`}</p>
        )}
        {coffeeStoresError && (
          <p>{`somthing went wrong : ${coffeeStoresError}`}</p>
        )}
        <div className={styles.heroImage}>
          <Image
            src="/static/heroImage.png"
            width={170}
            height={170}
            alt="coffee image"
          />
        </div>
        {state.coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Near Me Stores</h2>
            <div className={styles.cardLayout}>
              {state.coffeeStores.map((cs) => (
                <Card
                  name={cs.name}
                  href={`/CoffeeStores/${cs.id}`}
                  key={cs.Id}
                  imageUrl={
                    cs.imgUrl ||
                    "https://rusticiran.com/wp-content/uploads/2018/02/14-%D8%B9%DA%A9%D8%B3-%D8%A8%D8%B1%D8%A7%DB%8C-%DA%A9%D8%A7%D9%81%DB%8C-%D8%B4%D8%A7%D9%BE-%DA%86%D9%88%D8%A8%DB%8C-9.jpg"
                  }
                  className={styles.card}
                />
              ))}
            </div>
          </>
        )}
        {coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Totonto Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((cs) => (
                <Card
                  name={cs.name}
                  href={`/CoffeeStores/${cs.id}`}
                  key={cs.Id}
                  imageUrl={
                    cs.imgUrl ||
                    "https://rusticiran.com/wp-content/uploads/2018/02/14-%D8%B9%DA%A9%D8%B3-%D8%A8%D8%B1%D8%A7%DB%8C-%DA%A9%D8%A7%D9%81%DB%8C-%D8%B4%D8%A7%D9%BE-%DA%86%D9%88%D8%A8%DB%8C-9.jpg"
                  }
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
