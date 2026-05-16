# Security And Hardening

Use framework security primitives. Hash passwords with proven hashers, store refresh-token hashes only, sanitize external errors, avoid logging secrets, and keep authorization checks close to data access.

Verification:
- Secrets never appear in responses or logs.
- Cross-user access is denied without leaking existence.
- Tokens expire and refresh tokens rotate.
