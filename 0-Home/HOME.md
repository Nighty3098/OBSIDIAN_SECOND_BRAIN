---
cssclasses:
  - launchpad
tags:
  - home
custom-width: 80
id: HOME
aliases: []
---


![[zerotwo.png]]

`````col

````col-md

```dataviewjs
const habitNames = ['Сделать зарядку','Завтрак','Учеба','Обед','Сделать ДЗ','Прогулка','Работа','Спать'];

if (!globalThis._fmtDate) {
  globalThis._fmtDate = function(d) {
    return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
  };
}
const fmtDate = globalThis._fmtDate;

async function render() {
  if (!dv || !dv.container) return;
  const T = dv.container;
  const today = new Date();
  const habitPath = `1-Daily/HABITS/${fmtDate(today)}.md`;
  const habitFile = app.vault.getAbstractFileByPath(habitPath);

  let html = '<div class="widget" style="flex-direction:column;align-items:stretch;justify-content:flex-start;align-content:flex-start;height:400px;box-sizing:border-box;"><h1 style="font-size:medium;padding:0;margin:0;text-align:center;">HABITS TODAY</h1>';

  if (habitFile) {
    const content = await app.vault.read(habitFile);
    const fm = content.split('---')[1] || '';
    habitNames.forEach(h => {
      const val = fm.includes(`\n${h}: true`);
      html += `<div style="display:flex;align-items:center;gap:10px;padding:6px 10px;background:var(--code-background);border-radius:var(--bases-cards-radius);font-size:small;">
        <input type="checkbox" ${val ? 'checked' : ''} style="width:16px;height:16px;accent-color:var(--text-accent);cursor:pointer;flex-shrink:0;" data-habit="${h}">
        <span style="${val ? 'opacity:0.9;' : 'opacity:0.5;'}">${h}</span>
      </div>`;
    });
  } else {
    const templateFile = app.vault.getAbstractFileByPath('3-Resources/Templates/Habits.md');
    if (templateFile) {
      const tpl = await app.vault.read(templateFile);
      await app.vault.create(habitPath, tpl);
    }
    habitNames.forEach(h => {
      html += `<div style="display:flex;align-items:center;gap:10px;padding:6px 10px;background:var(--code-background);border-radius:var(--bases-cards-radius);font-size:small;opacity:0.5;">
        <input type="checkbox" style="width:16px;height:16px;accent-color:var(--text-accent);cursor:pointer;flex-shrink:0;" data-habit="${h}">
        <span>${h}</span>
      </div>`;
    });
  }
  html += '</div>';
  T.style.margin = '0 0 8px 0';
  T.style.padding = '0';
  T.innerHTML = html;

  T.querySelectorAll('input[data-habit]').forEach(cb => {
    cb.addEventListener('click', async e => {
      const habit = cb.dataset.habit;
      const file = app.vault.getAbstractFileByPath(habitPath);
      if (!file) return;
      const content = await app.vault.read(file);
      const lines = content.split('\n');
      const lineIdx = lines.findIndex(l => l.startsWith(habit + ':'));
      if (lineIdx >= 0) {
        lines[lineIdx] = `${habit}: ${cb.checked}`;
        await app.vault.modify(file, lines.join('\n'));
      }
    });
  });
}
await render();
setInterval(() => render(), 20000);
```

<div class="nav-sidebar">
  <a class="nav-item" href="obsidian://open?vault=MY_NOTES&file=0-Home/Daily">Daily</a>
  <a class="nav-item" href="obsidian://open?vault=MY_NOTES&file=0-Home/TASKS">Tasks</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3Aproject">Projects</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3AMath">Math</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3ACS">CS</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3ATelecom">Telecom</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3ATOEC">TOEC</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3APhysic">Physic</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3ACPP">CPP</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3Apython">Python</a>
</div>

````




````col-md

```dataviewjs
const fmtDate = globalThis._fmtDate || function(d) {
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
};
if (!globalThis._fmtDate) globalThis._fmtDate = fmtDate;
function fmtShort(d) {
  return d.toLocaleDateString('ru-RU', { day:'numeric', month:'short' });
}

