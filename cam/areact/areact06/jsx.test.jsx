import { describe, it, expect, vi } from 'vitest';
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

describe('event binding', () => {
  it('should support event binding', async () => {
    const container = document.createElement("div");
    const globalObj = {
      increase: (count) => count + 1,
    };

    const increaseSpy = vi.spyOn(globalObj, 'increase');

    function App() {
      const [count, setCount] = AReact.useState(100);
      globalObj.count = count;
      globalObj.setCount = setCount;

      return <div>{count}
        <button onClick={() => setCount(globalObj.increase)}></button>
      </div>;
    }

    // 渲染组件
    const root = AReact.createRoot(container);

    await act(() => {
      root.render(<App />);
    })

    expect(increaseSpy).not.toBeCalled();
    await act(() => {
      container.querySelectorAll('button')[0].click();
      container.querySelectorAll('button')[0].click();
    })
    expect(increaseSpy).toBeCalledTimes(2);
  })
})

describe('Reconclier', () => {
  it('should support DOM CRUD', async () => {
    const container = document.createElement('div');
    function App() {
      const [count, setCount] = AReact.useState(2);

      return (
        <div id="foo">
          {count}
          <button onClick={() => setCount((count) => count + 1)}>+</button>
          <button onClick={() => setCount((count) => count - 1)}>-</button>
          <ul>
            {Array(count).fill(1).map((val, index) => (
              <li>{index}</li>
            ))}
          </ul>
        </div >
      );
    };

    const root = AReact.createRoot(container);
    await act(() => {
      root.render(<App />);
    })
    await act(() => {
      container.querySelectorAll('button')[0].click();
    })

    expect(container.innerHTML).toBe(
      '<div id="foo">3<button>+</button><button>-</button><ul><li>0</li><li>1</li><li>2</li></ul></div>'
    );

    await act(() => {
      container.querySelectorAll('button')[1].click();
      container.querySelectorAll('button')[1].click();
    })

    expect(container.innerHTML).toBe(
      '<div id="foo">1<button>+</button><button>-</button><ul><li>0</li></ul></div>'
    );
  })
})
