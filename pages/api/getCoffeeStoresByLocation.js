import { fetchCoffeeStores } from "../../lib/coffeeStores";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong, limit);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ message: "ops somthing went wrong" });
  }
};

export default getCoffeeStoresByLocation;
