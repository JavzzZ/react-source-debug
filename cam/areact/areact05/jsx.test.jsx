import { describe, it, expect } from 'vitest';
import AReact from './AReact';
const act = AReact.act;

describe('Hooks', () => {
  it('should support useState', async () => {
    const container = document.createElement("div");
    const globalObj = {};

    function App() {
      const [count, setCount] = AReact.useState(100);
      globalObj.count = count;
      globalObj.setCount = setCount;

      return <div>{count}</div>;
    }

    // 渲染组件
    const root = AReact.createRoot(container);

    await act(() => {
      root.render(<App />);
    })
    await act(() => {
      globalObj.setCount((count) => count + 1);
    })
    expect(globalObj.count).toBe(101);

    await act(() => {
      globalObj.setCount(globalObj.count + 1);
    })
    expect(globalObj.count).toBe(102);
  })

  it('should support useReducer', async () => {
    const container = document.createElement("div");
    const globalObj = {};

    function reducer(state, action) {
      switch (action.type) {
        case 'add':
          return state + 1;
        case 'sub':
          return state - 1;
      }
    }

    function App() {
      const [count, dispatch] = AReact.useReducer(reducer, 100);
      globalObj.count = count;
      globalObj.dispatch = dispatch;

      return <div>{count}</div>;
    }

    // 渲染组件
    const root = AReact.createRoot(container);

    await act(() => {
      root.render(<App />);
    })
    await act(() => {
      globalObj.dispatch({ type: 'add' });
      globalObj.dispatch({ type: 'add' });
    })
    expect(globalObj.count).toBe(102);
  })
})
