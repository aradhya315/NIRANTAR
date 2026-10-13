# NIRANTAR - Manual Test Cases

## 1. Purpose

This document describes manual tests for checking the main functionality, offline behavior, data persistence, backup and restore, responsive layout, and accessibility of NIRANTAR.

## 2. Functional Test Cases

| ID | Test | Procedure | Expected Result |
|---|---|---|---|
| TC-01 | Application launch | Open `index.html` through a local server. | The dashboard loads without a fatal error. |
| TC-02 | Checklist display | Inspect the readiness checklist. | All six preparedness tasks are visible. |
| TC-03 | Checklist completion | Mark an incomplete task as complete. | The task status and displayed progress update. |
| TC-04 | Checklist persistence | Reload the application after changing a task. | The saved completion state remains. |
| TC-05 | Personal plan saving | Enter contact details, supplies, and notes, then save. | The application confirms or displays the saved plan as implemented. |
| TC-06 | Personal plan persistence | Reload after saving a plan. | Previously saved plan information remains visible. |
| TC-07 | Emergency Mode | Save a plan and open Emergency Mode. | The saved contact, supplies, and notes are displayed. |
| TC-08 | Phone link | Save a usable phone number and inspect the contact link. | A phone link is available when the application considers the number usable. |
| TC-09 | Guide search | Search for a term related to one of the built-in guides. | Matching guide content is displayed. |
| TC-10 | Guide availability | Open each of the five built-in guide topics. | Each topic's built-in content can be accessed. |
| TC-11 | Backup export | Export a backup after saving checklist and plan data. | A JSON backup file is downloaded. |
| TC-12 | Version 2 backup contents | Open the exported JSON file. | It contains the NIRANTAR identifier, schema version 2, checklist, and personal plan field. |
| TC-13 | Valid backup restore | Restore a valid version 2 backup. | After confirmation, the imported checklist and valid personal plan are restored. |
| TC-14 | Invalid checklist value | Change one checklist item's `completed` value from a Boolean to a string, then import the file. | The invalid checklist backup is rejected. |
| TC-15 | Unsupported schema | Change the schema version to an unsupported value and import the file. | The unsupported backup is rejected. |
| TC-16 | Cancel restore | Start restoring a valid backup and cancel at the confirmation prompt. | The confirmed operation is cancelled and the checklist is not intentionally replaced. |
| TC-17 | Print plan | Open the print option for a saved plan. | The browser's print interface opens. |

## 4. Offline and Service Worker Tests

| ID | Test | Procedure | Expected Result |
|---|---|---|---|
| TC-18 | Service worker installation | Open the application online through localhost and inspect the browser's Application tools. | The service worker installs or activates without an unhandled error. |
| TC-19 | Offline reload | Allow caching to complete, switch the browser to offline mode, and reload. | The cached application page loads. |
| TC-20 | Offline guides | While offline, open and search built-in guides. | Built-in guide content remains available. |
| TC-21 | Service worker update | Change a cached application file, reload online, and inspect service worker behavior. | The updated application can be loaded according to the service worker update logic. |

## 5. Responsive Layout and Accessibility Tests

| ID | Test | Procedure | Expected Result |
|---|---|---|---|
| TC-22 | Mobile layout | Open the application at a narrow mobile viewport. | The layout adapts without major horizontal overflow. |
| TC-23 | Touch targets | Use the main controls on a touch device or mobile emulator. | Controls remain usable and reasonably easy to activate. |
| TC-24 | Keyboard navigation | Navigate interactive elements using the keyboard. | Focus is visible and controls can be reached. |
| TC-25 | Text readability | Inspect text and control contrast. | Text remains readable against its background. |

## 6. Invalid Backup Test Procedure

To test rejection of an invalid checklist value:

1. Export a valid version 2 backup.
2. Open the downloaded JSON file in a text editor.
3. Find a checklist item containing `"completed": false`.
4. Change it to `"completed": "not-a-boolean"`.
5. Save the file under a different name.
6. Attempt to restore the modified file.
7. Confirm that the application rejects the invalid checklist data.


