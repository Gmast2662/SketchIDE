# SketchIDE

A modern, beginner-friendly coding environment for visual programming, inspired by Processing. Create interactive graphics, animations, and games with a simple, easy-to-learn language.

## 📜 License & Terms

**Copyright © 2026 Avi. All rights reserved.**

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)** - see the [LICENSE](LICENSE) file for details.

**Terms of Service:** By using SketchIDE, you agree to the [Terms of Service](TERMS_OF_SERVICE.md).

**License Summary:**
- ✅ **Free to use** - Use the software for any purpose
- ✅ **Free to modify** - Modify the source code as needed
- ✅ **Free to distribute** - Share the software with others
- ✅ **Source code available** - Access to full source code
- ⚠️ **Copyleft** - Modified versions must also be GPL-3.0 (open source)


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

**⚠️ IMPORTANT:**
- **Default Installation (Program Files):** You must **run the installer as Administrator**. Right-click the installer and select "Run as administrator".
- **Custom Location:** If you choose a custom installation folder (like your user folder), you don't need admin rights.

**Installation Steps:**
1. Download `SketchIDE Setup 1.#.#.exe` from the releases
2. **Right-click the installer** → Select **"Run as administrator"**
   - OR choose a custom folder (like `C:\Users\YourName\SketchIDE`) to avoid needing admin rights
3. Follow the installation wizard
4. Launch SketchIDE from the Start Menu or desktop shortcut

**Note about "Windows protected your PC" warning:**
- The app is safe - click "More info" → "Run anyway" to proceed
- This is normal for unsigned free software

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

- **Ctrl+S**: Save the current project
  - If already saved: Saves to the same file automatically
  - If new: Opens file dialog to name and save your sketch
- **Ctrl+Shift+S**: Save As - Always opens file dialog to save with a new name
- Projects are saved to your sketchbook folder by default:
  - **Location**: Same folder as the SketchIDE executable
  - Created automatically on first save
- Auto-save: Your code is automatically saved every 2 seconds to the same file (if saved)

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
- `Ctrl+S` - Save project (same file if already saved, or show dialog)
- `Ctrl+Shift+S` - Save As (always shows file dialog)
- `Ctrl+N` - New project
- `Ctrl+O` - Open project
- `Ctrl+Shift+F` - Format code
- `Ctrl+Shift+C` - Clear console


## 📦 Auto-Update System

SketchIDE automatically checks for updates from GitHub Releases every hour.

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

Current version: **1.0.3**

The app automatically notifies you when updates are available. Updates are checked from: https://github.com/Gmast2662/SketchIDE/releases

## 📝 License

**Copyright © 2026 Avi. All rights reserved.**

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)** - see the [LICENSE](LICENSE) file for details.

**Terms of Service:** Please review the [Terms of Service](TERMS_OF_SERVICE.md) before using SketchIDE.

**License Terms:**
- ✅ Free to use, modify, and distribute
- ✅ Source code available
- ⚠️ Modified versions must also be GPL-3.0 (open source)


## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 💬 Support

For help and documentation:
- Use the Help menu in the app
- Check the built-in examples
- Visit: https://github.com/Gmast2662/SketchIDE
