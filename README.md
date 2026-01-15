# ArtLang IDE

A modern, web-based coding environment featuring a Lua-like language with Processing-inspired graphics capabilities.

## Features

- **Lua-like Syntax**: Clean, readable syntax similar to Lua/Luau
- **Processing-like Graphics**: Easy-to-use graphics functions for creating visual art
- **Modern IDE**: Clean, simplified interface inspired by Processing
- **Multiple Tabs**: Work on multiple sketches simultaneously
- **Theme Support**: Choose from Light, Dark, Monokai, and Solarized themes
- **Save/Load**: Save your sketches as `.art` files
- **Real-time Execution**: Run your code and see results instantly

## Getting Started

Simply open `index.html` in a modern web browser. No installation required!

## Language Syntax

### Basic Structure

```lua
function setup()
    -- Called once at the start
    background(240, 240, 240)
end

function draw()
    -- Called repeatedly (animation loop)
    fill(100, 150, 255)
    circle(width / 2, height / 2, 50)
end
```

### Variables

Variables are global by default - no need for "local" keyword:

```lua
x = 100
name = "Hello"
isActive = true
```

### Functions

```lua
function myFunction(x, y)
    return x + y
end
```

### Control Flow

```lua
-- If statement
if x > 100 then
    print("Large")
else
    print("Small")
end

-- For loop
for i = 1, 10, 1 do
    print(i)
end

-- While loop
while x < 100 do
    x = x + 1
end
```

## Graphics Functions

### Drawing Shapes

- `rect(x, y, width, height)` - Draw a rectangle
- `ellipse(x, y, width, height)` - Draw an ellipse
- `circle(x, y, radius)` - Draw a circle
- `line(x1, y1, x2, y2)` - Draw a line
- `triangle(x1, y1, x2, y2, x3, y3)` - Draw a triangle
- `point(x, y)` - Draw a point

### Colors

- `background(r, g, b)` - Set background color
- `fill(r, g, b)` - Set fill color
- `stroke(r, g, b)` - Set stroke color
- `noFill()` - Disable filling
- `noStroke()` - Disable stroking
- `strokeWeight(width)` - Set stroke width

### Text

- `text(str, x, y)` - Draw text
- `textSize(size)` - Set text size

### Transformations

- `push()` - Save current transformation state
- `pop()` - Restore transformation state
- `translate(x, y)` - Translate coordinate system
- `rotate(angle)` - Rotate coordinate system
- `scale(x, y)` - Scale coordinate system

## Built-in Variables

- `width` - Canvas width
- `height` - Canvas height
- `mouseX`, `mouseY` - Current mouse position
- `pmouseX`, `pmouseY` - Previous mouse position
- `mousePressed` - True if mouse is pressed
- `keyPressed` - True if key is pressed
- `key` - Current key being pressed
- `frameCount` - Number of frames since start
- `PI`, `TWO_PI`, `HALF_PI` - Math constants

## Math Functions

- `random(min, max)` - Random number
- `map(value, start1, stop1, start2, stop2)` - Map value from one range to another
- `constrain(value, min, max)` - Constrain value to range
- `dist(x1, y1, x2, y2)` - Distance between two points
- `lerp(start, stop, amt)` - Linear interpolation
- `cos(angle)`, `sin(angle)`, `tan(angle)` - Trigonometric functions
- `sqrt(value)` - Square root
- `pow(base, exp)` - Power function
- `abs(value)` - Absolute value
- `floor(value)`, `ceil(value)`, `round(value)` - Rounding functions
- `min(a, b)`, `max(a, b)` - Min/Max functions

## Examples

### Simple Animation

```lua
function setup()
    background(240, 240, 240)
end

function draw()
    fill(100, 150, 255)
    noStroke()
    
    x = width / 2 + cos(frameCount * 0.05) * 100
    y = height / 2 + sin(frameCount * 0.05) * 100
    
    circle(x, y, 50)
end
```

### Interactive Drawing

```lua
function setup()
    background(255, 255, 255)
end

function draw()
    if mousePressed then
        fill(255, 0, 0)
        circle(mouseX, mouseY, 20)
    end
end
```

## Keyboard Shortcuts

- `Ctrl/Cmd + R` - Run code
- `Ctrl/Cmd + S` - Save
- `Ctrl/Cmd + N` - New tab

## Browser Compatibility

Works best in modern browsers (Chrome, Firefox, Safari, Edge).

## License

Free to use and modify!

