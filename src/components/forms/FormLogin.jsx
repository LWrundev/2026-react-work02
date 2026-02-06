function FormLogin({signinData,handleInputSingin,login}) {
  return <>
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
  </>
}
export default FormLogin;
