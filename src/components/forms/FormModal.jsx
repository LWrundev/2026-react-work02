function FormModal({
  modalAddProductTarget,
  modalType,
  temp,
  handleProductInput,
  handleImgInput,
  handleAddImg,
  handleDelImg,
  handleAddProductHide, 
  delProduct,           
  updateProduct}) {
  return <>
    <div className="modal fade" ref={modalAddProductTarget} 
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
                        <div className="col-6">
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
                        <div className="col-6">
                          <label htmlFor="soldCount" className="form-label">已售出數量</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            id="soldCount" 
                            name="soldCount"
                            min="0"
                            placeholder="輸入商品優惠價"
                            value={temp.soldCount}
                            onChange={(e) =>handleProductInput(e)} />
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
export default FormModal;