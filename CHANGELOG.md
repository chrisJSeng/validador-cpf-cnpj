# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2](https://github.com/chrisJSeng/validador-cpf-cnpj/releases/tag/v1.1.2)

### Added

- Added `CONTRIBUTING.md` with development and release guidelines.
- Added `SECURITY.md` with vulnerability reporting guidelines.
- Added `CODE_OF_CONDUCT.md` with community behavior expectations.
- Added `ROADMAP.md` outlining near/medium/long-term priorities.
- Added GitHub Actions workflow (`.github/workflows/publish-npm.yml`) to publish to npm on `v*` tags with provenance after a successful CI run (uses npm Trusted Publisher/OIDC with `id-token: write`).
- Added GitHub Actions CI workflow (`.github/workflows/ci.yml`) to run lint/test/build on Node.js 18 and 20.
- Added security workflows for Snyk and Socket (`.github/workflows/security-snyk.yml`, `.github/workflows/security-socket.yml`).
- Updated README badges (npm version/downloads/license, CI, coverage, Snyk, Socket).

### Fixed

- Fixed Socket workflow to install and run the `socket` binary directly (avoids `npx`/`npm exec` argument parsing issues).
- Fixed workflow YAML parsing compatibility by quoting the top-level `"on":` key.

## [1.1.1](https://github.com/chrisJSeng/validador-cpf-cnpj/releases/tag/v1.1.1)

### Notes

- Baseline version recorded when this changelog was introduced (matches `package.json`).
