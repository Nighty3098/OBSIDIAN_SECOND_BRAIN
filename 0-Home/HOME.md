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

<div class="nav-sidebar">
  <a class="nav-item" href="obsidian://open?vault=MY_NOTES&file=0-Home/Daily">Daily</a>
  <a class="nav-item" href="obsidian://open?vault=MY_NOTES&file=0-Home/TASKS">Tasks</a>
  <a class="nav-item" href="obsidian://open?vault=MY_NOTES&file=0-Home/BOOKS">Books</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3AFREELANCE">Freelance</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3ACS">CS</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3Aproject">Projects</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3AAlgorithms">Algorithms</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3Apentest">pentesting</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3AMath">Math</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3ATelecom">Telecom</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3ATOEC">TOEC</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3APhysic">Physic</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3ACPP">CPP</a>
  <a class="nav-item" href="obsidian://search?vault=MY_NOTES&query=tag%3Apython">Python</a>
</div>

````


````col-md

```dataviewjs
const today = new Date();
const dayOfWeek = today.getDay();
const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() + mondayOffset);

const dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
let html = '<div class="mini-calendar">';

for (let i = 0; i < 7; i++) {
  const d = new Date(startOfWeek);
  d.setDate(startOfWeek.getDate() + i);
  const dateStr = d.toISOString().slice(0, 10);
  const hasNote = dv.pages('#DailyNote')
    .where(p => p.file.path.includes(dateStr)).length > 0;
  const isToday = d.toDateString() === today.toDateString();

  let cls = 'cal-day';
  if (isToday) cls += ' today';
  else if (hasNote) cls += ' has-note';

  html += `<div class="${cls}">
    <div class="cal-label">${dayNames[i]}</div>
    <div class="cal-num">${d.getDate()}</div>
  </div>`;
}
html += '</div>';
dv.el('div', html);
```


```dataviewjs
const clockDiv = this.container.createDiv({ cls: "analog-clock-widget" });
clockDiv.innerHTML = `
  <div style="position: relative; width: 100%; height: 210px; min-width: auto; min-height: 250px; border-radius: var(--bases-cards-radius); border: 10px solid var(--base02); background-color: var(--code-background); margin: auto; margin-top: 10px">
    <div id="hour-hand" style="position: absolute; width: 6px; height: 30px; background-color: var(--text-normal); border-radius: 50px; top: 50%; left: 50%; transform-origin: 50% 100%; transform: translateX(-50%) translateY(-100%);"></div>
    <div id="minute-hand" style="position: absolute; width: 4px; height: 60px; background-color:  var(--text-normal); top: 50%; left: 50%; border-radius: 50px; transform-origin: 50% 100%; transform: translateX(-50%) translateY(-100%);"></div>
    <div id="second-hand" style="position: absolute; width: 2px; height: 80px; background-color:  var(--text-error); top: 50%; left: 50%; border-radius: 50px; transform-origin: 50% 100%; transform: translateX(-50%) translateY(100%);"></div>
  </div>
`;

function updateAnalogClock() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const hourRotation = (hours * 30) + (minutes / 2);
  const minuteRotation = minutes * 6;
  const secondRotation = seconds * 6;
  const hourHand = clockDiv.querySelector("#hour-hand");
  const minuteHand = clockDiv.querySelector("#minute-hand");
  const secondHand = clockDiv.querySelector("#second-hand");
  if (hourHand && minuteHand && secondHand) {
    hourHand.style.transform = `translateX(-50%) translateY(-100%) rotate(${hourRotation}deg)`;
    minuteHand.style.transform = `translateX(-50%) translateY(-100%) rotate(${minuteRotation}deg)`;
    secondHand.style.transform = `translateX(-50%) translateY(-100%) rotate(${secondRotation}deg)`;
  }
  requestAnimationFrame(updateAnalogClock);
}

updateAnalogClock();
```


```dataviewjs
const count = dv.pages('#DailyNote').length;
const div = document.createElement('div');
div.className = "widget";
div.innerHTML = `
  <h1 style="font-size: medium; padding: 0px; margin: 0px;">DAILY NOTES</h1>
  <h1 style="font-size: medium; padding: 0px; margin: 0px;">${count}</h1>
`;
dv.container.appendChild(div);
```


```dataviewjs
const freelanceProjects = dv.pages('#Freelance AND !#Extras')
    .where(p => p.file.folder !== "Templates")
    .sort(p => p.file.ctime, 'desc');

let price = 0;
freelanceProjects.forEach(p => {
  price = price + (p.price || 0);
});

const div = document.createElement('div');
div.className = "widget";
div.innerHTML = `
  <h1 style="font-size: medium; padding: 0px; margin: 0px;">TOTAL INCOME</h1>
  <h1 style="font-size: medium; padding: 0px; margin: 0px;">${price}р</h1>
`;
dv.container.appendChild(div);
```


```dataviewjs
const folderPath = "3-Resources/Books";
const allFiles = dv.pages();
const fileCount = allFiles.filter(p => p.file.path.startsWith(folderPath + "/")).length;

const div = document.createElement('div');
div.className = "widget";
div.innerHTML = `
  <h1 style="font-size: medium; padding: 0px; margin: 0px;">BOOKS</h1>
  <h1 style="font-size: medium; padding: 0px; margin: 0px;">${fileCount}</h1>
`;
dv.container.appendChild(div);
```


```dataviewjs
const folderPath = "7-Inbox";
const allFiles = dv.pages();
const fileCount = allFiles.filter(p => p.file.path.startsWith(folderPath + "/")).length;

const div = document.createElement('div');
div.className = "widget";
div.innerHTML = `
  <h1 style="font-size: medium; padding: 0px; margin: 0px;">INBOX</h1>
  <h1 style="font-size: medium; padding: 0px; margin: 0px;">${fileCount}</h1>
`;
dv.container.appendChild(div);
```

````


````col-md

```dataviewjs
const recent = dv.pages()
  .where(p => !p.file.path.startsWith('.obsidian'))
  .where(p => !p.file.path.startsWith('.makemd'))
  .where(p => !p.file.path.startsWith('.space'))
  .where(p => p.file.name !== 'README')
  .sort(p => p.file.mtime, 'desc')
  .slice(0, 14);

const container = document.createElement('div');
container.className = 'recent-notes';
dv.container.appendChild(container);

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
```
````

`````

<div style="height: 2vh"></div>



## `BOOKS`

![[Books-Minimal.base]]

## `PROJECTS`

![[Projects.base]]
