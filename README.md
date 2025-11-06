# Opener - Quick Folder Actions

A VSCode extension that enhances the Explorer context menu with quick-access actions for opening folders in external applications.

## Features

- **Open iOS folders in Xcode**: Right-click on any "ios" folder to open it directly in Xcode
- **Open Android folders in Android Studio**: Right-click on any "android" folder to open it in Android Studio
- **Open folders in VSCode**: Quickly open any folder in the current window or a new VSCode window
- **Custom folder actions**: Define your own folder-specific actions through settings

## Installation

### From VSIX

1. Download the `.vsix` file from the releases
2. Open VSCode
3. Go to Extensions view (Cmd+Shift+X)
4. Click the "..." menu at the top
5. Select "Install from VSIX..."
6. Choose the downloaded file

### From Source

```bash
npm install
npm run compile
npm run package
code --install-extension opener-0.0.1.vsix
```

## Usage

### Preset Actions

Right-click on any folder in the Explorer to see available actions:

- **🧩 Open in Xcode** - Appears for folders named "ios"
- **🤖 Open in Android Studio** - Appears for folders named "android"
- **💠 Open here in VSCode** - Opens the folder in the current VSCode window
- **💠 Open in new VSCode window** - Opens the folder in a new VSCode window

### Custom Actions

You can define custom folder actions in your `settings.json`:

```json
{
  "opener.customFolders": [
    {
      "folderName": "server",
      "label": "Open Backend Terminal",
      "command": "open",
      "args": ["-a", "iTerm.app", "."]
    },
    {
      "folderName": "docs",
      "label": "Open in Typora",
      "command": "open",
      "args": ["-a", "Typora", "."]
    }
  ]
}
```

## Requirements

- VSCode 1.80.0 or higher
- macOS (current version uses macOS-specific commands)

## Extension Settings

This extension contributes the following settings:

- `opener.customFolders`: Array of custom folder actions with the following properties:
  - `folderName`: Name of the folder to match
  - `label`: Display label in the context menu
  - `command`: Shell command to execute
  - `args`: Array of command arguments

## Troubleshooting

### Commands not appearing in context menu

- Make sure you're right-clicking on a folder, not a file
- For Xcode/Android Studio actions, ensure the folder is named exactly "ios" or "android"
- Reload VSCode window (Cmd+Shift+P → "Developer: Reload Window")

### Application not opening

- Verify the application is installed on your system
- Check the "Opener" output channel for error details (View → Output → Select "Opener")
- For custom actions, verify the command and arguments are correct

### Custom actions not working

- Validate your JSON syntax in settings.json
- Ensure all required properties are present: folderName, label, command, args
- Check the "Opener" output channel for validation warnings

### Example Custom Actions

```json
{
  "opener.customFolders": [
    {
      "folderName": "backend",
      "label": "🖥️ Open in iTerm",
      "command": "open",
      "args": ["-a", "iTerm.app", "."]
    },
    {
      "folderName": "frontend",
      "label": "🌐 Open in Browser",
      "command": "open",
      "args": ["http://localhost:3000"]
    }
  ]
}
```

## Known Issues

- Currently only supports macOS
- Custom actions appear for all folders (folder name filtering is limited by VSCode API)

## Release Notes

### 0.0.1

Initial release with basic functionality:

- Preset actions for Xcode, Android Studio, and VSCode
- Custom folder action configuration
- Error handling and logging

## Contributing

Issues and feature requests are welcome!

## License

MIT
# opener
# opener
