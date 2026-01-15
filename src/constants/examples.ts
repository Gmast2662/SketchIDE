// Built-in example projects for learning
export const EXAMPLES = [
  {
    id: 'hello-world',
    name: 'Hello World',
    category: 'Basics',
    code: `// Your first program!
// This displays a simple message

function setup() {
  print("Hello, World!")
  print("Welcome to coding!")
}`,
  },
  {
    id: 'drawing-basics',
    name: 'Drawing Shapes',
    category: 'Basics',
    code: `// Learn to draw basic shapes

function setup() {
  background(240, 240, 240)
  
  // Draw a red circle
  fill(255, 0, 0)
  ellipse(100, 100, 50, 50)
  
  // Draw a blue rectangle
  fill(0, 0, 255)
  rect(200, 80, 60, 40)
  
  // Draw a green line
  stroke(0, 255, 0)
  line(50, 200, 250, 200)
}`,
  },
  {
    id: 'variables',
    name: 'Using Variables',
    category: 'Basics',
    code: `// Store and use values with variables

function setup() {
  var x = 100
  var y = 100
  var size = 60
  
  background(255, 255, 255)
  fill(255, 100, 0)
  ellipse(x, y, size, size)
  
  print("Circle at position: " + x + ", " + y)
  print("Size: " + size)
}`,
  },
  {
    id: 'animation',
    name: 'Simple Animation',
    category: 'Animation',
    code: `// Create moving shapes with loop()

var x = 0

function setup() {
  background(30, 30, 40)
}

function loop() {
  // Clear with transparent background
  background(30, 30, 40, 0.1)
  
  // Draw moving circle
  fill(100, 200, 255)
  ellipse(x, 150, 30, 30)
  
  // Update position
  x = x + 2
  
  // Wrap around
  if (x > 400) {
    x = 0
  }
}`,
  },
  {
    id: 'color-gradient',
    name: 'Color Gradient',
    category: 'Graphics',
    code: `// Create a beautiful gradient effect

function setup() {
  var i = 0
  
  while (i < 400) {
    // Calculate color based on position
    var red = i * 0.6
    var blue = 255 - (i * 0.6)
    
    stroke(red, 100, blue)
    line(i, 0, i, 300)
    
    i = i + 1
  }
}`,
  },
  {
    id: 'patterns',
    name: 'Grid Pattern',
    category: 'Graphics',
    code: `// Draw a grid of circles

function setup() {
  background(255, 255, 255)
  
  var x = 30
  
  while (x < 400) {
    var y = 30
    
    while (y < 300) {
      // Alternate colors
      if ((x + y) % 60 == 0) {
        fill(255, 100, 150)
      } else {
        fill(100, 150, 255)
      }
      
      ellipse(x, y, 20, 20)
      y = y + 30
    }
    
    x = x + 30
  }
}`,
  },
  {
    id: 'random-art',
    name: 'Random Art',
    category: 'Creative',
    code: `// Create random generative art

function setup() {
  background(20, 20, 30)
  
  var i = 0
  
  while (i < 50) {
    var x = random(0, 400)
    var y = random(0, 300)
    var size = random(10, 60)
    var r = random(100, 255)
    var g = random(100, 255)
    var b = random(100, 255)
    
    fill(r, g, b, 0.5)
    ellipse(x, y, size, size)
    
    i = i + 1
  }
  
  print("Generative art created!")
}`,
  },
  {
    id: 'bouncing-ball',
    name: 'Bouncing Ball',
    category: 'Animation',
    code: `// Physics simulation of a bouncing ball

var x = 200
var y = 50
var speedX = 3
var speedY = 2

function setup() {
  background(255, 255, 255)
}

function loop() {
  background(255, 255, 255)
  
  // Draw ball
  fill(255, 100, 100)
  ellipse(x, y, 30, 30)
  
  // Update position
  x = x + speedX
  y = y + speedY
  
  // Bounce off edges
  if (x > 385 or x < 15) {
    speedX = speedX * -1
  }
  
  if (y > 285 or y < 15) {
    speedY = speedY * -1
  }
}`,
  },
  {
    id: 'interactive',
    name: 'User Input',
    category: 'Basics',
    code: `// Get input from the user

function setup() {
  background(200, 220, 255)
  
  var name = input("What is your name?")
  
  fill(50, 50, 50)
  text("Hello, " + name + "!", 100, 150, 24)
  
  var age = input("How old are you?")
  
  text("You are " + age + " years old", 100, 200, 18)
  
  print("User: " + name + ", Age: " + age)
}`,
  },
  {
    id: 'arrays-basics',
    name: 'Working with Lists',
    category: 'Basics',
    code: `// Create and use lists (arrays)

function setup() {
  background(255, 255, 255)
  
  // Create a list of numbers
  var numbers = [10, 20, 30, 40, 50]
  
  // Or create an empty list and add items
  var colors = []
  append(colors, 255)
  append(colors, 100)
  append(colors, 50)
  
  // Print list information
  print("Numbers list has " + getLength(numbers) + " items")
  print("First number: " + getItem(numbers, 0))
  print("Last number: " + getItem(numbers, getLength(numbers) - 1))
  
  // Draw circles using list values
  var i = 0
  while (i < getLength(numbers)) {
    fill(colors[0], colors[1], colors[2])
    ellipse(100 + i * 60, 150, numbers[i], numbers[i])
    i = i + 1
  }
}`,
  },
  {
    id: 'arrays-animation',
    name: 'Multiple Bouncing Balls',
    category: 'Animation',
    code: `// Use lists to manage multiple objects

var ballX = []
var ballY = []
var speedX = []
var speedY = []

function setup() {
  background(255, 255, 255)
  
  // Create 5 balls
  var i = 0
  while (i < 5) {
    append(ballX, random(50, 350))
    append(ballY, random(50, 250))
    append(speedX, random(-3, 3))
    append(speedY, random(-3, 3))
    i = i + 1
  }
}

function loop() {
  background(255, 255, 255)
  
  // Update and draw all balls
  var i = 0
  while (i < getLength(ballX)) {
    // Draw ball
    fill(100 + i * 30, 150, 255)
    ellipse(ballX[i], ballY[i], 20, 20)
    
    // Update position
    setItem(ballX, i, ballX[i] + speedX[i])
    setItem(ballY, i, ballY[i] + speedY[i])
    
    // Bounce off edges
    if (ballX[i] > 390 or ballX[i] < 10) {
      setItem(speedX, i, speedX[i] * -1)
    }
    if (ballY[i] > 290 or ballY[i] < 10) {
      setItem(speedY, i, speedY[i] * -1)
    }
    
    i = i + 1
  }
}`,
  },
  {
    id: 'arrays-trail',
    name: 'Drawing Trail',
    category: 'Creative',
    code: `// Store positions in a list to create a trail

var trailX = []
var trailY = []

function setup() {
  background(20, 20, 30)
}

function loop() {
  // Fade background slightly
  background(20, 20, 30, 0.1)
  
  // Add current mouse position to trail
  append(trailX, 200)
  append(trailY, 150)
  
  // Keep only last 50 points
  if (getLength(trailX) > 50) {
    // Remove first item (simple approach)
    var newX = []
    var newY = []
    var i = 1
    while (i < getLength(trailX)) {
      append(newX, trailX[i])
      append(newY, trailY[i])
      i = i + 1
    }
    trailX = newX
    trailY = newY
  }
  
  // Draw trail
  var i = 0
  while (i < getLength(trailX)) {
    var alpha = i / getLength(trailX)
    fill(100, 200, 255, alpha)
    ellipse(trailX[i], trailY[i], 10, 10)
    i = i + 1
  }
}`,
  },
  {
    id: 'spiral',
    name: 'Spiral Pattern',
    category: 'Graphics',
    code: `// Create a spiral using math functions

function setup() {
  background(20, 20, 30)
  
  var angle = 0
  var radius = 0
  
  while (radius < 150) {
    // Convert angle to x, y position
    var x = 200 + cos(angle) * radius
    var y = 150 + sin(angle) * radius
    
    // Color based on angle
    var r = map(angle, 0, 10, 100, 255)
    var g = map(radius, 0, 150, 100, 255)
    var b = 200
    
    fill(r, g, b)
    ellipse(x, y, 5, 5)
    
    // Increase angle and radius
    angle = angle + 0.2
    radius = radius + 0.5
  }
}`,
  },
  {
    id: 'particle-explosion',
    name: 'Particle Explosion',
    category: 'Animation',
    code: `// Animated particle system using lists

var particlesX = []
var particlesY = []
var particlesSpeedX = []
var particlesSpeedY = []
var particlesLife = []

function setup() {
  background(10, 10, 20)
  
  // Create initial particles
  var i = 0
  while (i < 30) {
    append(particlesX, 200)
    append(particlesY, 150)
    append(particlesSpeedX, random(-5, 5))
    append(particlesSpeedY, random(-5, 5))
    append(particlesLife, 100)
    i = i + 1
  }
}

function loop() {
  background(10, 10, 20, 0.2)
  
  var i = 0
  while (i < getLength(particlesX)) {
    // Update position
    setItem(particlesX, i, particlesX[i] + particlesSpeedX[i])
    setItem(particlesY, i, particlesY[i] + particlesSpeedY[i])
    setItem(particlesLife, i, particlesLife[i] - 1)
    
    // Draw particle
    var alpha = particlesLife[i] / 100
    fill(255, 200, 100, alpha)
    ellipse(particlesX[i], particlesY[i], 4, 4)
    
    // Remove dead particles
    if (particlesLife[i] <= 0) {
      // Reset particle
      setItem(particlesX, i, 200)
      setItem(particlesY, i, 150)
      setItem(particlesSpeedX, i, random(-5, 5))
      setItem(particlesSpeedY, i, random(-5, 5))
      setItem(particlesLife, i, 100)
    }
    
    i = i + 1
  }
}`,
  },
  {
    id: 'color-palette',
    name: 'Color Palette',
    category: 'Graphics',
    code: `// Create a color palette using lists

function setup() {
  background(255, 255, 255)
  
  // Define color palette
  var paletteR = [255, 100, 50, 200, 150]
  var paletteG = [100, 200, 150, 50, 100]
  var paletteB = [50, 100, 255, 150, 200]
  
  // Draw color swatches
  var i = 0
  while (i < getLength(paletteR)) {
    fill(paletteR[i], paletteG[i], paletteB[i])
    rect(50 + i * 60, 100, 50, 50)
    
    // Draw with this color
    fill(paletteR[i], paletteG[i], paletteB[i])
    ellipse(75 + i * 60, 200, 30, 30)
    
    i = i + 1
  }
  
  print("Color palette created with " + getLength(paletteR) + " colors")
}`,
  },
  {
    id: 'interactive-drawing',
    name: 'Interactive Drawing',
    category: 'Creative',
    code: `// Draw with animated trail using lists

var pointsX = []
var pointsY = []
var time = 0

function setup() {
  background(240, 240, 250)
  print("Creating animated drawing trail!")
}

function loop() {
  // Simulate movement in a circle
  time = time + 0.05
  var x = 200 + cos(time) * 100
  var y = 150 + sin(time) * 80
  
  // Add point to trail
  append(pointsX, x)
  append(pointsY, y)
  
  // Keep only last 100 points
  if (getLength(pointsX) > 100) {
    var newX = []
    var newY = []
    var i = 1
    while (i < getLength(pointsX)) {
      append(newX, pointsX[i])
      append(newY, pointsY[i])
      i = i + 1
    }
    pointsX = newX
    pointsY = newY
  }
  
  // Draw trail
  var i = 0
  while (i < getLength(pointsX) - 1) {
    var alpha = i / getLength(pointsX)
    stroke(100, 150, 255, alpha)
    strokeWeight(2)
    line(pointsX[i], pointsY[i], pointsX[i + 1], pointsY[i + 1])
    i = i + 1
  }
  
  // Draw current point
  fill(255, 100, 100)
  ellipse(x, y, 8, 8)
}`,
  },
  {
    id: 'var-vs-let',
    name: 'var vs let',
    category: 'Basics',
    code: `// var and let both work the same way in this IDE

function setup() {
  background(255, 255, 255)
  
  // Both var and let declare variables
  var x = 50
  let y = 100
  
  // They work exactly the same
  print("var x = " + x)
  print("let y = " + y)
  
  // You can use either one
  var size = 30
  let color = 200
  
  fill(color, 100, 100)
  ellipse(x, y, size, size)
  
  // var is automatically converted to let
  // So both are fine to use!
}`,
  },
  {
    id: 'arrays-vs-objects',
    name: 'Arrays vs Objects',
    category: 'Basics',
    code: `// Learn the difference between arrays [] and objects {}

function setup() {
  background(255, 255, 255)
  
  // ARRAYS [] - Store lists of items, accessed by number
  var numbers = [10, 20, 30, 40, 50]
  var colors = [255, 100, 50]
  
  print("Array - First number: " + numbers[0])
  print("Array - Second number: " + numbers[1])
  print("Array - Length: " + getLength(numbers))
  
  // Access array items by index (number)
  fill(colors[0], colors[1], colors[2])
  ellipse(100, 100, numbers[0], numbers[0])
  
  // OBJECTS {} - Store key-value pairs, accessed by name
  var person = {name: "John", age: 20, x: 200, y: 150}
  
  print("Object - Name: " + person.name)
  print("Object - Age: " + person.age)
  
  // Access object properties by name
  fill(100, 200, 255)
  ellipse(person.x, person.y, 40, 40)
  
  fill(50, 50, 50)
  text(person.name, person.x - 20, person.y + 60, 16)
  text("Age: " + person.age, person.x - 20, person.y + 80, 14)
  
  // Arrays use numbers: list[0]
  // Objects use names: obj.name
}`,
  },
  {
    id: 'encryption',
    name: 'Using Encrypt & Decrypt',
    category: 'Basics',
    code: `// Encrypt and decrypt text and numbers

function setup() {
  background(255, 255, 255)
  
  // Encrypt a string
  var message = "Hello, World!"
  var encrypted = encrypt(message)
  print("Original: " + message)
  print("Encrypted: " + encrypted)
  
  // Decrypt it back
  var decrypted = decrypt(encrypted)
  print("Decrypted: " + decrypted)
  
  // Encrypt a number
  var number = 12345
  var encryptedNum = encrypt(number)
  print("Original number: " + number)
  print("Encrypted: " + encryptedNum)
  print("Decrypted: " + decrypt(encryptedNum))
  
  // Encrypt and decrypt work together!
  var secret = "My secret password"
  var safe = encrypt(secret)
  print("Secret stored as: " + safe)
  print("When needed, decrypt: " + decrypt(safe))
  
  fill(50, 50, 50)
  text("Check console for encryption/decryption", 30, 150, 14)
}`,
  },
  {
    id: 'delay-example',
    name: 'Using Delay',
    category: 'Basics',
    code: `// Use delay() to pause execution - no await needed!

function setup() {
  background(255, 255, 255)
  
  print("Starting...")
  
  // Delay for 1 second
  delay(1)
  print("1 second passed!")
  
  fill(255, 0, 0)
  ellipse(100, 100, 50, 50)
  print("Drew red circle")
  
  // Delay for 0.5 seconds (500 milliseconds)
  delay(0.5)
  print("0.5 seconds passed!")
  
  fill(0, 255, 0)
  ellipse(200, 100, 50, 50)
  print("Drew green circle")
  
  // Delay for 2 seconds
  delay(2)
  print("2 seconds passed!")
  
  fill(0, 0, 255)
  ellipse(300, 100, 50, 50)
  print("Drew blue circle")
  
  print("Done!")
}`,
  },
  {
    id: 'delay-animation',
    name: 'Delayed Animation',
    category: 'Animation',
    code: `// Create animations with delays

var x = 0
var colorIndex = 0
var colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0]]

function setup() {
  background(20, 20, 30)
}

function loop() {
  // Clear with fade
  background(20, 20, 30, 0.1)
  
  // Draw circle
  fill(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2])
  ellipse(x, 150, 30, 30)
  
  // Move
  x = x + 2
  
  // Wrap around and change color
  if (x > 400) {
    x = 0
    colorIndex = (colorIndex + 1) % getLength(colors)
    
    // Delay when wrapping (pause effect) - 0.2 seconds
    delay(0.2)
  }
  
  // Small delay each frame for slower animation - 0.01 seconds
  delay(0.01)
}`,
  },
  {
    id: 'mouse-keyboard',
    name: 'Mouse & Keyboard Input',
    category: 'Basics',
    code: `// Detect mouse clicks and key presses
// IMPORTANT: keyPressed() checks must be in loop(), not setup()
// setup() only runs once at the start, so keys won't be pressed yet

function setup() {
  background(255, 255, 255)
  print("Click the canvas or press keys!")
  print("Press 'a' to see a message!")
}

function loop() {
  // Clear with fade
  background(255, 255, 255, 0.1)
  
  // Draw at mouse position
  fill(100, 150, 255)
  ellipse(mouseX, mouseY, 20, 20)
  
  // Check if left OR right mouse was clicked
  if (mouseClicked("left", "right")) {
    fill(255, 100, 100)
    ellipse(mouseX, mouseY, 40, 40)
    print("Mouse clicked!")
  }
  
  // Check if left mouse was clicked (using constant)
  if (mouseClicked(leftMouse)) {
    fill(255, 150, 150)
    ellipse(mouseX, mouseY, 35, 35)
    print("Left mouse clicked!")
  }
  
  // Check if right mouse was clicked
  if (mouseClicked(rightMouse)) {
    fill(150, 150, 255)
    ellipse(mouseX, mouseY, 45, 45)
    print("Right mouse clicked!")
  }
  
  // Check if mouse is pressed
  if (mousePressed) {
    fill(100, 255, 100)
    ellipse(mouseX, mouseY, 30, 30)
  }
  
  // Check if multiple keys are pressed (ALL of them must be pressed)
  if (keyPressed("a", "Space")) {
    fill(255, 200, 100)
    ellipse(100, 100, 50, 50)
    print("Both 'a' AND 'Space' are pressed!")
  }
  
  // Check if three keys are all pressed
  if (keyPressed("a", "1", "O")) {
    fill(200, 255, 100)
    ellipse(200, 100, 50, 50)
    print("All three keys pressed: a, 1, and O!")
  }
  
  // Middle mouse button
  if (mouseClicked(middleMouse)) {
    fill(255, 100, 255)
    ellipse(mouseX, mouseY, 60, 60)
    print("Middle mouse clicked!")
  }
  
  // Check if specific key is pressed
  if (isKeyPressed("a") or isKeyPressed("A")) {
    fill(255, 150, 100)
    ellipse(200, 100, 40, 40)
    print("A key is pressed!")
  }
  
  // Check if any key is pressed
  if (keyPressed) {
    fill(255, 255, 100)
    ellipse(mouseX, mouseY, 25, 25)
    print("Key pressed: " + key)
  }
  
  // Example: Check for single key
  if (isKeyPressed("a")) {
    print("A key is pressed!")
  }
}`,
  },
  {
    id: 'keypress-example',
    name: 'Key Press Example',
    category: 'Basics',
    code: `// Example showing why key checks must be in loop()

function setup() {
  background(255, 255, 255)
  print("This runs once at the start")
  print("Keys won't be pressed yet, so this won't work:")
  
  // This WON'T work - setup() runs before you can press keys
  if (keyPressed("a")) {
    print("This will never print!")
  }
}

function loop() {
  // This WILL work - loop() runs continuously
  if (isKeyPressed("a")) {
    print("A key is pressed!")
  }
  
  // Check for multiple keys (ALL must be pressed)
  if (keyPressed("a", "Space")) {
    print("Both 'a' AND 'Space' are pressed!")
  }
}`,
  },
  {
    id: 'user-password-system',
    name: 'User/Password System',
    category: 'Advanced',
    code: `// User/Password System
// Enter username and password, display username
// Press 'p' to reset password (use keyClicked, not isKeyPressed!)

let user = {name: "", password: ""}
let savedPassword = ""

function setup() {
  background(255, 255, 255)
  
  // Get username and password
  user.name = input("Username:")
  user.password = input("Password:")
  
  // Encrypt and save password
  savedPassword = encrypt(user.password)
  print("Password saved!")
  print("Username: " + user.name)
}

function loop() {
  background(255, 255, 255)
  
  // Display username
  fill(0, 0, 0)
  text("User: " + user.name, 20, 50, 20)
  
  // Check if 'p' was CLICKED (not held) to reset password
  // keyClicked() only triggers once per key press
  if (keyClicked("p") or keyClicked("P")) {
    let newPassword = input("Enter new password:")
    savedPassword = encrypt(newPassword)
    user.password = newPassword
    print("Password updated!")
  }
  
  // Display status
  fill(100, 100, 100)
  text("Press 'p' to reset password", 20, 100, 14)
}`,
  },
  {
    id: 'button-example',
    name: 'Button System',
    category: 'Advanced',
    code: `// Button System Example
// Create buttons and check if they're clicked

function setup() {
  background(255, 255, 255)
  size(400, 300)
}

function loop() {
  background(255, 255, 255)
  
  // Create buttons
  button(50, 50, 100, 40, "start")
  button(200, 50, 100, 40, "stop")
  button(50, 120, 100, 40, "reset")
  
  // Check if buttons are clicked (method 1)
  if (buttonClicked("start")) {
    fill(100, 255, 100)
    ellipse(200, 200, 50, 50)
    print("Start button clicked!")
  }
  
  // Check if button is clicked (method 2 - easier syntax)
  if (stop(clicked)) {
    fill(255, 100, 100)
    ellipse(200, 200, 50, 50)
    print("Stop button clicked!")
  }
  
  if (reset(clicked)) {
    background(255, 255, 255)
    print("Reset button clicked!")
  }
  
  // Draw instructions
  fill(0, 0, 0)
  text("Click the buttons above!", 50, 250, 14)
}`,
  },
  {
    id: 'player-movement',
    name: 'Player Movement System',
    category: 'Games',
    code: `// Player Movement System
// Use WASD or Arrow Keys to move the player

let player = {
  x: 200,
  y: 150,
  speed: 3,
  size: 20
}

function setup() {
  background(255, 255, 255)
  size(400, 300)
}

function loop() {
  // Clear with slight fade for trail effect
  background(255, 255, 255, 0.1)
  
  // Movement controls (WASD or Arrow Keys)
  if (isKeyPressed("w") or isKeyPressed("W") or isKeyPressed("ArrowUp")) {
    player.y = player.y - player.speed
  }
  if (isKeyPressed("s") or isKeyPressed("S") or isKeyPressed("ArrowDown")) {
    player.y = player.y + player.speed
  }
  if (isKeyPressed("a") or isKeyPressed("A") or isKeyPressed("ArrowLeft")) {
    player.x = player.x - player.speed
  }
  if (isKeyPressed("d") or isKeyPressed("D") or isKeyPressed("ArrowRight")) {
    player.x = player.x + player.speed
  }
  
  // Keep player on screen
  player.x = constrain(player.x, player.size/2, 400 - player.size/2)
  player.y = constrain(player.y, player.size/2, 300 - player.size/2)
  
  // Draw player
  fill(100, 150, 255)
  ellipse(player.x, player.y, player.size, player.size)
  
  // Draw instructions
  fill(0, 0, 0)
  text("WASD or Arrow Keys to move", 10, 20, 12)
}`,
  },
  {
    id: 'object-spawning',
    name: 'Object Spawning System',
    category: 'Games',
    code: `// Object Spawning System
// Click to spawn objects, they fall down and disappear

let objects = []
let spawnTimer = 0

function setup() {
  background(255, 255, 255)
  size(400, 300)
}

function loop() {
  // Clear screen
  background(255, 255, 255)
  
  // Spawn objects on mouse click
  if (mouseClicked) {
    let obj = {
      x: mouseX,
      y: mouseY,
      speed: random(1, 3),
      size: random(10, 30),
      color: [random(100, 255), random(100, 255), random(100, 255)]
    }
    append(objects, obj)
  }
  
  // Update and draw all objects
  let i = 0
  while (i < getLength(objects)) {
    let obj = getItem(objects, i)
    
    // Move object down
    obj.y = obj.y + obj.speed
    
    // Remove if off screen
    if (obj.y > 300) {
      // Remove object from list
      let newObjects = []
      for (let j = 0; j < getLength(objects); j = j + 1) {
        if (j != i) {
          append(newObjects, getItem(objects, j))
        }
      }
      objects = newObjects
    } else {
      // Draw object
      fill(obj.color[0], obj.color[1], obj.color[2])
      ellipse(obj.x, obj.y, obj.size, obj.size)
      i = i + 1
    }
  }
  
  // Display count
  fill(0, 0, 0)
  text("Objects: " + getLength(objects), 10, 20, 14)
  text("Click to spawn", 10, 40, 12)
}`,
  },
  {
    id: 'complete-game-example',
    name: 'Complete Game: Player & Enemies',
    category: 'Games',
    code: `// Complete Game Example
// Player movement + enemy spawning system

let player = {
  x: 200,
  y: 250,
  speed: 4,
  size: 20
}

let enemies = []
let score = 0
let gameOver = false

function setup() {
  background(255, 255, 255)
  size(400, 300)
}

function loop() {
  if (gameOver) {
    background(255, 200, 200)
    fill(0, 0, 0)
    text("GAME OVER", 150, 140, 24)
    text("Score: " + score, 150, 170, 18)
    text("Press R to restart", 120, 200, 14)
    
    if (keyClicked("r") or keyClicked("R")) {
      gameOver = false
      player.x = 200
      player.y = 250
      enemies = []
      score = 0
    }
    return
  }
  
  background(255, 255, 255)
  
  // Player movement
  if (isKeyPressed("a") or isKeyPressed("A")) {
    player.x = player.x - player.speed
  }
  if (isKeyPressed("d") or isKeyPressed("D")) {
    player.x = player.x + player.speed
  }
  player.x = constrain(player.x, player.size/2, 400 - player.size/2)
  
  // Spawn enemies randomly
  if (random(0, 100) < 2) {
    let enemy = {
      x: random(20, 380),
      y: -20,
      speed: random(2, 4),
      size: random(15, 25)
    }
    append(enemies, enemy)
  }
  
  // Update enemies
  let i = 0
  while (i < getLength(enemies)) {
    let enemy = getItem(enemies, i)
    enemy.y = enemy.y + enemy.speed
    
    // Check collision with player
    let distance = dist(player.x, player.y, enemy.x, enemy.y)
    if (distance < (player.size/2 + enemy.size/2)) {
      gameOver = true
    }
    
    // Remove if off screen
    if (enemy.y > 320) {
      let newEnemies = []
      for (let j = 0; j < getLength(enemies); j = j + 1) {
        if (j != i) {
          append(newEnemies, getItem(enemies, j))
        }
      }
      enemies = newEnemies
      score = score + 1
    } else {
      fill(255, 100, 100)
      ellipse(enemy.x, enemy.y, enemy.size, enemy.size)
      i = i + 1
    }
  }
  
  // Draw player
  fill(100, 150, 255)
  ellipse(player.x, player.y, player.size, player.size)
  
  // Draw score
  fill(0, 0, 0)
  text("Score: " + score, 10, 20, 16)
  text("A/D to move", 10, 40, 12)
}`,
  },
];

export const DEFAULT_CODE = `// Welcome to ProcessingIDE!
// Write your code here and press Run (Ctrl+R)

function setup() {
  background(255, 255, 255)
  
  fill(100, 150, 255)
  ellipse(200, 150, 80, 80)
  
  fill(50, 50, 50)
  text("Hello, Creative Coder!", 120, 250, 20)
  
  print("Ready to create!")
}`;
