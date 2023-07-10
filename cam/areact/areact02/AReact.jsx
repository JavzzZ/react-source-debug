function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child !== 'object' ? createTextElement(child) : child;
      }),
    }
  }
}

// 文本内容
function createTextElement(text) {
  return {
    type: 'HostText', // React官方定义
    props: {
      nodeValue: text,
      children: [],
    }
  }
}

// 过滤掉没有children的元素
const isProperty = (key) => key !== 'children';

/***
 * 参考React源码实现
 * 原理：递归栈的调用
 * 缺点：当遇到计算量大的调用，无法中断会导致页面的卡顿
 * */ 
class AReactDomRoot {
  constructor(container) {
    this.container = container;
  }
  render(element) {
    this.renderImpl(element, this.container);
  }
  // 递归调用渲染子元素
  renderImpl(element, parent) {
    const dom = element.type === 'HostText' ? document.createTextNode('') : document.createElement(element.type);

    Object.keys(element.props).filter(isProperty).forEach((key) => {
      dom[key] = element.props[key];
    })

    element.props.children.forEach((child) => {
      this.renderImpl(child, dom);
    })

    parent.appendChild(dom);
  }
}

function createRoot(container) {
  return new AReactDomRoot(container);

}

export default { createElement, createRoot };
