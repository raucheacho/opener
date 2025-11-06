# Requirements Document

## Introduction

The opener extension provides a context menu enhancement for VSCode that allows users to quickly open folders in external applications (Xcode, Android Studio) or in VSCode windows. The extension includes built-in presets for common development workflows and supports user-defined custom actions through configuration.

## Glossary

- **Opener Extension**: The VSCode extension that provides folder context menu actions
- **Context Menu**: The right-click menu that appears when interacting with folders in VSCode's Explorer
- **Preset Action**: A built-in folder action (Xcode for ios, Android Studio for android, VSCode window actions)
- **Custom Action**: A user-defined folder action configured through settings.json
- **Explorer**: VSCode's file and folder navigation sidebar
- **Workspace Configuration**: User settings stored in settings.json that define custom folder actions

## Requirements

### Requirement 1

**User Story:** As a mobile developer, I want to right-click on my "ios" folder and open it directly in Xcode, so that I can quickly access the native iOS project without manually navigating through Finder.

#### Acceptance Criteria

1. WHEN the user right-clicks on a folder named "ios" in the Explorer, THE Opener Extension SHALL display a context menu item labeled "🧩 Open in Xcode"
2. WHEN the user selects the "Open in Xcode" menu item, THE Opener Extension SHALL execute the command `open -a Xcode .` with the folder path as the working directory
3. IF the command execution fails, THEN THE Opener Extension SHALL display an error notification to the user with the failure reason
4. THE Opener Extension SHALL log the command execution and result to the VSCode output console for debugging purposes

### Requirement 2

**User Story:** As a mobile developer, I want to right-click on my "android" folder and open it directly in Android Studio, so that I can quickly access the native Android project without manually navigating through Finder.

#### Acceptance Criteria

1. WHEN the user right-clicks on a folder named "android" in the Explorer, THE Opener Extension SHALL display a context menu item labeled "🤖 Open in Android Studio"
2. WHEN the user selects the "Open in Android Studio" menu item, THE Opener Extension SHALL execute the command `open -a "Android Studio" .` with the folder path as the working directory
3. IF the command execution fails, THEN THE Opener Extension SHALL display an error notification to the user with the failure reason
4. THE Opener Extension SHALL log the command execution and result to the VSCode output console for debugging purposes

### Requirement 3

**User Story:** As a developer, I want to right-click on any folder and open it in the current VSCode window or a new VSCode window, so that I can quickly navigate my workspace without using the File menu.

#### Acceptance Criteria

1. WHEN the user right-clicks on any folder in the Explorer, THE Opener Extension SHALL display a context menu item labeled "💠 Open here in VSCode"
2. WHEN the user selects the "Open here in VSCode" menu item, THE Opener Extension SHALL execute the command `code .` with the folder path as the working directory
3. WHEN the user right-clicks on any folder in the Explorer, THE Opener Extension SHALL display a context menu item labeled "💠 Open in new VSCode window"
4. WHEN the user selects the "Open in new VSCode window" menu item, THE Opener Extension SHALL execute the command `code -n .` with the folder path as the working directory
5. IF the command execution fails, THEN THE Opener Extension SHALL display an error notification to the user with the failure reason

### Requirement 4

**User Story:** As a developer, I want to define custom folder actions in my settings.json, so that I can open specific folders with my preferred tools and commands.

#### Acceptance Criteria

1. THE Opener Extension SHALL read custom folder actions from the workspace configuration property "opener.customFolders"
2. THE Opener Extension SHALL validate that each custom action contains the required properties: folderName, label, command, and args
3. WHEN the user right-clicks on a folder whose name matches a custom action's folderName, THE Opener Extension SHALL display a context menu item with the custom action's label
4. WHEN the user selects a custom action menu item, THE Opener Extension SHALL execute the specified command with the provided arguments and the folder path as the working directory
5. IF a custom action configuration is invalid, THEN THE Opener Extension SHALL log a warning to the output console and skip that action

### Requirement 5

**User Story:** As a developer, I want context menu actions to appear only for folders and not for files, so that the menu remains clean and relevant to the context.

#### Acceptance Criteria

1. WHEN the user right-clicks on a file in the Explorer, THE Opener Extension SHALL NOT display any context menu items
2. WHEN the user right-clicks on a folder in the Explorer, THE Opener Extension SHALL display all applicable context menu items based on folder name and configuration
3. THE Opener Extension SHALL use the VSCode context condition "explorerResourceIsFolder" to restrict menu visibility to folders only

### Requirement 6

**User Story:** As a developer, I want the extension to activate efficiently without slowing down VSCode startup, so that my editor remains responsive.

#### Acceptance Criteria

1. THE Opener Extension SHALL activate on the "onStartupFinished" event to avoid blocking VSCode initialization
2. THE Opener Extension SHALL register all commands during activation
3. THE Opener Extension SHALL load custom folder actions from workspace configuration during activation
4. THE Opener Extension SHALL complete activation within 100 milliseconds under normal conditions

### Requirement 7

**User Story:** As a developer, I want to see clear error messages when folder operations fail, so that I can understand and resolve issues quickly.

#### Acceptance Criteria

1. WHEN a folder open command fails, THE Opener Extension SHALL display a VSCode error notification containing the command that failed and the error message
2. THE Opener Extension SHALL log detailed error information to the output console including the full command, working directory, and error details
3. THE Opener Extension SHALL log successful command executions to the output console for debugging purposes
4. THE Opener Extension SHALL create a dedicated output channel named "Opener" for all extension logs

### Requirement 8

**User Story:** As a developer, I want multiple matching actions to all appear in the context menu, so that I can choose between different ways to open the same folder.

#### Acceptance Criteria

1. WHEN a folder matches multiple action conditions (preset and custom), THE Opener Extension SHALL display all matching context menu items
2. THE Opener Extension SHALL display preset actions before custom actions in the context menu
3. THE Opener Extension SHALL display the universal VSCode window actions (open here, open in new window) for all folders regardless of name
