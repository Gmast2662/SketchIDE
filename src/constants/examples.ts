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
