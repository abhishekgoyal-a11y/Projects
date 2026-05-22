const LIST_KEY = 'mytasks_v1';
let tasks = JSON.parse(localStorage.getItem(LIST_KEY) || 'null');
let filter = 'all';

if (!tasks) {
  tasks = [
    {id:1, text:'Review project proposal and send feedback', done:false, prio:'high'},
    {id:2, text:'Schedule team standup for next week', done:true,  prio:'med'},
    {id:3, text:'Update documentation', done:false, prio:'low'},
  ];
}

const listEl       = document.getElementById('list');
const taskInput    = document.getElementById('taskInput');
const prioSel      = document.getElementById('prioInput');
const addBtn       = document.getElementById('addBtn');
const progressBar  = document.getElementById('progressBar');
const progressLabel= document.getElementById('progressLabel');
const statsEl      = document.getElementById('stats');
const footerNote   = document.getElementById('footerNote');
const clearDoneBtn = document.getElementById('clearDone');

// Date
const d = new Date();
document.getElementById('dateLabel').textContent =
  d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});

function save() { localStorage.setItem(LIST_KEY, JSON.stringify(tasks)); }

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function prioBadge(p) {
  if (p==='high') return '<span class="prio-badge prio-high">High</span>';
  if (p==='med')  return '<span class="prio-badge prio-med">Medium</span>';
  return '<span class="prio-badge prio-low">Low</span>';
}

function render() {
  const shown = tasks.filter(t => {
    if (filter==='active') return !t.done;
    if (filter==='done')   return t.done;
    if (filter==='high')   return t.prio==='high';
    return true;
  });

  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  progressBar.style.width = pct + '%';
  progressLabel.textContent =
    `${done} of ${total} task${total !== 1 ? 's' : ''} completed · ${pct}%`;

  const high = tasks.filter(t => t.prio==='high' && !t.done).length;
  statsEl.innerHTML =
    `<div class="stat">Total <span>${total}</span></div>` +
    `<div class="stat">Done <span>${done}</span></div>` +
    `<div class="stat">Active <span>${total - done}</span></div>` +
    (high ? `<div class="stat urgent">Urgent <span>${high}</span></div>` : '');

  footerNote.textContent = done ? `${done} completed task${done>1?'s':''} hidden in "Done" filter` : '';

  if (!shown.length) {
    const msg = filter==='done'    ? 'No completed tasks yet.' :
                filter==='high'    ? 'No urgent tasks — great!' :
                filter==='active'  ? 'All tasks done! 🎉' :
                                     'No tasks yet — add one above!';
    listEl.innerHTML = `<div class="empty"><div class="empty-icon"><i class="ti ti-clipboard-list"></i></div>${msg}</div>`;
    return;
  }

  listEl.innerHTML = shown.map(t => `
    <div class="task-item" data-id="${t.id}">
      <div class="check${t.done?' checked':''}"
           role="checkbox" aria-checked="${t.done}" tabindex="0"
           data-action="toggle" data-id="${t.id}"
           aria-label="${t.done?'Mark incomplete':'Mark complete'}">
        <svg width="12" height="10" viewBox="0 0 12 10">
          <polyline points="1.5 5 4.5 8 10.5 2"/>
        </svg>
      </div>
      <span class="task-text${t.done?' done':''}">${escHtml(t.text)}</span>
      ${prioBadge(t.prio||'med')}
      <button class="del-btn" data-action="delete" data-id="${t.id}"
              aria-label="Delete task">
        <i class="ti ti-trash" style="font-size:17px"></i>
      </button>
    </div>
  `).join('');
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) { taskInput.focus(); return; }
  tasks.unshift({ id: Date.now(), text, done: false, prio: prioSel.value });
  save(); render();
  taskInput.value = '';
  taskInput.focus();
}

// List events (toggle / delete)
listEl.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = +btn.dataset.id;

  if (btn.dataset.action === 'toggle') {
    const t = tasks.find(t => t.id === id);
    if (t) { t.done = !t.done; save(); render(); }
    const item = listEl.querySelector(`.task-item[data-id="${id}"]`);
    if (item) { item.classList.add('done-pulse'); setTimeout(()=>item.classList.remove('done-pulse'),400); }
  }

  if (btn.dataset.action === 'delete') {
    const item = listEl.querySelector(`.task-item[data-id="${id}"]`);
    if (item) {
      item.classList.add('removing');
      setTimeout(() => { tasks = tasks.filter(t => t.id !== id); save(); render(); }, 220);
    }
  }
});

// Keyboard on checkboxes
listEl.addEventListener('keydown', e => {
  if (e.key===' ' || e.key==='Enter') {
    const cb = e.target.closest('[data-action="toggle"]');
    if (cb) { e.preventDefault(); cb.click(); }
  }
});

// Filters
document.querySelectorAll('.filter-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    filter = b.dataset.filter;
    render();
  });
});

// Add button & Enter key
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key==='Enter') addTask(); });

// Clear completed
clearDoneBtn.addEventListener('click', () => {
  if (!tasks.some(t => t.done)) return;
  tasks = tasks.filter(t => !t.done);
  save(); render();
});

render();
