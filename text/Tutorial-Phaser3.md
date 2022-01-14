# Tutorials i Phaser 3 till TE20

## custom collision
Platformarna ska vara separerade från marken (tils som är fulstora) också ska det vara ett Object Layer med en rektangel över området av plattformen/plattformarna.

```javascript
// skapa en fysik-grupp
this.colison = this.add.group({
    allowGravity: false,
    immovable: true
}); 
// (måste vara en fysik-grupp anars så kan den inte läga till objekt och säta upp collision)

// byt 'Colison' till namnet med Objekt
map.getObjectLayer('Colison').objects.forEach((colisonGrop) => {
    // gjör en temporär variabel för att använda senare
    // skapar en phaser rectangel
    const curentObject = new Phaser.GameObjects.Rectangle(
        this, colisonGrop.x, colisonGrop.y, colisonGrop.width, colisonGrop.height
    ).setOrigin(0); 
    
    // läger till rektangeln till spelet
    // andra värdet är att säja att rektangeln är statisk (optimering)
    this.physics.add.existing(curentObject, true);
    
    // läger till rektangeln till fysik-grupp 
    this.colison.add(curentObject);
    // (så att spelaren eller anat kan kolidera)
});
```
(Fins en anan verson där man anvender en tom bild istäle)

---
## 