async function render() {
  if (!dv || !dv.container) return;
  const T = dv.container;
  const today = new Date();
  let html = '';

  // ── Calendar ──
  {
    const dow = today.getDay();
    const monOff = dow === 0 ? -6 : 1 - dow;
    const start = new Date(today);
    start.setDate(today.getDate() + monOff);
    const names = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    let cal = '<div class="mini-calendar">';
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const ds = d.toISOString().slice(0, 10);
      const has = dv.pages('#DailyNote').where(p => p.file.path.includes(ds)).length > 0;
      const isToday = d.toDateString() === today.toDateString();
      let cls = 'cal-day';
      if (isToday) cls += ' today';
      else if (has) cls += ' has-note';
      cal += `<div class="${cls}"><div class="cal-label">${names[i]}</div><div class="cal-num">${d.getDate()}</div></div>`;
    }
    cal += '</div>';
    html += cal;
  }

  // ── Daily Streak ──
  {
    let streak = 0;
    const d = new Date(today);
    while (true) {
      const ds = fmtDate(d);
      if (dv.pages('#DailyNote').where(p => p.file.path.includes(ds)).length === 0) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }
    html += `<div class="widget"><h1 style="font-size:medium;padding:0;margin:0;">DAILY STREAK</h1><h1 style="font-size:small;padding:0;margin:0;">${streak}d</h1></div>`;
  }

  // ── Random Note ──
  {
    const allNotes = dv.pages()
      .where(p => !p.file.path.startsWith('.obsidian') && !p.file.path.startsWith('.makemd') && !p.file.path.startsWith('.space'))
      .where(p => p.file.name !== 'README');
    const idx = Math.floor(Math.random() * allNotes.length);
    const randomNote = allNotes[idx] || null;
    html += `<div class="widget" style="cursor:pointer;" onclick="${randomNote ? `app.workspace.openLinkText('${randomNote.file.path.replace(/'/g, "\\'")}','',false)` : ''}">
      <h1 style="font-size:medium;padding:0;margin:0;">RANDOM NOTE</h1>
      <span style="font-size:small;opacity:0.7;margin-top:4px;">${randomNote ? randomNote.file.name : 'No notes found'}</span>
    </div>`;
  }

  // ── Stat widgets ──
  const dailyCount = dv.pages('#DailyNote').length;
  let income = 0;
  dv.pages('#Freelance AND !#Extras')
    .where(p => p.file.folder !== "Templates")
    .forEach(p => { income += p.price || 0; });
  const booksCount = dv.pages().filter(p => p.file.path.startsWith("3-Resources/Books/")).length;
  html += `<div class="widget"><h1 style="font-size:medium;padding:0;margin:0;">STATS</h1><div style="display:flex;flex-direction:column;gap:8px;width:100%;margin-top:4px;"><div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:var(--code-background);border-radius:var(--bases-cards-radius);font-size:small;"><span>DAILY NOTES</span><span>${dailyCount}</span></div><div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:var(--code-background);border-radius:var(--bases-cards-radius);font-size:small;"><span>TOTAL INCOME</span><span>${income}р</span></div><div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:var(--code-background);border-radius:var(--bases-cards-radius);font-size:small;"><span>BOOKS</span><span>${booksCount}</span></div></div></div>`;


  // ── Freelance Open ──
  {
    const projects = dv.pages('#Freelance')
      .where(p => p.completed === false)
      .where(p => !p.file.path.startsWith('3-Resources/Templates'))
      .sort(p => p.deadline, 'asc');

    html += `<div class="widget"><h1 style="font-size:medium;padding:0;margin:0;text-align:center;">FREELANCE OPEN</h1>`;
    if (projects.length === 0) {
      html += '<div style="font-size:small;opacity:0.5;margin-top:12px;">No open projects</div>';
    } else {
      html += '<div style="display:flex;flex-direction:column;gap:8px;width:100%;margin-top:12px;">';
      projects.forEach(p => {
        const dl = p.deadline ? fmtShort(new Date(p.deadline)) : '';
        html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:var(--code-background);border-radius:var(--bases-cards-radius);font-size:small;cursor:pointer;" onclick="app.workspace.openLinkText('${p.file.path}','',false)">
          <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.file.name}</span>
          <span style="flex-shrink:0;">${dl}</span>
        </div>`;
      });
      html += '</div>';
    }
    html += '</div>';
  }

  // ── Weekly Stats ──
  {
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const created = dv.pages()
      .where(p => !p.file.path.startsWith('.obsidian') && !p.file.path.startsWith('.makemd') && !p.file.path.startsWith('.space'))
      .where(p => p.file.ctime && p.file.ctime.ts > weekAgo.getTime()).length;
    const modified = dv.pages()
      .where(p => !p.file.path.startsWith('.obsidian') && !p.file.path.startsWith('.makemd') && !p.file.path.startsWith('.space'))
      .where(p => p.file.mtime && p.file.mtime.ts > weekAgo.getTime()).length;
    const tasksAdded = dv.pages()
      .where(p => !p.file.path.startsWith('.obsidian') && !p.file.path.startsWith('3-Resources/Templates'))
      .file.tasks.length;
    html += `<div class="widget"><h1 style="font-size:medium;padding:0;margin:0;">WEEKLY STATS</h1><div style="display:flex;gap:16px;margin-top:4px;font-size:small;"><span>+${created} new</span><span>${modified} edited</span><span>${tasksAdded} tasks</span></div></div>`;
  }

  // ── Tag Cloud ──
  {
    const tagCounts = {};
    dv.pages()
      .where(p => !p.file.path.startsWith('.obsidian') && !p.file.path.startsWith('.makemd') && !p.file.path.startsWith('.space'))
      .forEach(p => {
        (p.file.tags || []).forEach(t => {
          const key = t.startsWith('#') ? t.slice(1) : t;
          tagCounts[key] = (tagCounts[key] || 0) + 1;
        });
      });
    const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);
    html += '<div class="widget" style="padding:12px;"><h1 style="font-size:medium;padding:0;margin:0;text-align:center;">TAG CLOUD</h1><div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:8px;">';
    sorted.forEach(([tag, count]) => {
      html += `<a href="obsidian://search?vault=MY_NOTES&query=tag%3A${encodeURIComponent(tag)}" style="background:var(--code-background);padding:4px 10px;border-radius:var(--bases-cards-radius);font-size:small;text-decoration:none;color:var(--text-normal);">#${tag} (${count})</a>`;
    });
    html += '</div></div>';
  }

  // ── Render ──
  T.innerHTML = '<div style="display:flex;flex-direction:column;gap:8px;">' + html + '</div>';
}

