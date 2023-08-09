The Application Layer is what connects your domain model to the outside world.

Use cases are **concrete implementations of the ports** (which are mostly controllers)

Both the port and its concrete implementation (the use case) belong inside the application core

For example, in a CMS we could have:
the actual application UI used by the common users
another independent UI for the CMS administrators
another CLI UI
and a web API

These UIs (applications) could trigger use cases that can be specific to one of them or reused by several of them.