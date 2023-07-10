import { describe, it, expect } from 'vitest';
import AReact from './AReact';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("AReact JSX", () => {
  it("should render jsx with text", () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar">hello</div>
        <button>Add</button>
      </div>
    );

    const root = AReact.createRoot(container);
    root.render(element);

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar">hello</div><button>Add</button></div>'
    );
  });

  it('should render jsx different props', () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo" className="bar">
        <button></button>
      </div>
    );

    const root = AReact.createRoot(container);
    root.render(element);

    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><button></button></div>'
    );
  })
});

describe("AReact Concurrent", () => {
  it.only("should render in async", async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button></button>
      </div>
    );

    console.log('🚀 -- file: jsx.test.jsx -- line 48 -- element', element);

    const root = AReact.createRoot(container);
    root.render(element);
    expect(container.innerHTML).toBe('');

    await sleep(1000);

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
    );
  });
});
