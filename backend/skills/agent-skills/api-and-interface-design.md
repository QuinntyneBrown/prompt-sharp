# API And Interface Design

Design API contracts around stable user workflows. Keep route names predictable, DTOs explicit, errors consistent, and authorization behavior non-leaky. Prefer small request/response shapes that can be validated and versioned.

Verification:
- Protected resources return 404 for wrong owners.
- Validation errors identify fields.
- DTO names match client expectations.
