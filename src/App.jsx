import { useState,useEffect,useRef } from "react"
import { Routes,Route, BrowserRouter } from "react-router-dom";

import axios from "axios"
import * as bootstrap from "bootstrap";

import Header from "./components/layout/Header";
import HopmePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
//------目標 5-------
// 加入 BrowserRouter - 將main.jsx的app 包裹
// 準備元件
function App() {
  const API_BASE=import.meta.env.VITE_API_BASE;
  const API_KEY=import.meta.env.VITE_API_KEY;
  
  
  return <>
  <Header />
        <Routes>
          <Route path="/" element={<HopmePage />}></Route>
          <Route path="/ProductList" element={<ProductList />}></Route>
          <Route path="/ProductDetail" element={<ProductDetail />}></Route>
          <Route path="/Cart" element={<Cart />}></Route>
        </Routes>
 
  </>
  }

export default App