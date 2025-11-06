# Implementation Plan

- [x] 1. Set up project structure and configuration files

  - Create package.json with extension manifest, contribution points (commands, menus, configuration), activation events, and build scripts
  - Create tsconfig.json with TypeScript compiler configuration for VSCode extension development
  - Create .vscodeignore file to exclude unnecessary files from extension package
  - Create basic README.md and CHANGELOG.md files
  - _Requirements: 6.1, 6.2_

- [x] 2. Implement core extension activation and command registration

  - Write extension activation function that creates output channel and registers all commands
  - Implement deactivation function for cleanup
  - Create command registration logic for preset commands (openXcode, openAndroidStudio, openCurrentWindow, openNewWindow)
  - Add all disposables to context.subscriptions for proper cleanup
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 3. Implement configuration manager for custom actions

  - Write function to read and parse opener.customFolders from workspace configuration
  - Implement validation function to check custom action structure (folderName, label, command, args)
  - Create TypeScript interface for CustomFolderAction type
  - Implement error handling for invalid configuration entries with warning logs
  - _Requirements: 4.1, 4.2, 4.5_

- [x] 4. Implement command executor with shell command execution

  - Write executeCommand function that uses child_process.exec to run shell commands
  - Implement getFolderPath function to resolve absolute path from VSCode URI
  - Create logExecution function to log command execution results to output channel
  - Implement error notification display using vscode.window.showErrorMessage
  - Add proper working directory (cwd) configuration for command execution
  - _Requirements: 1.2, 1.3, 1.4, 2.2, 2.3, 2.4, 3.2, 3.4, 3.5, 7.1, 7.2, 7.3_

- [x] 5. Implement preset command handlers

  - Write command handler for opener.openXcode that executes "open -a Xcode ."
  - Write command handler for opener.openAndroidStudio that executes "open -a 'Android Studio' ."
  - Write command handler for opener.openCurrentWindow that executes "code ."
  - Write command handler for opener.openNewWindow that executes "code -n ."
  - Connect each handler to the command executor with appropriate labels and icons
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_

- [x] 6. Implement dynamic custom command registration

  - Write function to dynamically register commands for each custom action from configuration
  - Implement command ID generation for custom actions (opener.custom.{index})
  - Create command handlers that execute custom actions with user-defined command and args
  - Add custom commands to context.subscriptions
  - _Requirements: 4.3, 4.4, 8.1, 8.2_

- [x] 7. Configure package.json contribution points for context menus

  - Define commands contribution with all preset command IDs, titles, and icons
  - Configure explorer/context menu contributions with when clauses for folder-only visibility
  - Set up menu item for openXcode with condition "explorerResourceIsFolder && resourceFilename == ios"
  - Set up menu item for openAndroidStudio with condition "explorerResourceIsFolder && resourceFilename == android"
  - Set up menu items for VSCode window actions with condition "explorerResourceIsFolder"
  - Configure menu grouping to display preset actions before custom actions
  - _Requirements: 1.1, 2.1, 3.1, 3.3, 5.1, 5.2, 5.3, 8.1, 8.2, 8.3_

- [x] 8. Implement logging and output channel functionality

  - Create dedicated output channel named "Opener" during activation
  - Implement info-level logging for successful command executions
  - Implement warning-level logging for invalid configuration entries
  - Implement error-level logging for command execution failures
  - Format log messages with timestamp, level, and detailed information
  - _Requirements: 1.4, 2.4, 7.2, 7.3, 7.4_

- [x] 9. Add error handling and user notifications

  - Implement try-catch blocks around command execution
  - Create formatted error messages that include command, path, and error details
  - Display error notifications using vscode.window.showErrorMessage
  - Ensure errors don't crash the extension
  - Log all errors to output channel before showing notifications
  - _Requirements: 1.3, 2.3, 3.5, 4.5, 7.1, 7.2_

- [x] 10. Create extension icon and media assets

  - Create or source a 128x128 PNG icon for the extension
  - Add icon to media/ directory
  - Reference icon in package.json manifest
  - _Requirements: N/A (Visual/Branding)_

- [x] 11. Write unit tests for core functionality

  - Write tests for configuration parsing and validation
  - Write tests for path resolution and folder name extraction
  - Write tests for command registration logic
  - Mock child_process.exec and test command execution flow
  - Test error handling scenarios
  - _Requirements: All requirements (validation)_

- [x] 12. Create comprehensive README documentation

  - Write overview and feature description
  - Document installation instructions
  - Provide usage examples with screenshots
  - Document configuration schema for custom actions
  - Add troubleshooting section
  - Include examples of custom folder configurations
  - _Requirements: N/A (Documentation)_

- [x] 13. Set up build and packaging scripts
  - Add compile script to package.json: "tsc -p ./"
  - Add watch script for development: "tsc -watch -p ./"
  - Add package script: "vsce package"
  - Configure npm scripts for testing
  - Test full build and package process
  - _Requirements: 6.1, 6.2, 6.3_
