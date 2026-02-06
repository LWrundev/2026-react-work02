import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // 包含 Popper，讓輪播和下拉選單能動
import './index.css'
import Appw4 from './Appw4.jsx'

createRoot(document.getElementById('w4')).render(
  <StrictMode>
    <Appw4 />
  </StrictMode>,
)
