import { useState } from "react";
import Layout from "../components/Layout";
import CategoryButton from "../components/CategoryButton";
import Product from '../components/Product.jsx';
import { products, categories } from "../mockData";


export default function POS() {
  const [filtered, setFiltered] = useState(products);
  const [activeCategory, setActiveCategory] = useState("All");



  return (
    <Layout>
      <div className="flex gap-6 w-full">

        {/* LEFT SIDE */}
        <div className="flex-1 flex flex-col gap-4">



          {/* Categories */}
          <div className="flex justify-between overflow-x-auto pb-1 w-full">
            <CategoryButton
              categories={categories}
              active={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>

          {/* Product Grid */}
          <div className="bg-softWhite border border-gray-300 p-4 rounded-xl overflow-x-auto max-h-115 [&::-webkit-scrollbar]:hidden -ms-overflow-style-none">
            <h2 className="text-lg font-semibold mb-2">{activeCategory === "All" ? "All Products" : activeCategory}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-2">
              {filtered.map((p) => (
                <Product key={p.id} product={p} />
              ))}
            </div>
          </div>
          
        </div>

        

      </div>
    </Layout>
  );
}
