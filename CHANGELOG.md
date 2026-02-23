# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.6](https://github.com/chrisJSeng/validador-cpf-cnpj/releases/tag/v1.1.6)

### Changed

- Updated GitHub Actions workflows to use Node.js 24.13.1.
- Updated development `engines.node` requirement to Node.js >= 24.13.1.

## [1.1.5](https://github.com/chrisJSeng/validador-cpf-cnpj/releases/tag/v1.1.5)

### Added

- Added Socket security workflow (`.github/workflows/security-socket.yml`) scheduled/manual only.
- Updated README badges to include Socket.
- Fixed Codecov uploads by allowing an optional `CODECOV_TOKEN` and enabling verbose logs (helps resolve “unknown” coverage badge).

## [1.1.4](https://github.com/chrisJSeng/validador-cpf-cnpj/releases/tag/v1.1.4)

### Added

- Added `CONTRIBUTING.md` with development and release guidelines.
- Added `SECURITY.md` with vulnerability reporting guidelines.
- Added `CODE_OF_CONDUCT.md` with community behavior expectations.
- Added `ROADMAP.md` outlining near/medium/long-term priorities.
- Added GitHub Actions workflow (`.github/workflows/publish-npm.yml`) to publish to npm on `v*` tags with provenance after a successful CI run (uses npm Trusted Publisher/OIDC with `id-token: write`).
- Added GitHub Actions CI workflow (`.github/workflows/ci.yml`) to run lint/test/build on Node.js 18 and 20.
- Added security workflow for Snyk (`.github/workflows/security-snyk.yml`).
- Added Socket security workflow (`.github/workflows/security-socket.yml`) scheduled/manual only.
- Updated README badges (npm version/downloads/license, CI, coverage, Snyk).
- Updated README badges to include Socket.

### Fixed

- Fixed workflow YAML parsing compatibility by quoting the top-level `"on":` key.
- Fixed npm Trusted Publisher publishing by upgrading the GitHub Actions publish job to use Node.js 22 and npm CLI 11.5.1+.
- Fixed Codecov uploads by allowing an optional `CODECOV_TOKEN` and enabling verbose logs (helps resolve “unknown” coverage badge).
