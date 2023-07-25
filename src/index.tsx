import ReactDOM from 'react-dom/client';
import '@/index.css';
import 'animate.css';
import App from '@/App';
import { BrowserRouter } from 'react-router-dom';
import { debounce } from './tools';
import '@/tools/jquery.ripples';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// 视口变化时，改变body的class（响应式）
function change() {
  // 视口宽度
  const clientWidth = document.body.clientWidth;
  if (clientWidth <= 768) {
    document.body.className = 'global-style small-screen-style';
  } else {
    document.body.className = 'global-style';
  }
}
// 防抖处理
const changeDebounce = debounce(function () {
  change();
}, 500);
// 初始化
change();

// 窗口事件
window.onresize = changeDebounce;

// 横竖屏事件
window.onorientationchange = changeDebounce;
