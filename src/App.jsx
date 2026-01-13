import { useState,useEffect } from "react"
import axios from "axios"

const table = () =>{
  <div className="my-4 p-4 border rounded">
    <div className="row">
      <div className="col-6">
        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div className="col-6">
        <div className="card">
          <img src="..." class="card-img-top" alt="..."/>
          <div class="card-body">
            <p class="card-text">
              Some quick example text to build on the card title and make up the bulk of the card’s content.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

}

function App() {
  const API_BASE=import.meta.env.VITE_API_BASE;
  const API_KEY=import.meta.env.VITE_API_KEY;
  

  const [signin , setSignin] = useState({
    username: "",
    password: ""
  });
  
  const [isAuth , setIsAuth] =useState(false);

  const [products, setProducts] = useState([]);

  const [tempProducts, setTempProducts] = useState(null);

  const handleInputChange = (e) =>{
    const {name,value} = e.target
    setSignin((preData)=>({
      ...preData,
      [name]:value
    }))
  };

  const loginSubmit = async (e) =>{
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, signin);
      console.log(res.data);
      const {token,expired} = res.data;
      document.cookie = `myToken=${token};expires=${new Date(expired)}`;
      //                                      cookie
      axios.defaults.headers.common['Authorization'] = token;
      //                                      自動在 Header 帶Token
      setIsAuth(true); //取得cookie和token後，IsAuth改為"true"
      getProducts();
    } catch (error) {
      console.log(error.response?.data?.message || "登入失敗");
      setIsAuth(false);
    }
  }
  const checkLogin =async (e)=>{
    try {
      const res = await axios.post(`${API_BASE}/api/user/check`)
      // 讀取 Cookie
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("myToken="))
        ?.split("=")[1];
      axios.defaults.headers.common['Authorization'] = token;
      console.log(res);
      
    } catch (error) {
      console.log(error.response?.data?.message || "登入失敗");
    }
  }
  const getProducts = async ()=>{
    try {
      const res = await axios.get( `${API_BASE}/api/${API_KEY}/admin/products`)
      setProducts(res.data.products);
      console.log(res.data.products);
      console.log(products);
      
    } catch (error) {
      console.log(error.response?.data?.message || "取得資料失敗");
    }
  };
  return <>
    <div className="container">
      {!isAuth ? 
        (
          <div className="my-4 p-4 border rounded w-50 m-auto">
            <h1 className="mb-3 h3 text-center">請先登入</h1>
            <form action="" onSubmit={(e)=> loginSubmit(e)}>
              <div className="mb-4">
                <label htmlFor="username" className="form-label">電子信箱</label>
                <input type="text" id="username" name="username" 
                className="form-control" placeholder="輸入電子信箱"
                value={signin.username} onChange={(e)=>handleInputChange(e)} 
                />
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="form-label">密碼</label>
                <input type="password" id="password" name="password"className="form-control"  placeholder="輸入密碼"
                value={signin.password} onChange={(e)=>handleInputChange(e)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">登入</button>
            </form>
          </div>
        ) : 
          <div className="my-4 p-4 border rounded">
            <div className="row">
              <div className="col-6">
                <button type="button" className="btn btn-danger mb-4" onClick={checkLogin}>
                  確認是否登入
                </button>
                <table className="table table-hover table-bordered">
                  <thead className="text-center">
                    <tr>
                      <th scope="col">品名</th>
                      <th scope="col">類別</th>
                      <th scope="col">原價</th>
                      <th scope="col" className="text-nowrap">折扣價</th>
                      <th scope="col" className="text-nowrap">上架中</th>
                      <th scope="col" className="text-nowrap">商品詳情</th>
                    </tr>
                  </thead>

                  <tbody className="table-group-divider">
                    {products.map((product)=>(
                      <tr key={product.id} className="align-middle">
                        <th scope="row" >{product.title}</th>
                        <td className="text-nowrap text-center">{product.category}</td>
                        <td className="text-center">{product.origin_price}</td>
                        <td className="text-center">{product.price}</td>
                        <td className="text-center">{product.is_enabled === 1 ? "是" :"否"}</td>
                        <td className="text-center">
                          <button type="button" className="btn btn-primary"
                          onClick ={()=>setTempProducts(product)}>
                            檢視
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-6">
                <h2 className="text-center mb-4">商品詳細資訊</h2>
                {tempProducts  ?(
                  <div className="card w-100">
                    <img src={tempProducts.imageUrl} className="card-img-top" alt="..."/>
                    <div className="card-body">
                      <h5 className="card-title fw-bold">
                        {tempProducts.title}
                      </h5>
                      <p className="card-text">
                        {tempProducts.description}
                      </p>
                      <p className="card-text fs-6">
                        {tempProducts.content}
                      </p>
                    </div>
                    <div className="card-body d-flex gap-1">
                      {tempProducts.imagesUrl
                      .filter((item)=>( item !== ""))
                      .map((item)=>(
                        <div className="w-25">
                          <img src={item} className="rounded img-fix" alt="..."/>
                        </div>
                      ))}
                    </div>
                  </div>
                )
                : (
                  <div className="h-100 d-flex align-items-center justify-content-center">
                    <p className=" h1">點選【檢視】查看商品資訊</p>
                  </div>
                )}
              </div>
            </div>
          </div>

      }
      </div>
  </>
}

export default App