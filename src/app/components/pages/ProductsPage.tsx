import { getProducts } from "../../server/actions";
import ProductList from "../ProductList";

export default async function ProductPage() {
  const products = (await getProducts()) as Product[]; // Fetch products on the server

  return <ProductList products={products} />;
}
