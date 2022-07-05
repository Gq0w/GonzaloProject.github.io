// First code and initialize my canvas
// Make the player and background
// Make the player move
// Make my lasers
// Make my first invader

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d') 


canvas.width = innerWidth
canvas.height = innerHeight

// Name my player class
class Cadet {
    constructor() {
     
      // Give the cadet a velocity
      this.velocity = {
        x:0
      }
     
      // calls the image from the files and when it loads properly actually apply the size settings i want
      const image = new Image()
      image.src = 'spaceship.png'
      image.onload = () => {
        const scale = 0.15
        this.image = image
        this.height = image.height * scale
        this.width = image.width * scale
        this.position =  {
          x: canvas.width / 2 - this.width / 2,
          y: canvas.height - this.height - 20
        }
      }
    }

    
    
// draws the images position, width, height, and the image itself
    draw(){
          context.drawImage(
          this.image, 
          this.position.x, 
          this.position.y, 
          this.width, 
          this.height)
    }

    // when the site updates it will also update the velocity by adding to it

    update() {
      if(this.image) {
      this.draw()
      this.position.x += this.velocity.x
      }
    }
}




// projectile outline, uses the canvas fillstyle to make the projectile

class Projectile {
  constructor({ position, velocity }){
    this.position = position
    this.velocity = velocity
    this.radius = 3
  }
// my projectile
  draw() {
    context.beginPath()
    context.arc(this.position.x, this.position.y, 
      this.radius, 0, Math.PI * 2)
    context.fillStyle = 'white'
    context.fill()
    context.closePath()
  }

  update(){
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}


// invader class

class Invader {
  constructor({position}) {
   
    // Give the invader a velocity
    this.velocity = {
      x:0,
      y:0
    }
   
    // calls the image from the files and when it loads properly actually apply the size settings i want
    const image = new Image()
    //image.src = 'invader.png'
    image.src = 'invader.png'
    image.onload = () => {
      const scale = 0.35
      this.image = image
      this.height = image.height * scale
      this.width = image.width * scale
      this.position =  {
        x: position.x,
        y: position.y
      }
    }
  }

// draws the images position, width, height, and the image itself
  draw(){
        context.drawImage(
        this.image, 
        this.position.x, 
        this.position.y, 
        this.width, 
        this.height)
  }

  // when the site updates it will also update the velocity by adding to it

  update({velocity}) {
    if(this.image) {
    this.draw()
    this.position.x += velocity.x
    this.position.y += velocity.y
    }
  }
}


// this is our grid class for the actual invaders


class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }

    this.velocity = {
      x: 3,
      y: 0
    }

    this.invaders = []

// using a forloop allows us to make not only the rows and columns but also a random amount of rows without having to manually make the array

    const columns = Math.floor(Math.random() * 10 + 5)
    const rows = Math.floor(Math.random() * 5 + 2)
    
    this.width = columns * 100

    for (let x = 0; x < columns; x++){
      for (let y = 0; y < rows; y++){
      this.invaders.push(new Invader({
        position: {
          x: x * 100,
          y: y * 50
        } 
      }))
    }
 }

  }
  update(){
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.velocity.y = 0

// we use this if statement to prevent the invaders from going off screen, by using the canvas and the invaders width to reverse the velocity
    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 100
    }

  }
}






// my const for my player keys projectiles and invader grids

const player = new Cadet()
const projectiles = []
const grids = [new Grid()]
const keys = {
  a:{
    pressed: false
  },
  d:{
    pressed: false
  },
  space:{
    pressed: false
  }
}


// this animation not only allows me to begin animating my ship but also control my movement velocity and projectiles
// i also use this function to fill in my screen with black



let frames = 0
let randomInverval = Math.floor(Math.random() * 500) + 500
console.log(randomInverval)

function animate() {
  requestAnimationFrame(animate)
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  projectiles.forEach(projectiles => {
    projectiles.update()
  })

  grids.forEach(grid =>{
    grid.update()
    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity })

       projectiles.forEach((projectile,j) => {
        if (
          // Projectile Math in order to make the hit protection
          projectile.position.y - projectile.radius <= 
          invader.position.y + invader.height && 
          projectile.position.x + projectile.radius >= 
          invader.position.x && 
          projectile.position.x - projectile.radius <= 
          invader.position.x + invader.width && 
          projectile.position.y + projectile.radius >= 
          invader.position.y

           ) {
            // Collision function, if the invader is "found" then splice 1 invader and projectile
          setTimeout(() => {
            const invaderFound = grid.invaders.find(invader2 => {
              return invader2 === invader
            })
            const projectileFound = projectiles.find(
              projectile2 => projectile2 === projectile
            )
            if (invaderFound && projectileFound){
            grid.invaders.splice(i, 1)
            projectiles.splice(j, 1)
            }
          }, 0)
        }
       })
    })
  })

  if (keys.a.pressed && player.position.x >= 0){
    player.velocity.x = -5
    // stoped the player from going off screen with the && statements
  } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 5
  }
  else {
    player.velocity.x = 0
  }
  // random enemies at random times
  if (frames % randomInverval === 0) {
    grids.push(new Grid())
    frames = 0 
    randomInverval = Math.floor(Math.random() * 500) + 500
  }

  frames++

}
animate()


// select which keys i want to use inorder to move around and shoot
// using keys.pressed i can select which is true when its pressed and which is false 
addEventListener('keydown', ({ key }) => {
    switch (key) {
      case 'a': 
      
      keys.a.pressed = true
      
        break
      case 'd': 
      keys.d.pressed = true
        break
      case ' ': 
      projectiles.push(new Projectile({
        position: {
          x: player.position.x + player.width / 2, 
          y: player.position.y
        },
        velocity: {
          x: 0,
          y: -7
        }
      }))
        break
    }

})

// the opposite of keydown

addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'a': 
    
    keys.a.pressed = false
      break
    case 'd': 
    keys.d.pressed = false
      break
    case ' ': 
      break
  }

})