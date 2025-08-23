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
  <div style="position: relative; width: auto; height: 210px; min-width: auto; min-height: 210px; border-radius: 20px; border: 10px solid var(--background-secondary); background-color: var(--background-secondary); margin: auto;">
    <div id="hour-hand" style="position: absolute; width: 6px; height: 50px; background-color: var(--text-normal); border-radius: 50px; top: 50%; left: 50%; transform-origin: 50% 100%; transform: translateX(-50%) translateY(-100%);"></div>
    <div id="minute-hand" style="position: absolute; width: 4px; height: 70px; background-color:  var(--text-normal); top: 50%; left: 50%; border-radius: 50px; transform-origin: 50% 100%; transform: translateX(-50%) translateY(-100%);"></div>
    <div id="second-hand" style="position: absolute; width: 2px; height: 90px; background-color:  var(--text-error); top: 50%; left: 50%; border-radius: 50px; transform-origin: 50% 100%; transform: translateX(-50%) translateY(100%);"></div>
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
````


````col-md

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


```dataviewjs

const lifespan = { year: 75 };
const birthday = DateTime.fromObject({
    year: 2007,
    month: 2,
    day: 16
});

function progress(type) {
    const today = DateTime.now();
    let value;

    switch (type) {
        case "lifespan":
            value = (today.year - birthday.year) / lifespan.year * 100;
            break;
        case "year":
            value = today.month / 12 * 100;
            break;
        case "month":
            value = today.day / today.daysInMonth * 100;
            break;
        case "day":
            value = today.hour / 24 * 100;
            break;
    }
    return value;
}

async function main() {
    const div = document.createElement('div');
    div.className = "widget";
    div.style.height = "425px";
    div.style.padding = "16px";
    div.style.borderRadius = "20px";

    const yearProgress = progress("year");
    const monthProgress = progress("month");
    const dayProgress = progress("day");
    const lifespanProgress = progress("lifespan");

    div.innerHTML += `
        <div style="margin-bottom: 5px;">
            <p style="font-size: medium; line-height: 2rem; margin: 0px; padding: 0px;">Year</p>
            <progress value="${parseInt(yearProgress)}" max="100" style="height: 20px;"></progress> ${parseInt(yearProgress)}%
        </div>
        <div style="margin-bottom: 5px;">
            <p style="font-size: medium; line-height: 2rem; margin: 0px; padding: 0px;">Month</p>
            <progress value="${parseInt(monthProgress)}" max="100" style="height: 20px;"></progress> ${parseInt(monthProgress)}%
        </div>
        <div style="margin-bottom: 5px;">
            <p style="font-size: medium; line-height: 2rem; margin: 0px; padding: 0px;">Life</p>
            <progress value="${parseInt(lifespanProgress)}" max="100" style="height: 20px;"></progress> ${parseInt(lifespanProgress)}%
        </div>
    `;

    dv.container.appendChild(div);
}

main();


```

````

`````

<div style="height: 15vh"></div>

## `CATEGORIES`

`````col
flexGrow=1
textAlign=center
alignItems=center
alignContent=center
===

````col-md

#Russian 
#Math 
#Biology 
#Trigonometry 
#SocialStudies
#ComputerScience 

````

````col-md

#Algorithms 
#DailyNote 
#book 
#ideas 
#Freelance 
#project 

````


`````

## `BOOKS`

![[Books-Minimal.base]]


## `PROJECTS`

![[Projects.base]]
