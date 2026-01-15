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
