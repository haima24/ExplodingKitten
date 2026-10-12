# `.gitleaks.toml` — deploy-kit file

gitleaks config: default rules + an allowlist for SimplCommerce's public sample OAuth placeholders. NEW/real secrets still fail CI.

**Generic rules, SimplCommerce allowlist.** The `[extend]` default rules apply to any repo; the `[allowlist]` paths/regexes are this app's sample `appsettings`. Another app → delete the allowlist (or rewrite it for *your* known placeholders), see [docs/BRING-YOUR-OWN-SERVICE.md](../../../../../docs/BRING-YOUR-OWN-SERVICE.md).

Write the block below, verbatim, to `.gitleaks.toml` in the target repo (demo: `ci/.gitleaks.toml`):

```toml
# gitleaks config for the SimplCommerce AKS demo.
# Keeps gitleaks' default rules and adds an allowlist for the OAuth values that
# ship in SimplCommerce's sample appsettings — they are public placeholder demo
# credentials, not real secrets. NEW/real secrets are still caught and fail CI.
title = "SimplCommerce gitleaks config"

[extend]
useDefault = true

[allowlist]
description = "Upstream SimplCommerce sample OAuth values (public demo placeholders)"
regexes = [
  '''1716532045292977''',                                                       # Facebook AppId (sample)
  '''dfece01ae919b7b8af23f962a1f87f95''',                                       # Facebook AppSecret (sample)
  '''583825788849-8g42lum4trd5g3319go0iqt6pn30gqlq\.apps\.googleusercontent\.com''', # Google ClientId (sample)
  '''X8xIiuNEUjEYfiEfiNrWOfI4''',                                               # Google ClientSecret (sample)
]
paths = [
  '''src/SimplCommerce\.WebHost/appsettings\.json''',
  '''src/SimplCommerce\.WebHost/appsettings\.docker\.json''',
]
```
