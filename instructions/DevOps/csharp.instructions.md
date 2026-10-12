---
applyTo: "**/*.cs"
---
# C# / .NET conventions

## Architecture
- Controller (HTTP concerns only) → Service/Manager (business logic) → Repository (data access only).
- Many-dependency services use a dependencies-object, not 30-argument constructors.
- CQRS: commands, events, and queries in their own folders.

## Dependency injection
- Inject interfaces via constructor; validate args (`EnsureIsNotNull` or `ArgumentNullException.ThrowIfNull`).
- Fields: `private readonly`; implementations: `internal`.

## Async
- Never `.Result`, `.Wait()`, `Thread.Sleep`, or `async void` (except event handlers).
- Async methods end with `Async` suffix and accept a `CancellationToken`.
- `Task.WhenAll` only for **independent** work — one EF Core `DbContext` is NOT thread-safe.

## EF Core
- No raw SQL — parameterized queries or LINQ only.
- `AsNoTracking()` for read queries.
- `.Any()` not `.Count() > 0`.
- Filter before join; prefer `.Select()` projections over loading full entities.
- Paginate all list queries.

## Logging
- Structured logging with named placeholders: `LogError(ex, "Failed {OrderId}", orderId)`.
- Never use string interpolation in log message templates.
- `ILogger<T>`, never `Console.WriteLine`.
- Never log payment data, tokens, or PII.

## Security
- Authorize every endpoint (`[Authorize]` or policy-based).
- Enforce tenant/owner-ID filtering on data access.
- Validate all input at system boundaries.

## Testing
- Arrange-Act-Assert pattern.
- Test class naming: `ClassNameShould`.
- Cover exception/error paths, not just happy path.

## Style
- `var` when type is obvious from the right-hand side.
- No `TODO` comments in final code.
- Remove dead/commented-out code.
