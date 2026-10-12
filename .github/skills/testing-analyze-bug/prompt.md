# Prompt Pattern: AI Analyze Bug

Use this skill to investigate a reported defect.

## Template
Analyze bug: <bug-id-or-title>
Context: <environment/build/module>
Expected: <expected-behavior>
Actual: <actual-behavior>
Evidence: <logs/screenshots/traces optional>

## Example
Analyze bug: BUG-145 Checkout total mismatch
Context: staging build 2026.07.17, cart module
Expected: total includes discounts and tax
Actual: discount applied twice
Evidence: cart-log.txt, screenshot.png
