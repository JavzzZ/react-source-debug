import '../requestIdleCallbackPolyfill';

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.flat().map(child => {
        return typeof child !== 'object' ? createTextElement(child) : child;
      }),
    }
  }
}

let workInProgress = null; // 当前处理的fiber节点
let workInProgressRoot = null; // 储存整个FiberRoot
let currentHookFiber = null; // 预留指针
let currentHookIndex = 0; // 当前hook在整个hooks中的索引

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

    window.requestIdleCallback(workloop);
  }
}

function workloop() {
  while (workInProgress) {
    workInProgress = performUnitOfWork(workInProgress);
  }

  if (!workInProgress && workInProgressRoot.current.alternate) {
    workInProgressRoot.current = workInProgressRoot.current.alternate;
    workInProgressRoot.current.alternate = null;
  }
}

function performUnitOfWork(fiber) {
  // 处理fiber分为三个步骤
  // 1. 处理当前 fiber：创建 DOM，设置 props，插入当前 dom 到 parent
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    currentHookFiber = fiber;
    currentHookFiber.memorizedState = [];
    currentHookIndex = 0;
    fiber.props.children = [fiber.type(fiber.props)];
  } else {
    if (!fiber.stateNode) {
      fiber.stateNode = fiber.type === 'HostText' ? document.createTextNode('') : document.createElement(fiber.type);
      Object.keys(fiber.props).filter(isProperty).forEach((key) => {
        fiber.stateNode[key] = fiber.props[key];
      })
    }

    if (fiber.return) {
      // 往上查找，直到有一个节点存在stateNode
      let domParentFiber = fiber.return;
      while (!domParentFiber.stateNode) {
        domParentFiber = domParentFiber.return;
      }
      domParentFiber.stateNode.appendChild(fiber.stateNode);
    }
  }

  // 2. 初始化 children 的fiber
  let prevSibling = null;
  // mount 阶段 oldFiber 为空，update 阶段为上一次的值
  let oldFiber = fiber.alternate?.child;

  fiber.props.children.forEach((child, index) => {
    let newFiber = null;
    if (!oldFiber) {
      // new
      newFiber = {
        type: child.type,
        stateNode: null,
        props: child.props,
        return: fiber,
        alternate: null,
        child: null,
        sibling: null,
      }
    } else {
      // update
      newFiber = {
        type: child.type,
        stateNode: oldFiber.stateNode,
        props: child.props,
        return: fiber,
        alternate: oldFiber,
        child: null,
        sibling: null,
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
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
  while (nextFiber) {
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

function useState(initialState) {
  const oldHook = currentHookFiber.alternate?.memorizedState?.[currentHookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initialState,
    queue: [],
    dispatch: oldHook ? oldHook.dispatch : null,
  }

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = typeof action === 'function' ? action(hook.state) : action;
  })

  const setState = hook.dispatch ? hook.dispatch : (action) => {
    hook.queue.push(action);
    // re-rerender
    workInProgressRoot.current.alternate = {
      stateNode: workInProgressRoot.containerInfo,
      props: workInProgressRoot.current.props,
      alternate: workInProgressRoot.current, // 重要!!!!!  交换alternate
    }
    workInProgress = workInProgressRoot.current.alternate;
    window.requestIdleCallback(workloop);
  }

  currentHookFiber.memorizedState.push(hook);
  currentHookIndex++;

  return [hook.state, setState];
}

function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);
  const dispatch = (action) => {
    // reducer = (oldState, action) => newState
    setState((state) => reducer(state, action));
  }

  return [state, dispatch];
}

function act(callback) {
  callback();
  return new Promise(resolve => {
    function loop() {
      if (workInProgress) {
        window.requestIdleCallback(loop);
      } else {
        resolve();
      }
    }

    loop();
  })
}

export default { createElement, createRoot, useState, useReducer, act };
