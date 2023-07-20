# React v18.2.0 源码调试环境

本仓库基于 create-react-app 创建。

React v18.2.0 源代码存放于 `src/react` 目录，作为 git submodules 的方式组织。

### 安装方法：

```sh
git clone --recurse-submodules git@github.com:camsong/react-source-debug.git
cd react-source-debug
yarn install
yarn start
```

### 开始调试
打开 http://localhost:3000/ 即可开始调试。
建议先完成以下任务，增加对 React 了解：
1. 火焰图查看代码的调用堆栈，并跳转到感兴趣的代码
2. 查看 workloop 的代码 `src/react/packages/react-reconciler/src/ReactFiberWorkLoop.old.js`
3. 查看 render(beginWork, completeWork)、commit 阶段
4. 查看 Fiber 的数据结构 `src/react/packages/react-reconciler/src/ReactInternalTypes.js`
5. 查看 Hooks 的数据结构 `src/react/packages/react-reconciler/src/ReactFiberHooks.old.js`

### areact文件
1. areact01  TDD模式
2. areact02  JSX与同步模式
3. areact03  Fiber与异步模式
4. areact04  手写函数式组件
5. areact05  手写useState & useReducer


