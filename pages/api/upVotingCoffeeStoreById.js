import { getRecordById, table, getMinifiedRecords } from "../../lib/airtable";

const upVotingCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      if (id) {
        const records = await getRecordById(id);
        if (records && records.length > 0) {
          const record = records[0];
          const calculateVoting = parseInt(record.voting) + 1;

          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifieRecords = getMinifiedRecords(updateRecord);
            res.json(minifieRecords);
          } else {
            res.status(400).json({ message: "update faild" });
          }
        } else {
          res.status(404).json({
            message: "Coffee store dose not exist with this id : ",
            id,
          });
        }
      } else {
        res.status(400).json({ message: "id is required" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "somthing went wrong" });
    }
  }
};

export default upVotingCoffeeStoreById;
