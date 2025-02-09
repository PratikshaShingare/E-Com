import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ProductGrid from "./components/ProductGrid";
import Pagination from "./components/Pagination";
import FinalCart from "./components/FinalCart";
import productsData from "./data.json";
import "./styles/styles.css";

const App = () => {
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFinalCart, setShowFinalCart] = useState(false);
  const [cart, setCart] = useState([]);

  const productsPerPage = 12;

  useEffect(() => {
    let filtered = productsData.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          product.category === selectedCategory ||
          product.subcategory === selectedSubcategory
      );
    }

    if (selectedSubcategory) {
      filtered = filtered.filter(
        (product) => product.subcategory === selectedSubcategory
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  const categories = [...new Set(productsData.map((p) => p.category))];
  const subcategories = selectedCategory
    ? [...new Set(productsData.filter((p) => p.category === selectedCategory).map((p) => p.subcategory))]
    : [];

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <div className="app">
      <Navbar
        onSearch={setSearchQuery}
        categories={categories}
        subcategories={subcategories}
        onCategorySelect={setSelectedCategory}
        onSubcategorySelect={setSelectedSubcategory}
        onCartClick={() => setShowFinalCart(true)}
      />

      {showFinalCart ? (
        <FinalCart cart={cart} onBack={() => setShowFinalCart(false)} />
      ) : (
        <>
          <ProductGrid products={currentProducts} addToCart={addToCart} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default App;
