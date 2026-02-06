import { useState,useEffect ,useRef } from "react"
import axios from "axios"
import * as bootstrap from "bootstrap";

import FormProducts from "./components/forms/FormProducts";
import FormLogin from "./components/forms/FormLogin";
import FormModal from "./components/forms/FormModal";


//------目標 3-------
// 存取登入狀態
// 商品啟用、關閉可以使用不同的顏色標示
// 可以檢視商品詳情，並編輯
// 可以新增、刪除商品
// --- 建立單一modal ，使用modal-type區分編輯 / 新增 / 刪除 使用
//------目標 4-------
// 將後台頁面 Modal 以及分頁改成元件
// 使用 import module 來引入元件
// 使用者可以打開 Modal 新增、編輯、刪除商品
// 新增一個自訂欄位，例如：商品評價星級。
// 串接圖片上傳 API 功能

function Appw3() {
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
    imagesUrl:[""],
    soldCount:0
  }

  const [isAuth , setIsAuth] = useState(false);
  const [products , setProducts] = useState([]);
  const [temp , setTemp] =useState(INITIAL_PRODUCT_TEMP); //將指定的商品資料存入並渲染
  const [modalType, setModalType] = useState(""); //--  Modal 控制相關狀態
  const [imgUpload , setImgUpload] = useState("");

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
        ...INITIAL_PRODUCT_TEMP,
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
      imagesUrl:[...temp.imagesUrl.filter(url => url !== "")]
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
  //----------  POST 上傳圖片   -------------
  const handleImgFile = (e)=>{
    setImgUpload(e.target.files[0]);
    // console.log(e.target.files[0]);
    
  }
  const handleImgUpload = async(e)=> {
    e.preventDefault();
    if(!imgUpload){ return };

    const imgData = new FormData();
    imgData.append('file-to-upload',imgUpload);
    try {
      const res = await axios.post( `${API_BASE}/api/${API_KEY}/admin/upload`,
        imgData,
        {headers:{'content-type':'multipart/form-data'}});
        alert("已上傳圖片");
        // console.log(res);
    } catch (error) {
      // console.log(error);
      alert("圖片上傳失敗");
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
        <FormLogin 
          signinData={signinData} 
          handleInputSingin={handleInputSingin}
          login={login} 
          />
      </div>
    :
      <div className="container my-3">
        <div className="">
          <div className="">
            {/*------  render 商品列表  ------*/ }
            <FormProducts 
              products={products} 
              handleProductModalShow={handleProductModalShow}
              />
            <button type="button" className="btn btn-outline-primary w-25"
              onClick={()=>handleProductModalShow(INITIAL_PRODUCT_TEMP , "create")}>
              新增商品
            </button>
            <form 
            // action="/api/thisismycourse2/admin/upload" 
            // encType="multipart/form-data"  
            // method="post"
            className="my-4">
              <input 
              type="file" 
              name="file-to-upload"
              className="form-control mb-3"
              accept=".jpg,.jpeg,.png"
              onChange={handleImgFile}
               />
              <input 
              type="submit" 
              value="Upload"
              className="btn btn-primary" 
              onClick={handleImgUpload}/>
            </form>  
          </div>
        </div>
      </div>
    }
    <FormModal 
      modalAddProductTarget={modalAddProductTarget} 
      modalType={modalType} 
      temp={temp} 
      handleProductInput={handleProductInput} 
      handleImgInput={handleImgInput} 
      handleAddImg={handleAddImg} 
      handleDelImg={handleDelImg}
      handleAddProductHide={handleAddProductHide}
      delProduct={delProduct}
      updateProduct={updateProduct}
     />
  </>
}

export default Appw3

