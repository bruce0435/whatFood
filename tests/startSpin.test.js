const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('startSpin', () => {
  test('avoids immediate duplicates', async () => {
    const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });

    await new Promise((resolve) => {
      dom.window.document.addEventListener('DOMContentLoaded', resolve);
    });

    const { window } = dom;
    window.currentFoods = ['A', 'B', 'C', 'D'];

    const sequence = [0, 0, 0.1, 0, 0.2, 0, 0.3, 0.4];
    let idx = 0;
    jest.useFakeTimers();
    jest.spyOn(window.Math, 'random').mockImplementation(() => {
      const val = sequence[idx % sequence.length];
      idx += 1;
      return val;
    });

    window.startSpin();
    jest.runAllTimers();
    const first = window.recentDrawsList[0];

    window.startSpin();
    jest.runAllTimers();
    const second = window.recentDrawsList[0];

    expect(first).not.toBe(second);
  });
});
