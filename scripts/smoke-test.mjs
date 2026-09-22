const targets = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
const target = targets.find(x => x.type === 'page' && x.url.startsWith('http://127.0.0.1:5173'));
if (!target) throw new Error('Вкладка приложения не найдена');

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let id = 0;
const pending = new Map();
ws.onmessage = event => {
  const message = JSON.parse(event.data);
  if (!message.id) return;
  const task = pending.get(message.id);
  if (!task) return;
  pending.delete(message.id);
  if (message.error) task.reject(new Error(message.error.message)); else task.resolve(message.result);
};
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const callId = ++id;
  pending.set(callId, { resolve, reject });
  ws.send(JSON.stringify({ id: callId, method, params }));
});
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const clickText = async text => {
  const ok = await evaluate(`(() => { const el=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()===${JSON.stringify(text)}); if(!el)return false;el.click();return true })()`);
  if (!ok) throw new Error(`Не найдена кнопка: ${text}`);
  await wait(120);
};
const clickStarts = async text => {
  const ok = await evaluate(`(() => { const el=[...document.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith(${JSON.stringify(text)})); if(!el)return false;el.click();return true })()`);
  if (!ok) throw new Error(`Не найдена кнопка, начинающаяся с: ${text}`);
  await wait(120);
};

await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await evaluate(`indexedDB.deleteDatabase('tikhiy-den')`);
await send('Page.reload', { ignoreCache: true });
await wait(600);

const layout = await evaluate(`({innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth})`);
if (layout.scrollWidth > layout.innerWidth || layout.bodyWidth > layout.innerWidth) throw new Error(`Горизонтальное переполнение: ${JSON.stringify(layout)}`);

await clickText('Отметить, что я чувствую');
await clickStarts('Радость');
await clickText('Интерес');
await clickText('Дальше');
await evaluate(`document.querySelectorAll('.intensity-dots button')[2].click()`);
await clickText('Дальше');
await clickText('Усталость');
await clickText('Дальше');
await evaluate(`(() => { const t=document.querySelector('textarea'); const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set; setter.call(t,'После долгой прогулки'); t.dispatchEvent(new Event('input',{bubbles:true})); })()`);
await clickText('Сохранить отметку');
await wait(250);
const savedEntry = await evaluate(`({interest:document.body.innerText.includes('Интерес'),fatigue:document.body.innerText.includes('Усталость'),note:document.body.innerText.includes('После долгой прогулки')})`);
if (!savedEntry.interest || !savedEntry.fatigue || !savedEntry.note) throw new Error(`Сохранённая отметка не появилась полностью: ${JSON.stringify(savedEntry)}`);

await clickStarts('Выбрать цвет дня');
await evaluate(`(() => { const i=[...document.querySelectorAll('input')].find(x=>x.placeholder==='Например, пыльная лаванда'); const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(i,'тихий серо-синий'); i.dispatchEvent(new Event('input',{bubbles:true})); })()`);
await clickText('Сохранить цвет');
await wait(250);
if (!await evaluate(`document.body.innerText.includes('тихий серо-синий')`)) throw new Error('Цвет дня не сохранился');

await clickText('Календарь');
if (!await evaluate(`document.body.innerText.includes('Палитра месяца')`)) throw new Error('Палитра месяца не появилась');
await clickText('Эмоции');
await evaluate(`(() => { const i=[...document.querySelectorAll('input')].find(x=>x.placeholder==='Например, «обид»'); const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(i,'обид'); i.dispatchEvent(new Event('input',{bubbles:true})); })()`);
await wait(120);
if (!await evaluate(`document.body.innerText.includes('Обида') && document.body.innerText.includes('Злость')`)) throw new Error('Поиск эмоций не сработал');
await clickText('Статистика');
if (!await evaluate(`document.body.innerText.includes('Средняя интенсивность') && document.body.innerText.includes('Интерес')`)) throw new Error('Статистика не рассчиталась');
await clickText('Настройки');
if (!await evaluate(`document.body.innerText.includes('Экспортировать данные') && document.body.innerText.includes('Импортировать данные') && document.body.innerText.includes('только на этом устройстве')`)) throw new Error('Настройки данных отображаются не полностью');

const errors = await send('Runtime.evaluate', { expression: `window.__smokeDone=true`, returnByValue: true });
void errors;
console.log(JSON.stringify({ ok: true, layout, checks: ['entry', 'color', 'calendar', 'emotion search', 'statistics', 'settings', 'indexedDB'] }, null, 2));
ws.close();
