import { useRouter } from "next/router";

const CoffeeStores = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div>{id}</div>;
};

export default CoffeeStores;
