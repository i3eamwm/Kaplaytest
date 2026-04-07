import kaplay from "kaplay";

kaplay({
  background: [0, 0, 0], // สี fallback
});

setGravity(2000);

Promise.all([
  loadSprite("bg", "/bg.jpg"),
]).then(() => {
  go("game");
});

// SCENE GAME
scene("game", () => {

  // ปรับขนาดภาพพื้นหลังให้เต็มจอแบบ cover
  // ปรับขนาดภาพพื้นหลังให้เต็มจอแบบ cover
  const bgW = 1151;
  const bgH = 768;
  const sw = width() / bgW;
  const sh = height() / bgH;
  const s = Math.max(sw, sh); // ขยายจนเต็มจอ
  add([
    sprite("bg"),
    pos(0, 0),
    fixed(),
    scale(s),
  ])


  // พื้น 
  add([
    rect(3000, 48),
    pos(0, 500),
    area(),
    body({ isStatic: true }),
    color(0,200,0),
    "ground"
  ])

  const player = add([
    rect(40, 40),
    pos(100, 0),
    area(),
    body(),
    color(0, 0, 255),
    "player",
  ])

  // กล้องตามผู้เล่น
  onUpdate(() => {
    setCamPos(player.pos)
  })

  // ควบคุม 
  onKeyDown("left", () => player.move(-300,0))
  onKeyDown("right", () => player.move(300,0))

  onKeyPress("space", () => {
    if (player.isGrounded()) player.jump(750)
  })

  // ระบบเลือด
  let HP = 3
  const hpLabel = add([
    text("HP: " + HP),
    pos(20,20),
    color(255,0,0),
    fixed(),
  ])

  // ฟังก์ชันสร้างศัตรู 
  function spawnEnemy(x) {

    const enemy = add([
      rect(60,60),
      pos(x,0),
      area(),
      body(),
      color(255,0,0),
      "enemy",
      { dir: -1 }
    ])

    const head = add([
      rect(50,20),
      pos(x + 5, -20),
      area(),
      color(255,255,0),
      "enemyHead",
    ])

    head.onUpdate(() => {
      head.pos.x = enemy.pos.x + 5
      head.pos.y = enemy.pos.y - 20
    })

    enemy.onUpdate(() => {
      enemy.move(120 * enemy.dir, 0)
      if (enemy.pos.x < 0 || enemy.pos.x > 2800) enemy.dir *= -1
    })
  }

  spawnEnemy(600)
  spawnEnemy(1200)
  spawnEnemy(1800)
  spawnEnemy(2400)
  spawnEnemy(2800)

  // เหยียบหัวศัตรู
  player.onCollide("enemyHead", (head) => {
    if (player.pos.y < head.pos.y) {
      const enemy = get("enemy").find(e =>
        Math.abs(e.pos.x - head.pos.x) < 50
      )
      if (enemy) destroy(enemy)
      destroy(head)
      player.jump(1400)
    }
  })

  // ชนตัว → ลดเลือด
  player.onCollide("enemy", (enemy) => {
    if (player.pos.y < enemy.pos.y - 30) return

    HP--
    hpLabel.text = "HP: " + HP
    player.jump(500)

    if (HP <= 0) go("lose")
  })

})

scene("lose", () => {

  add([
    text("GAME OVER"),
    pos(width()/2, height()/2 - 40),
    anchor("center"),
    scale(2),
  ])

  add([
    text("Press R to restart"),
    pos(width()/2, height()/2 + 40),
    anchor("center"),
  ])

  onKeyPress("r", () => go("game"))
})
