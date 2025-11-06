import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";
import * as path from "path";

const execAsync = promisify(exec);

// Global output channel for logging
let outputChannel: vscode.OutputChannel;

/**
 * Interface for custom folder action configuration
 */
export interface CustomFolderAction {
  folderName: string;
  label: string;
  command: string;
  args: string[];
}

export function activate(context: vscode.ExtensionContext) {
  // Create output channel for logging
  outputChannel = vscode.window.createOutputChannel("Opener");
  context.subscriptions.push(outputChannel);

  outputChannel.appendLine("[INFO] Opener extension activating...");

  // Register preset commands
  registerPresetCommands(context);

  // Register custom commands from configuration
  registerCustomCommands(context);

  outputChannel.appendLine("[INFO] Opener extension activated successfully");
}

export function deactivate() {
  // Cleanup is handled automatically by disposing context.subscriptions
  if (outputChannel) {
    outputChannel.appendLine("[INFO] Opener extension deactivating...");
    outputChannel.dispose();
  }
}

/**
 * Register all preset commands for the extension
 */
function registerPresetCommands(context: vscode.ExtensionContext): void {
  // Register openXcode command
  const openXcodeCommand = vscode.commands.registerCommand(
    "opener.openXcode",
    async (uri: vscode.Uri) => {
      await handlePresetCommand(uri, "🧩 Open in Xcode", "open", [
        "-a",
        "Xcode",
        ".",
      ]);
    }
  );
  context.subscriptions.push(openXcodeCommand);

  // Register openAndroidStudio command
  const openAndroidStudioCommand = vscode.commands.registerCommand(
    "opener.openAndroidStudio",
    async (uri: vscode.Uri) => {
      await handlePresetCommand(uri, "🤖 Open in Android Studio", "open", [
        "-a",
        "Android Studio",
        ".",
      ]);
    }
  );
  context.subscriptions.push(openAndroidStudioCommand);

  // Register openCurrentWindow command
  const openCurrentWindowCommand = vscode.commands.registerCommand(
    "opener.openCurrentWindow",
    async (uri: vscode.Uri) => {
      await handlePresetCommand(uri, "💠 Open here in VSCode", "code", ["."]);
    }
  );
  context.subscriptions.push(openCurrentWindowCommand);

  // Register openNewWindow command
  const openNewWindowCommand = vscode.commands.registerCommand(
    "opener.openNewWindow",
    async (uri: vscode.Uri) => {
      await handlePresetCommand(uri, "💠 Open in new VSCode window", "code", [
        "-n",
        ".",
      ]);
    }
  );
  context.subscriptions.push(openNewWindowCommand);

  outputChannel.appendLine("[INFO] Registered 4 preset commands");
}

/**
 * Handle execution of preset commands
 */
async function handlePresetCommand(
  uri: vscode.Uri,
  label: string,
  command: string,
  args: string[]
): Promise<void> {
  const folderPath = getFolderPath(uri);
  await executeCommand({
    command,
    args,
    cwd: folderPath,
    label,
  });
}

/**
 * Options for command execution
 */
export interface CommandExecutionOptions {
  command: string;
  args: string[];
  cwd: string;
  label: string;
}

/**
 * Escape shell argument by wrapping in quotes if it contains spaces or special characters
 * @param arg The argument to escape
 * @returns Escaped argument safe for shell execution
 */
