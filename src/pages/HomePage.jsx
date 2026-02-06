import { useState,useEffect,useRef } from "react";
import axios from "axios"
import * as bootstrap from "bootstrap";

export default function HopmePage(params) {
  const API_BASE=import.meta.env.VITE_API_BASE;
  const API_KEY=import.meta.env.VITE_API_KEY;
  
  const modalAddProduct = useRef(null);
  const modalAddProductTarget = useRef(null);
  //--  登入的帳密資料
  const [signinData , setSigninData] = useState({
    username: "",
    password: ""
  });
  //-- 把要請求的商品架構存成變數。要存成number的屬性先寫 0
  const INITIAL_PRODUCT_TEMP = {
    title:"",
    category:"",
    origin_price:0,
    price:0,
    unit:"",
    description:"",
    content:"",
    is_enabled:0,
    imageUrl:"",
    imagesUrl:[""]
  }

  const [isAuth , setIsAuth] = useState(false);
  const [products , setProducts] = useState([]);
  const [temp , setTemp] =useState(INITIAL_PRODUCT_TEMP); //將指定的商品資料存入並渲染
  const [modalType, setModalType] = useState(""); //--  Modal 控制相關狀態

  //----------   儲存 登入參數   -------------
  const handleInputSingin = (e)=>{
    const {name, value} = e.target;
    setSigninData(prev => ({...prev, [name]:value}))
  }

  //----------   儲存 指定要編輯的商品資訊   -------------
  const handleProductInput =(e)=>{
    const {name,value ,checked ,type } =e.target;

    setTemp(prev => ({
      ...prev,
      [name] : type === 'checkbox' ?( checked ?1:0 )
        : (type === 'number' ? Number(value) 
          : value)
    }))
    // console.log(name , value);
    
  }
  //----------   儲存 商品的圖片。陣列資料，要另外處理   -------------

  const handleImgInput = (index,value) =>{
    setTemp((prev) =>{
      const newImg =[...prev.imagesUrl];  //---複製陣列
      newImg[index]=value;  //--圖片網址對應其順序
      return {...prev, imagesUrl:newImg} //--更新imagesUrl
    })
  }

  //----------   控制 新增商品的modal視窗   -------------
  const handleProductModalShow = (product,type)=>{
    setTemp((prev)=>(
      {
        ...prev,
        ...product
      }
    ))
    //--  設定是編輯/新增/刪除商品
    setModalType(type);
    //--  開啟
    modalAddProduct.current.show();
  }
  const handleAddProductHide = ()=>{
    //--  關閉
    modalAddProduct.current.hide();
  }
  //---------- 在新增商品的表單中，新增圖片的input -------------
  const handleAddImg = ()=> {
    if (temp.imagesUrl?.length >= 5) return; //--- 圖片有5張就不能觸發
    setTemp(prev =>{
      const newImg = [...prev.imagesUrl];
      newImg.push("");
      return { ...prev , imagesUrl:newImg }
    })
      //--- 按下按鈕後新增一筆空字串到陣列，感應到陣列變長了，會新增一組input
  }
  //---------- 在新增商品的表單中，刪除圖片的input -------------
  const handleDelImg = ()=> {
    if (temp.imagesUrl?.length <=1) return; //--- 圖片只有1張就不能觸發
    setTemp(prev =>{
      const delImg =[...prev.imagesUrl];
      delImg.pop();
      return { ...prev , imagesUrl:delImg }
    })
  
  }
  
  //----------   POST 登入   -------------
  const login = async(e)=>{
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, signinData);
      const {token , expired} = res.data; // 取得登入後回傳的token與驗證時限
      document.cookie = `myToken=${token};expires=${new Date(expired)}`;  
      //---   將token存入瀏覽器 cokkie
      axios.defaults.headers.common['Authorization'] = token;
      //---   將token存入axios-header，之後發request時會自動帶入
      setIsAuth(true);
      // console.log(res);
      
    } catch (error) {
      // console.log(error);
      
    }
  }
  //----------   POST 檢查有無登入   -------------
  const checkAuth = async () =>{
    //----- 1. 從 Cookie 取出 Token (split 寫法)
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("myToken="))
      ?.split("=")[1];
    //----- 2. 如果 Token 存在，就把它設定回 Axios 並更新登入狀態
    //      ---- 因為更新畫面時，【POST 登入】的axios-header會被清空，所以要用useEffect儲存 
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      }else{
        setIsAuth(false);
        return
      }
    try {
      //----- 3. 進行驗證請求，成功後更新 isAuth ，並請求 商品列表
      const res = await axios.post(`${API_BASE}/api/user/check`)
      // console.log(res);
      if(res.data.success){
        setIsAuth(true);
        getProducts();
      }
    } catch (error) {
      // console.log(error);
      setIsAuth(false);
    }
  }
  //----------   GET 商品列表   -------------
  const getProducts = async () => {
    try {
      const res = await axios.get( `${API_BASE}/api/${API_KEY}/admin/products`)
      setProducts(res.data.products)
      // console.log(res.data.products);
      
    } catch (error) {
      // console.log(error);
      
    }
  }
  //----------  POST/PUT 送出 商品新資料   ------------- 
  const updateProduct = async (id)=> {
    // 使用 modalType、method 來判斷用POST或PUT
    let apiUrl = `${API_BASE}/api/${API_KEY}/admin/product`;
    let method = 'post';

    if(modalType === 'edit'){
      apiUrl =`${API_BASE}/api/${API_KEY}/admin/product/${id}`;
      method = 'put'
    }
    const productData ={data:{
      ...temp,
      imagesUrl: temp.imagesUrl ? 
        temp.imagesUrl.filter(url => url.trim() !== "") : 
        []
    }}
    try {
      const res = await axios[method](apiUrl,productData)
      getProducts();
      modalAddProduct.current.hide();
      alert(res.data.message)
    } catch (error) {
      // console.log(error);
      
    }
  }
  //----------  DELETE 送出 刪除選擇的商品   ------------- 
  const delProduct = async(id)=> {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_KEY}/admin/product/${id}`)
      // console.log(res.data.message);
      getProducts();
      modalAddProduct.current.hide();
      alert(res.data.message)
      
    } catch (error) {
      // console.log(error);
      
    }
  }
  //----- 驗證登入狀態  -----
  //     -- 依賴陣列保持為空，只在頁面剛載入時跑這一次
  useEffect(()=>{
    checkAuth();
  },[])
  //----- 驗證登入狀態 結束  -----

  //----- 初始化 新增商品的modal  -----
  useEffect(()=>{
    modalAddProduct.current = new bootstrap.Modal(modalAddProductTarget.current);
  },[])
  
  return <>
    {! isAuth ? 
      <div className="my-4 p-4 border rounded w-50 m-auto">
        <h1 className="mb-3 h3 text-center">請先登入</h1>
        <form action="" onSubmit={(e)=>login(e)}>
          <div className="mb-4">
            <label htmlFor="username" className="form-label">電子信箱</label>
            <input type="text" 
            id="username" 
            name="username" 
            autoComplete="username"
            className="form-control" 
            placeholder="輸入電子信箱"
            value={signinData.username}
            onChange={(e)=>{handleInputSingin(e)}}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="form-label">密碼</label>
            <input type="password" 
            id="password" 
            name="password" 
            className="form-control"  
            placeholder="輸入密碼" 
            autoComplete="current-password"
            value={signinData.password}
            onChange={(e)=>{handleInputSingin(e)}}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">登入</button>
        </form>
      </div>
    :
      <div className="">

        <div className="container">
          <div className="">
            {/*------  render 商品列表  ------*/ }
            <table className="table table-hover table-bordered">
              <thead className="text-center">
                <tr>
                  <th scope="col">品名</th>
                  <th scope="col">類別</th>
                  <th scope="col">原價</th>
                  <th scope="col" className="text-nowrap">折扣價</th>
                  <th scope="col" className="text-nowrap">上架中</th>
                  <th scope="col" className="text-nowrap">商品編輯</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {products.map((product)=>(
                  <tr key={product.id} className="align-middle">
                    <th scope="row" >{product.title}</th>
                    <td className="text-nowrap text-center">{product.category}</td>
                    <td className="text-center">{product.origin_price}</td>
                    <td className="text-center">{product.price}</td>
                    <td className="text-center">
                      {product.is_enabled === 1 ? (
                        <span className="text-bg-success badge">是</span>
                      ):(
                        <span className="text-bg-danger badge">否</span>
                      )}
                    </td>
                    <td className="text-center">
                      <button type="button" className="btn btn-primary me-2"
                      onClick={()=>handleProductModalShow(product , "edit")}
                       >
                        編輯
                      </button>
                      <button type="button" className="btn btn-danger"
                      onClick={()=>handleProductModalShow(product , "delete")}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="btn btn-outline-primary w-25"
              onClick={()=>handleProductModalShow(INITIAL_PRODUCT_TEMP , "create")}>
              新增商品
            </button>
          </div>
        </div>
      </div>
    }
    {/* --新增商品的modal-- */}
    <div className="modal fade" id="modalAddProductTarget" ref={modalAddProductTarget} 
      data-bs-backdrop="static" 
      data-bs-keyboard="false" 
      tabIndex="-1" 
      aria-labelledby="modalAddProductTargetLabel" >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className={`modal-header bg-${modalType === 'delete' ? 'danger':'secondary'} `}>
            <h3 className="modal-title fs-5 fw-bold text-light" id="modalAddProductTargetLabel">
              {modalType === 'delete' ? "刪除商品" : (modalType === 'create' ? "新增商品資訊" : "編輯商品資訊")}
            </h3>
          </div>
          <div className="modal-body">
            {/*---表單內容 開始---*/}
            {
              modalType === 'delete' ?(
                <div className="text-center">
                  <p>
                    <strong>{temp.title}</strong>
                     <br />
                    id：{temp.id}
                  </p>
                  <p className="fw-bold">
                    確定要刪除此商品資訊嗎？
                  </p>
                </div>
              ):(
              <form action="">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="row g-3">
                        <div className="col-6">
                          <label htmlFor="title" className="form-label">標題</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="title" 
                            name="title"
                            placeholder="輸入商品標題"
                            value={temp.title}
                            onChange={(e) =>handleProductInput(e)} />
                        </div>
                        <div className="col-6">
                          <label htmlFor="category" className="form-label">類型</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="category" 
                            name="category"
                            placeholder="輸入商品類型"
                            value={temp.category}
                            onChange={(e) =>handleProductInput(e)} />
                        </div>
                        <div className="col-6">
                          <label htmlFor="origin_price" className="form-label">原價</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            id="origin_price" 
                            name="origin_price"
                            min="0"
                            placeholder="輸入商品原價"
                            value={temp.origin_price}
                            onChange={(e) =>handleProductInput(e)} />
                        </div>
                        <div className="col-6">
                          <label htmlFor="price" className="form-label">優惠價</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            id="price" 
                            name="price"
                            min="0"
                            placeholder="輸入商品優惠價"
                            value={temp.price}
                            onChange={(e) =>handleProductInput(e)} />
                        </div>
                        <div className="col-12">
                          <label htmlFor="unit" className="form-label">計價單位</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="unit" 
                            name="unit"
                            placeholder="輸入商品計價單位（件 / 組）"
                            value={temp.unit}
                            onChange={(e) =>handleProductInput(e)} />
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              name="is_enabled"
                              id="is_enabled"
                              className="form-check-input"
                              type="checkbox"
                              checked={temp.is_enabled === 1}
                              onChange={(e) =>handleProductInput(e)}
                              />
                            <label className="form-check-label" htmlFor="is_enabled">
                              上架商品
                            </label>
                          </div>
                        </div>                      
                        <div className="col-12">
                          <label htmlFor="description" className="form-label">產品描述</label>
                          <textarea
                            name="description"
                            id="description"
                            className="form-control"
                            placeholder="請輸入產品描述"
                            value={temp.description}
                            onChange={(e) =>handleProductInput(e)}
                            ></textarea>
                        </div>
                        <div className="col-12">
                          <label htmlFor="content" className="form-label">說明內容</label>
                          <textarea 
                            name="content" 
                            id="content" 
                            className="form-control"
                            placeholder="請輸入說明內容"
                            value={temp.content}
                            onChange={(e) =>handleProductInput(e)}
                            ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row row-cols-1 g-3">
                        <div className="col">
                          <label htmlFor="imageUrl" className="form-label">商品主要照片</label>
                          <input type="text" className="form-control" 
                          id="imageUrl" name="imageUrl"
                          placeholder="輸入照片網址"
                          value={temp.imageUrl}
                          onChange={(e) =>handleProductInput(e)} />
                          {temp.imageUrl && 
                          <img src={temp.imageUrl} 
                            className="img-thumbnail" 
                            alt="主要圖片預覽" />}
                        </div>
                        <div className="col">
                            {temp.imagesUrl?.map((item, index) => (
                                <div key={index} className="mb-3 border p-2">
                                  <label htmlFor="imagesUrl" className="form-label">商品次要圖片</label>
                                  <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder={`請輸入圖片網址 ${index + 1}`}
                                    value={item} 
                                    onChange={(e) => handleImgInput(index , e.target.value)}
                                  />
                                  {/* 預覽圖 */}
                                  {item && <img src={item} 
                                  alt={`${temp.title} - 產品形象照${index+1}`} className="img-thumbnail w-25" />}
                                </div>
                              ))}
                        </div>
                        <div className="btn-group-vertical" role="group" aria-label="Vertical button group">
                            <button 
                            type="button" 
                            className="btn btn-outline-primary"
                            onClick={handleAddImg}
                            disabled={temp.imagesUrl?.length >= 5}
                            >新增圖片
                            </button>
                            <button 
                            type="button" 
                            className="btn btn-outline-danger"
                            onClick={handleDelImg}
                            disabled={temp.imagesUrl?.length <= 1}
                            >刪除圖片
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              )
            }
            {/*---表單內容 結束---*/}
            <div className="btn-group w-100 pt-4" role="group" aria-label="Basic example">
              <button type="button" 
                className="btn btn-outline-warning" 
                data-bs-dismiss="modal" 
                onClick={()=> handleAddProductHide()}>
                取消</button>
              {modalType === 'delete' ?(
                <button 
                type="button" 
                className="btn btn-danger"
                onClick={()=>delProduct(temp.id)}
                >送出
                </button>
              ) :(
                <button 
                type="button" 
                className="btn btn-primary"
                onClick={()=>updateProduct(temp.id)}
                >送出
                </button>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>  
  </>
  }