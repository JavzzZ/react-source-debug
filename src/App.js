import logo from './logo.svg';
import './App.css';
import { useState, useReducer, useEffect } from 'react';

const reducer = (state, action) => {
  switch (action) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    case 'reset':
      return 100;
    default:
      throw new Error('Unexpected action');
  }
};

let html2canvas = null;

function App() {
  const [count1, setCounter] = useState(0);
  const [count2, dispatch] = useReducer(reducer, 100);

  useEffect(() => {
    import('html2canvas').then((OneComponent) => {
      html2canvas = OneComponent.default;
    });
  }, [])

  const downloadCanvas = () => {
    const contentEl = document.getElementById('download');
    contentEl && html2canvas(contentEl, {
      useCORS: true,
    }).then((canvas) => {
      try {
        // 创建隐藏的可下载链接
        const eleLink = document.createElement('a');
        eleLink.download = `REACT_${new Date().getTime()}.png`;
        eleLink.style.display = 'none';
        // 图片转base64地址
        eleLink.href = canvas.toDataURL('image/png');
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
      } catch (e) {
        throw e;
      }
    });
  }

  return (
    <div className="App" id="download">
      <header className="App-header">
        <p>counter 1 = {count1}</p>
        <div>
          <button onClick={() => setCounter((count) => count + 1)}>+1</button>
          <button onClick={() => setCounter((count) => count - 1)}>-1</button>
        </div>
        <p>counter 2 = {count2}</p>
        <div>
          <button onClick={() => dispatch('increment')}>+1</button>
          <button onClick={() => dispatch('decrement')}>-1</button>
          <button onClick={() => dispatch('reset')}>reset</button>
        </div>
        {/* 打印模块 */}
        <div>
          <button onClick={() => downloadCanvas()}>打印</button>
        </div>
      </header>
      <div>test其他内容部分</div>
    </div>
  );
}

export default App;