function escapeShellArg(arg: string): string {
  // If argument contains spaces, quotes, or special characters, wrap in double quotes
  if (/[\s"'$`\\!*?(){}[\]<>|&;]/.test(arg)) {
    // Escape any existing double quotes and backslashes
    return `"${arg.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return arg;
}

/**
 * Execute a shell command with proper error handling
 * @param options Command execution options
 */
export async function executeCommand(
  options: CommandExecutionOptions
): Promise<void> {
  const { command, args, cwd, label } = options;
  
  // Properly escape arguments that contain spaces or special characters
  const escapedArgs = args.map(escapeShellArg);
  const fullCommand = `${command} ${escapedArgs.join(" ")}`;

  try {
    outputChannel.appendLine(`[INFO] Executing: ${fullCommand} (cwd: ${cwd})`);

    await execAsync(fullCommand, { cwd });

    logExecution(fullCommand, cwd, true);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logExecution(fullCommand, cwd, false, errorMessage);

    vscode.window.showErrorMessage(
      `Failed to execute: ${label}\nCommand: ${fullCommand}\nError: ${errorMessage}`
    );
  }
}

/**
 * Resolve absolute folder path from VSCode URI
 * @param uri The folder URI from context menu
 * @returns Absolute path to the folder
 */
export function getFolderPath(uri: vscode.Uri): string {
  return uri.fsPath;
}

/**
 * Log command execution results to output channel
 * @param command The command that was executed
 * @param cwd The working directory
 * @param success Whether the command succeeded
 * @param error Optional error message if command failed
 */
export function logExecution(
  command: string,
  cwd: string,
  success: boolean,
  error?: string
): void {
  if (success) {
    outputChannel.appendLine(`[INFO] Successfully executed: ${command} (cwd: ${cwd})`);
  } else {
    outputChannel.appendLine(
      `[ERROR] Failed to execute: ${command} (cwd: ${cwd}) - Error: ${error}`
    );
  }
}

/**
 * Read and parse custom folder actions from workspace configuration
 * @returns Array of valid custom folder actions
 */
export function getCustomActions(): CustomFolderAction[] {
  const config = vscode.workspace.getConfiguration("opener");
  const customFolders = config.get<any[]>("customFolders", []);

  const validActions: CustomFolderAction[] = [];

  for (let i = 0; i < customFolders.length; i++) {
    const action = customFolders[i];
    
    if (validateCustomAction(action)) {
      validActions.push(action as CustomFolderAction);
    } else {
      outputChannel.appendLine(
        `[WARN] Invalid custom action at index ${i}: ${JSON.stringify(action)}`
      );
    }
  }

  outputChannel.appendLine(
    `[INFO] Loaded ${validActions.length} valid custom action(s) from configuration`
  );

  return validActions;
}

/**
 * Validate that a custom action has the required structure
 * @param action The action object to validate
 * @returns true if the action is valid, false otherwise
 */
export function validateCustomAction(action: any): boolean {
  // Check if action is an object
  if (!action || typeof action !== "object") {
    return false;
  }

  // Check required properties exist and have correct types
  if (typeof action.folderName !== "string" || action.folderName.trim() === "") {
    return false;
  }

  if (typeof action.label !== "string" || action.label.trim() === "") {
    return false;
  }

  if (typeof action.command !== "string" || action.command.trim() === "") {
    return false;
  }

  if (!Array.isArray(action.args)) {
    return false;
  }

  // Validate that all args are strings
  for (const arg of action.args) {
    if (typeof arg !== "string") {
      return false;
    }
  }

  return true;
}

/**
 * Register dynamic custom commands from configuration
 * @param context Extension context
 */
function registerCustomCommands(context: vscode.ExtensionContext): void {
  const customActions = getCustomActions();

  for (let i = 0; i < customActions.length; i++) {
    const action = customActions[i];
    const commandId = `opener.custom.${i}`;

    const customCommand = vscode.commands.registerCommand(
      commandId,
      async (uri: vscode.Uri) => {
        const folderPath = getFolderPath(uri);
        await executeCommand({
          command: action.command,
          args: action.args,
          cwd: folderPath,
          label: action.label,
        });
      }
    );

    context.subscriptions.push(customCommand);
    outputChannel.appendLine(
      `[INFO] Registered custom command: ${commandId} for folder "${action.folderName}"`
    );
  }

  outputChannel.appendLine(
    `[INFO] Registered ${customActions.length} custom command(s)`
  );
}
