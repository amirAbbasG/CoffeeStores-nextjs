import { table, getMinifiedRecords, getRecordById } from "../../lib/airtable";

const creareCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;
    try {
      if (id) {
        const findCoffeeStore = await getRecordById(id);
        if (findCoffeeStore.length > 0) {
          res.json(findCoffeeStore);
        } else {
          //create store when its not exist
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);
            res.status(201).json(records);
          } else {
            res.status(400).json({ message: "name is required" });
          }
        }
      } else {
        res.status(400).json({ message: "id is required" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("somthing went wrong");
    }
  }
};

export default creareCoffeeStore;
