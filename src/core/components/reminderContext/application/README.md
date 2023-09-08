The Application Layer is what connects your domain model to the outside world.
Use cases are designed to be reusable and independent of any specific presentation layer. They encapsulate complex business rules and can be easily tested in isolation.
Use cases are **concrete implementations of the ports** (which are mostly controllers)

Use cases make use of the domain. This means 

Both the port and its concrete implementation (the use case) belong inside the application core

For example, in a CMS we could have:
- the actual application UI used by the common users
- another independent UI for the CMS administrators
- another CLI UI
- and a web API

These UIs (applications) could trigger use cases that can be specific to one of them or reused by several of them.

The role of an Application Service (use case) is to:
- use a repository to find one or several entities
- tell those entities to do some domain logic 
- and use the repository to persist the entities again, effectively saving the data changes