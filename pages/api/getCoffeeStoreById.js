import { getRecordById } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (id) {
      const findCoffeeStore = await getRecordById(id);
      if (findCoffeeStore.length > 0) {
        res.json(findCoffeeStore);
      } else {
        res.status(404).json({ message: "coffee store not found" });
      }
    } else {
      res.status(400).json({ message: "id is required" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "somthing went wrong", error });
  }
};

export default getCoffeeStoreById;
