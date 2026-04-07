import kaplay from "kaplay";

kaplay({
  width: 1940,
  height: 530,
  background: [0, 0, 0],
});

setGravity(3000)
 
const player = add([
  rect(40, 40), //รูปร่างตัวละคร
  pos(80, 0), // ตำแหน่งเกิด 
  area(), //ให้ตัวละครมีพื้นที่ในการชน
  body(), // มี gravity
  color(0, 150, 255), //สีตัวละคร
])

add([
  rect(2000, 48),
  pos(0, 450),
  area(),
  body({ isStatic: true }),
  color(100, 200, 100),
])

onKeyDown("left", () => {
  player.move(-200, 0)
})

onKeyDown("right", () => {
  player.move(200, 0)
})

onKeyPress("space", () => {
  if (player.isGrounded()) {
    player.jump(1000)
  }
})

onUpdate(() => {
    camPos(player.pos.x + 500, player.pos.y)
})