await render();
setInterval(() => render(), 20000);
```

````


````col-md

```dataviewjs
function renderTasks() {
  const T = dv.container;
  const allTasks = dv.pages()
    .where(p => !p.file.path.startsWith('.obsidian'))
    .where(p => !p.file.path.startsWith('3-Resources/Templates'))
    .file.tasks
    .where(t => !t.completed)
    .sort(t => t.text, 'asc')
    .slice(0, 8);

  let html = '<div class="widget" style="flex-direction:column;align-items:stretch;justify-content:flex-start;align-content:flex-start;height:400px;box-sizing:border-box;"><h1 style="font-size:medium;padding:0;margin:0;text-align:center;">TASKS</h1>';
  if (allTasks.length === 0) {
    html += '<div style="font-size:small;opacity:0.5;">All done</div>';
  } else {
    allTasks.forEach(t => {
      const src = t.path.split('/').pop().replace('.md', '');
      html += `<div class="task-row" style="display:flex;align-items:center;gap:10px;padding:6px 10px;background:var(--code-background);border-radius:var(--bases-cards-radius);font-size:small;">
        <input type="checkbox" style="width:16px;height:16px;accent-color:var(--text-accent);cursor:pointer;flex-shrink:0;" data-path="${t.path}" data-line="${t.line}">
        <span style="flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;" onclick="app.workspace.openLinkText('${t.path}','',false)">${t.text}</span>
        <span style="font-size:10px;opacity:0.4;flex-shrink:0;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${src}</span>
      </div>`;
    });
  }
  html += '</div>';
  T.style.margin = '0 0 8px 0';
  T.style.padding = '0';
  T.innerHTML = html;

  T.querySelectorAll('.task-row input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('click', async e => {
      e.stopPropagation();
      const path = cb.dataset.path;
      const line = parseInt(cb.dataset.line);
      const file = app.vault.getAbstractFileByPath(path);
      if (!file) return;
      const content = await app.vault.read(file);
      const lines = content.split('\n');
      const idx = line - 1;
      if (idx >= 0 && idx < lines.length) {
        lines[idx] = lines[idx].replace('- [ ]', '- [x]');
        await app.vault.modify(file, lines.join('\n'));
      }
    });
  });
}
renderTasks();
setInterval(() => renderTasks(), 20000);
```

```dataviewjs
function render() {
  const recent = dv.pages()
    .where(p => !p.file.path.startsWith('.obsidian'))
    .where(p => !p.file.path.startsWith('.makemd'))
    .where(p => !p.file.path.startsWith('.space'))
    .where(p => p.file.name !== 'README')
    .sort(p => p.file.mtime, 'desc')
    .slice(0, 10);

  const T = dv.container;
  T.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'recent-notes';
  T.appendChild(container);

  const list = document.createElement('ul');
  container.appendChild(list);

  recent.forEach(p => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = p.file.name;
    link.className = 'internal-link';
    link.setAttribute('data-href', p.file.path);
    link.setAttribute('href', `obsidian://open?vault=MY_NOTES&file=${encodeURIComponent(p.file.path)}`);
    link.addEventListener('click', (e) => {
      e.preventDefault();
      app.workspace.openLinkText(p.file.path, '', false);
    });
    li.appendChild(link);
    const dateSpan = document.createElement('span');
    dateSpan.className = 'recent-date';
    dateSpan.textContent = new Date(p.file.mtime).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    li.appendChild(dateSpan);
    list.appendChild(li);
  });
}
render();
setInterval(() => render(), 20000);
```

````

`````

<div style="height: 2vh"></div>



## `BOOKS`

![[Books-Minimal.base]]

## `PROJECTS`

![[Projects.base]]

