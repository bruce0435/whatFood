const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('applyLang', () => {
  test('updates page text when called', async () => {
    const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });

    await new Promise((resolve) => {
      dom.window.addEventListener('load', resolve);
    });

    dom.window.eval('lang = "en"');
    dom.window.applyLang();

    const { document } = dom.window;
    expect(document.getElementById('pageTitle').textContent).toBe('What to Eat?');
    expect(document.getElementById('startBtn').textContent).toBe('Start');
    expect(document.getElementById('saveBtn').textContent).toBe('Save');
  });
});
