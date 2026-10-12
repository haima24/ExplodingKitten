# GitHub Copilot for VS Code

## Windows Cheat Sheet

## Daily Shortcuts

| Shortcut | Action |
| --- | --- |
| `Tab` | Accept suggestion |
| `Ctrl + I` | Start Inline Chat in the editor |
| `Ctrl + Alt + I` | Open Copilot Chat |
| `Alt + ]` | Show next suggestion |
| `Ctrl + Enter` | Open all Copilot suggestions |

## Keyboard Shortcuts

### Code Completion

| Shortcut | Action |
| --- | --- |
| `Tab` | Accept suggestion |
| `Esc` | Dismiss suggestion |
| `Alt + ]` | Show next suggestion |
| `Alt + [` | Show previous suggestion |
| `Alt + \` | Trigger inline suggestion manually |
| `Ctrl + Enter` | Open all Copilot suggestions |
| `Ctrl + Right Arrow` | Accept next word only |

### Copilot Chat

| Shortcut | Action |
| --- | --- |
| `Ctrl + Alt + I` | Open Copilot Chat |
| `Ctrl + I` | Start Inline Chat in the editor |
| `Ctrl + Shift + Alt + L` | Open Quick Chat |
| `Ctrl + N` | Start a new chat session |

### Agent Mode

| Shortcut | Action |
| --- | --- |
| `Ctrl + Shift + I` | Switch to Agent Mode |
| `Ctrl + Alt + .` | Open Model Picker |

## Chat Reference

### Commands

| Command | Use it to... |
| --- | --- |
| `/explain` | Explain selected code |
| `/fix` | Suggest fixes for code or errors |
| `/tests` | Generate unit tests |
| `/doc` | Generate documentation |
| `/clear` | Start a new conversation |

### Context Providers

| Provider | Adds context about... |
| --- | --- |
| `@workspace` | The entire workspace |
| `@terminal` | Terminal commands |
| `@vscode` | VS Code features |
| `@github` | GitHub-related resources |

### Variables

| Variable | Refers to... |
| --- | --- |
| `#file` | The current file |
| `#selection` | Selected code |
| `#function` | The current function |
| `#class` | The current class |

## Prompt Examples

### Testing and Playwright

| Context | Prompt |
| --- | --- |
| `Ctrl + I` | Generate Playwright test cases for login functionality |
| `Ctrl + I` | Generate Page Object Model for this page |
| `Ctrl + I` | Fix failing locator and improve stability |
| `@workspace` | Generate regression test scenarios for checkout feature |
| `@workspace` | Analyze this codebase and identify automation opportunities |
| `#file` | Review this test script and suggest improvements |

### Spec Kit

| Context | Prompt |
| --- | --- |
| `@workspace` | Explain this Spec Kit project structure |
| `Ctrl + I` | Generate `spec.md` for a user authentication feature |
| `Ctrl + I` | Generate `plan.md` based on the specification |
| `Ctrl + I` | Generate `tasks.md` from `plan.md` |
| `Ctrl + I` | Generate Playwright automation tests from the specification |

## Git and Source Control

| Shortcut | Action |
| --- | --- |
| `Ctrl + Shift + G` | Open Source Control |
| `Ctrl + Enter` | Commit staged changes when the commit message box is focused |
| `Ctrl + Shift + P` | Open the Command Palette and search Git commands |
| `F1` | Open the Command Palette |

> There is no universal keyboard shortcut for every Git command. Use the Command Palette or create Git aliases for frequently used commands.