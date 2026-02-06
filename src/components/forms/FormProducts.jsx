function FormProducts({products,handleProductModalShow}) {
  return <>
    <table className="table table-hover table-bordered">
      <thead className="text-center">
        <tr>
          <th scope="col">品名</th>
          <th scope="col">類別</th>
          <th scope="col">原價</th>
          <th scope="col" className="text-nowrap">折扣價</th>
          <th scope="col" className="text-nowrap">上架中</th>
          <th scope="col" className="text-nowrap">已售出數量</th>
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
            <td className="text-center">{product.soldCount}</td>
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
  </>
}

export default FormProducts;