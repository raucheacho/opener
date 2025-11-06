import * as assert from "assert";
import * as vscode from "vscode";
import {
  validateCustomAction,
  CustomFolderAction,
  getFolderPath,
} from "../extension";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Running tests");

  suite("Configuration Validation", () => {
    test("Valid custom action should pass validation", () => {
      const validAction = {
        folderName: "server",
        label: "Open in Terminal",
        command: "open",
        args: ["-a", "iTerm.app", "."],
      };

      assert.strictEqual(validateCustomAction(validAction), true);
    });

    test("Invalid action with missing folderName should fail", () => {
      const invalidAction = {
        label: "Open in Terminal",
        command: "open",
        args: ["-a", "iTerm.app", "."],
      };

      assert.strictEqual(validateCustomAction(invalidAction), false);
    });

    test("Invalid action with empty folderName should fail", () => {
      const invalidAction = {
        folderName: "",
        label: "Open in Terminal",
        command: "open",
        args: ["-a", "iTerm.app", "."],
      };

      assert.strictEqual(validateCustomAction(invalidAction), false);
    });

    test("Invalid action with missing command should fail", () => {
      const invalidAction = {
        folderName: "server",
        label: "Open in Terminal",
        args: ["-a", "iTerm.app", "."],
      };

      assert.strictEqual(validateCustomAction(invalidAction), false);
    });

    test("Invalid action with non-array args should fail", () => {
      const invalidAction = {
        folderName: "server",
        label: "Open in Terminal",
        command: "open",
        args: "not an array",
      };

      assert.strictEqual(validateCustomAction(invalidAction), false);
    });

    test("Invalid action with non-string arg should fail", () => {
      const invalidAction = {
        folderName: "server",
        label: "Open in Terminal",
        command: "open",
        args: ["-a", 123, "."],
      };

      assert.strictEqual(validateCustomAction(invalidAction), false);
    });
  });

  suite("Path Resolution", () => {
    test("getFolderPath should return fsPath from URI", () => {
      const testPath = "/test/folder/path";
      const uri = vscode.Uri.file(testPath);

      assert.strictEqual(getFolderPath(uri), testPath);
    });
  });
});
