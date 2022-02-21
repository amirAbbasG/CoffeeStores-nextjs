const getFetchUrl = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&
    query=${query}&client_id=4IRSP1U3NKFIE5FIBOX1YJUAGBQ13REO0AWX4WNY5ITISJIJ&
    client_secret=LGMPQMLG3VBCOTDPD30JBD05TCALVOTHZFHJGA1N055CDRCS&v=20220221&limit=${limit}`;
};

export const fetchCoffeeStores = async () => {
  const response = await fetch(
    getFetchUrl("43.65267326999575,-79.39545615725015", "coffee stores", 8),
    {
      headers: {
        Authorization: "fsq3s2wIUzD1HIYdfrPfxzuY94hF6Zunpw8EB1G7kfF7nBY=",
      },
    }
  );
  const { results } = await response.json();
  return (
    results?.map((venue, indx) => {
      const neighbourhood = venue.location.neighborhood;
      return {
        // ...venue,
        id: venue.fsq_id,
        address: venue.location.address || "",
        name: venue.name,
        neighbourhood:
          (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) ||
          venue.location.cross_street ||
          "",
        imgUrl: null,
      };
    }) || []
  );
};
