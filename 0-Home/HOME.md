---
cssclasses:
  - launchpad
tags:
  - home
banner-height: 480
content-start: 276
banner-display: cover
banner: "![[waterfall_2.png]]"
---

<div style="height: 15vh"></div>

`````col

````col-md

```dataviewjs
const clockDiv = this.container.createDiv({ cls: "analog-clock-widget" });
clockDiv.innerHTML = `
  <div style="position: relative; width: 200px; height: 210px; min-width: auto; min-height: 210px; border-radius: 20px; border: 10px solid var(--background-secondary); background-color: var(--background-secondary); margin: auto;">
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
const dailyC = dv.pages('#DailyNote')

let count = 0;

dailyC.forEach(p => {
    count++;
});

const div = document.createElement('div');
div.className = "widget";

const h1 = document.createElement('h1');
h1.textContent = `DAILY NOTES`;
const h2 = document.createElement('h1');
h2.textContent = `${count}`;
div.appendChild(h1);
div.appendChild(h2);

dv.container.appendChild(div);
```


````


````col-md

```dataviewjs
const freelanceProjects = dv.pages('#Freelance AND !#Extras')
    .where(p => p.file.folder !== "Templates")
    .sort(p => p.file.ctime, 'desc');

let price = 0

freelanceProjects.forEach(p => {
	price = price + p.price
});

const div = document.createElement('div');
div.className = "widget";
const h1 = document.createElement('h1');
h1.textContent = `TOTAL INCOME`;
const h2 = document.createElement('h1');
h2.textContent = `${price}р`;
div.appendChild(h1);
div.appendChild(h2);
dv.container.appendChild(div);
```


```dataviewjs
const folderPath = "3-Resources/Books";
async function countFilesInFolder() {
    const allFiles = dv.pages();
    const filesInFolder = allFiles.filter(p => p.file.path.startsWith(folderPath + "/"));
    return filesInFolder.length;
}
async function main() {
    const fileCount = await countFilesInFolder();
    const div = document.createElement('div');
    div.className = "widget";
    const h1 = document.createElement('h1');
    h1.textContent = `BOOKS`;
    const h2 = document.createElement('h1');
    h2.textContent = `${fileCount}`;
    div.appendChild(h1);
    div.appendChild(h2);
    dv.container.appendChild(div);
}
main();
```


```dataviewjs
const folderPath = "7-Inbox";
async function countFilesInFolder() {
    const allFiles = dv.pages();
    const filesInFolder = allFiles.filter(p => p.file.path.startsWith(folderPath + "/"));
    return filesInFolder.length;
}
async function main() {
    const fileCount = await countFilesInFolder();
    const div = document.createElement('div');
    div.className = "widget";
    const h1 = document.createElement('h1');
    h1.textContent = `INBOX`;
    const h2 = document.createElement('h1');
    h2.textContent = `${fileCount}`;
    div.appendChild(h1);
    div.appendChild(h2);
    dv.container.appendChild(div);
}
main();
```


````

`````

<br />

`````col
```col-md
#English
#Physic
#CS
#Telecom
#TOEC
````

````col-md
#book
#DailyNote
#project
#Freelance
#ideas
````

`````

<div style="height: 5vh"></div>

## `BOOKS`

![[Books-Minimal.base]]

## `PROJECTS`

![[Projects.base]]

