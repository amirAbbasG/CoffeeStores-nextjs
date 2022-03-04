//initialize unsplash

import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getFetchCoffeeStoresUrl = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&
    query=${query}&client_id=${process.env.NEXT_PUBLIC_FOURSQURE_CLIENT_ID}&
    client_secret=${process.env.NEXT_PUBLIC_FOURSQURE_CLIENT_SECRET}&v=20220221&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
  latLong = "43.65267326999575,-79.39545615725015",
  limit = 9
) => {
  try {
    const photos = await getListOfCoffeeStorePhotos();

    const response = await fetch(
      getFetchCoffeeStoresUrl(latLong, "coffee stores", limit),
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_FOURSQURE_API_KEY,
        },
      }
    );
    const { results } = await response.json();

    return (
      results?.map((venue, index) => {
        const neighbourhood = venue.location.neighborhood;
        return {
          // ...venue,
          id: venue.fsq_id,
          address: venue.location.address || "",
          name: venue.name,
          imgUrl: photos[index],
          neighbourhood:
            (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) ||
            venue.location.cross_street ||
            "",
        };
      }) || []
    );
  } catch (error) {
    if (
      !process.env.NEXT_PUBLIC_FOURSQURE_API_KEY ||
      !process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
    ) {
      console.error(
        "🚨 Make sure to setup your API keys, checkout the docs on Github 🚨"
      );
    }
    console.log("Something went wrong fetching coffee stores", error);
    return [];
  }
};
