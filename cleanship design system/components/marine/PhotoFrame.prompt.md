One-line: every photo in the system goes through this — it owns the aspect ratio and the navy scrim (never black).

```jsx
<PhotoFrame slotId="hero" ratio="16 / 9" scrim="left"><h1 style={{position:"absolute",bottom:32,left:32,color:"#fff"}}>Hold Cleaning</h1></PhotoFrame>
```

Load `assets/image-slot.js` on the page so empty frames are droppable. Scrims: bottom (captions), left (hero copy), flat (dense grids).
