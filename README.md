# SketchIDE

A modern, beginner-friendly coding environment for visual programming, inspired by Processing. Create interactive graphics, animations, and games with a simple, easy-to-learn language.

## Features

- **Processing-like Syntax**: Clean, beginner-friendly syntax similar to Processing
- **Visual Programming**: Easy-to-use graphics functions for creating art and animations
- **Modern IDE**: Clean interface inspired by Processing IDE
- **Project Management**: Save sketches to your sketchbook folder
- **Real-time Execution**: Run your code and see results instantly
- **Examples Library**: Built-in examples to help you learn
- **Auto-save**: Your code is automatically saved as you work
- **Error Detection**: Real-time error highlighting and console messages

## Installation

### Windows
1. Download `SketchIDE Setup 1.0.0.exe` from the releases
2. Run the installer
3. Launch SketchIDE from the Start Menu or desktop shortcut

### Portable Version
1. Extract `win-unpacked` folder
2. Run `SketchIDE.exe`
3. No installation required!

## Getting Started

### Basic Structure

```javascript
function setup() {
  // Called once at the start
  size(400, 400);
  background(240, 240, 240);
}

function loop() {
  // Called repeatedly (animation loop)
  fill(100, 150, 255);
  ellipse(mouseX, mouseY, 50, 50);
}
```

### Saving Projects

- **Ctrl+S**: Save the current project (prompts for name if new)
- **Shift+Ctrl+S**: Save as a new project (always prompts for name)
- Projects are automatically saved to your sketchbook folder:
  - Windows: `%APPDATA%\SketchIDE\sketchbook\`

## Language Reference

### Drawing Shapes

- `rect(x, y, width, height)` - Draw a rectangle
- `ellipse(x, y, width, height)` - Draw an ellipse
- `circle(x, y, radius)` - Draw a circle
- `line(x1, y1, x2, y2)` - Draw a line
- `triangle(x1, y1, x2, y2, x3, y3)` - Draw a triangle
- `point(x, y)` - Draw a point

### Colors

- `background(r, g, b)` - Set background color (0-255)
- `fill(r, g, b)` - Set fill color
- `stroke(r, g, b)` - Set stroke color
- `noFill()` - Disable filling
- `noStroke()` - Disable stroking
- `strokeWeight(width)` - Set stroke width

### Mouse & Keyboard

- `mouseX`, `mouseY` - Current mouse position
- `mousePressed` - True if mouse button is pressed
- `mouseClicked` - True if mouse was clicked this frame
- `keyPressed` - True if any key is pressed
- `keyClicked()` - True if a key was clicked this frame
- `keyPressed("a")` - True if specific key(s) are pressed
- `mouseClicked(leftMouse)` - True if left mouse button was clicked
- `mouseClicked(rightMouse)` - True if right mouse button was clicked
- `mouseClicked(middleMouse)` - True if middle mouse button was clicked

### Interactive Buttons

- `button(x, y, width, height, id)` - Create a button
- `buttonClicked("id")` - Check if a button was clicked

### Utility Functions

- `print(value)` - Print to console
- `random(min, max)` - Random number
- `map(value, min1, max1, min2, max2)` - Map a value from one range to another
- `delay(seconds)` - Non-blocking delay (e.g., `delay(0.5)` for 500ms)

### Encryption

- `encrypt(data)` - Encrypt text or numbers
- `decrypt(encrypted)` - Decrypt previously encrypted data

## Keyboard Shortcuts

- `Ctrl+R` - Run code
- `Ctrl+S` - Save project
- `Ctrl+Shift+S` - Save as new project
- `Ctrl+N` - New project
- `Ctrl+O` - Open project
- `Ctrl+Shift+F` - Format code
- `Ctrl+Shift+C` - Clear console

## Examples

Check out the built-in examples from the Help menu to learn:
- Basic drawing
- Interactive animations
- Mouse and keyboard input
- Button systems
- Player movement
- Particle systems
- And more!

## Version

Current version: **1.0.0**

The app will notify you when updates are available. You can check for updates manually or download the latest version from the releases page.

## License

Free to use and modify!

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Support

For help and documentation, use the Help menu in the app or check the built-in examples.
