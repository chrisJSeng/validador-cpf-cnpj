# Contributing

Thanks for contributing!

## Development setup

Prerequisites:

- Node.js >= 18
- npm

Install dependencies:

```bash
npm install
```

## Common commands

Run tests:

```bash
npm test
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Format:

```bash
npm run format
```

## Pull requests

- Keep PRs focused and scoped to one change.
- Add/adjust tests when behavior changes.
- Ensure `npm test` passes.
- Avoid adding runtime dependencies (this library is zero-dependency at runtime).

## Reporting issues

When opening an issue, please include:

- Input you tried (sanitize if needed)
- Expected vs actual behavior
- Node.js version
- Library version

## Releases (maintainers)

This project follows Semantic Versioning.

Typical steps:

1. Update `CHANGELOG.md` under the version being released.
2. Bump `package.json` version.
3. Run `npm test` and `npm run build`.
4. Tag the release as `vX.Y.Z` (matching the `package.json` version).
