// Electron Builder configuration
// This file completely disables code signing to avoid Windows permission issues

module.exports = {
  appId: 'com.sketchide.app',
  productName: 'SketchIDE',
  copyright: 'Copyright © 2024',
  
  directories: {
    buildResources: 'build',
    output: 'release',
  },
  
  files: [
    'dist/**/*',
    'electron/**/*',
    'package.json',
    'node_modules/**/*',
  ],
  
  win: {
    target: {
      target: 'nsis',
      arch: ['x64'],
    },
    icon: 'public/logo.png',
    requestedExecutionLevel: 'asInvoker',
    // Completely disable code signing
    sign: null,
    signingHashAlgorithms: [],
    certificateFile: null,
    certificatePassword: null,
  },
  
  mac: {
    target: {
      target: 'dmg',
      arch: ['x64', 'arm64'],
    },
    icon: 'build/icon.icns',
    category: 'public.app-category.developer-tools',
  },
  
  linux: {
    target: {
      target: 'AppImage',
      arch: ['x64'],
    },
    icon: 'build/icon.png',
    category: 'Development',
  },
  
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    allowElevation: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    runAfterFinish: false,
    deleteAppDataOnUninstall: false,
    uninstallDisplayName: 'SketchIDE',
    perMachine: false,
  },
  
  // Force skip code signing
  afterSign: null,
  beforeBuild: null,
};
