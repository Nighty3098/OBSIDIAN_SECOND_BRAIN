---
cssclasses:
  - launchpad
---
# TASKS

`````col-md
flexGrow=1
textAlign=center
alignItems=center
alignContent=center
===

```dataview
TASK FROM "" WHERE !completed AND !contains(file.folder, "3-Resources/Templates") AND !contains(file.folder, "2-Projects") GROUP BY section
```

`````
