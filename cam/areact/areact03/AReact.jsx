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

let workInProgress = null; // 当前处理的fiber节点
let workInProgressRoot = null; // 储存整个FiberRoot

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
 * */
class AReactDomRoot {
  _internalRoot = null;
  constructor(container) {
    this.container = container;
    this._internalRoot = {
      current: null,
      containerInfo: container,
    }
  }
  render(element) {
    this._internalRoot.current = {
      alternate: {
        stateNode: this._internalRoot.containerInfo,
        props: {
          children: [element]
        }
      }
    }
    workInProgressRoot = this._internalRoot;
    workInProgress = workInProgressRoot.current.alternate;
    setTimeout(workloop);
  }
}

function workloop() {
  while (workInProgress) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber) {
  // 处理fiber分为三个步骤
  // 1. 处理当前 fiber：创建 DOM，设置 props，插入当前 dom 到 parent
  if (!fiber.stateNode) {
    fiber.stateNode = fiber.type === 'HostText' ? document.createTextNode('') : document.createElement(fiber.type);
    Object.keys(fiber.props).filter(isProperty).forEach((key) => {
      fiber.stateNode[key] = fiber.props[key];
    })
  }

  if (fiber.return) {
    // 把当前的 fiber 插入到他的父级或者叔叔节点
    fiber.return.stateNode.appendChild(fiber.stateNode);
  }

  // 2. 初始化 children 的fiber
  let prevSibling = null;
  fiber.props.children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      stateNode: null,
      props: child.props,
      return: fiber,
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
  })

  // 3. 返回下一个处理的 fiber
  return getNextFiber(fiber);
}

function getNextFiber(fiber) {
  /***
   * 遍历顺序：
   * 先遍历 child
   * 然后是 sibling
   * 然后是 return 并找下一个 sibling
   * */
  if (fiber.child) {
    return fiber.child;
  }

  // 指针存放当前fiber
  let nextFiber = fiber;
  while(nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    } else {
      nextFiber = nextFiber.return;
    }
  }

  return null;
}

function createRoot(container) {
  return new AReactDomRoot(container);
}

export default { createElement, createRoot };
