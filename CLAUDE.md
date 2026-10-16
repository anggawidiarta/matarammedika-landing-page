## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

# Global Coding Rules

## Code Comments

- Keep code self-documenting. Prefer clear naming, simple control flow, and well-structured functions over explanatory comments.
- Add comments only when they provide meaningful context that cannot be easily inferred from the code itself.
- Prioritize comments for critical business logic, non-obvious algorithms, security-sensitive operations, concurrency behavior, important edge cases, and non-trivial workarounds.
- Do not add comments that merely restate what a function, variable, condition, or line of code does.
- Do not add comments to straightforward functions or obvious implementations.
- Avoid redundant docstrings for internal functions unless required by the project's conventions, public API documentation, or tooling.
- When modifying existing code, do not add unnecessary comments. Preserve existing comments that remain accurate and useful.
- If a comment becomes outdated after a code change, update or remove it.
- When a comment is necessary, explain why the code behaves a certain way or why a particular decision was made, rather than describing what the code does.

## General Coding Principles

- Prefer simple, readable, maintainable solutions over unnecessary abstractions.
- Follow the existing project architecture, naming conventions, and coding standards.
- Avoid unrelated changes, unnecessary refactoring, and speculative improvements.
- Do not introduce additional dependencies unless they provide clear value.
- Before completing a coding task, review the changes for correctness, unnecessary complexity, and unintended side effects.
- Run relevant tests and checks when available.