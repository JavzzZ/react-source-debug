import resolve from 'resolve';
// 常用的三个方法
import { describe, it, expect } from 'vitest';

function asyncSum(a, b) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(a + b);
    }, 1000);
  })
}
// describe 描述测试用例集
describe('TDD basic', () => {
  // it 描述单个的测试用例
  it('works', () => {
    // expect 做一个断言
    expect(Math.sqrt(16)).toBe(4);
    expect(Math.sqrt(16)).not.toBe(3);
  });

  it('works on async function', async () => {
    const sum = await asyncSum(100, 200);
    expect(sum).toBe(300);
  });
});
