import { describe, it, expect } from 'vitest';
import AReact from './AReact';

describe("AReact JSX", () => {
  it("should render jsx with text", () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar">hello</div>
        <button>Add</button>
      </div>
    );

    console.log('🚀 -- file: jsx.test.jsx:14 -- element:', JSON.stringify(element));
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

    console.log('🚀 -- file: jsx.test.jsx:31 -- element:', JSON.stringify(element));
    const root = AReact.createRoot(container);
    root.render(element);

    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><button></button></div>'
    );
  })
});
