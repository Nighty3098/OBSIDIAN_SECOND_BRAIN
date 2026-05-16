---
cssclasses:
  - launchpad
banner: imgs/040.png
sticker: lucide//check-circle
banner-height: 350
content-start: 306
---
# TASKS

`````col-md
flexGrow=1
textAlign=center
alignItems=center
alignContent=center
===

```dataview
TASK FROM "" WHERE !completed AND !contains(file.folder, "3-Resources/Templates")  GROUP BY section
```

`````
