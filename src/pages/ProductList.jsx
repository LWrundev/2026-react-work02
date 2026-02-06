import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function ProductList(params) {
    const API_BASE=import.meta.env.VITE_API_BASE;
    const API_KEY=import.meta.env.VITE_API_KEY;
    const [ productsData , setProductsData ] = useState([]);
    
    const getProductsData = async() =>{
        try {
            const res = await axios.get(`${API_BASE}/api/${API_KEY}/products/all`);
            console.log(res.data.products);
            setProductsData(res.data.products);
            
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        getProductsData();
    },[])
    return <>
    <div className="container py-3">
        <h1 className="text-center">🐕 產品列表</h1>
        <div className="row row-cols-3 gy-3">
            {productsData.map((product)=>{
            return <>
            <div className="col" key={product.id}>
                <div className="card h-100">
                <img src={product.imageUrl} className="card-img-top" alt={product.title} />
                    <div className="card-body ">
                        <h5 className="card-title">
                            {product.title}
                        </h5>
                        <span className="badge text-bg-secondary mb-2">
                            {product.category}
                        </span>
                        <p className="card-text">
                        {product.description}
                        </p>
                    </div>
                    <div class="card-footer text-bg-light">
                        <span>優惠價  $<strong className="text-danger fs-4">{product.price}</strong></span>
                    </div>
                </div>
            </div>
            </>    
            })}
        </div>
    </div>

    </>
}