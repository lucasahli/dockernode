Interfaces are **used by the application core** to reach 
things outside of itself (like getting some data from
a database).

**Secondary or Driven Adapters** implement an interface and 
are then injected into the application core when needed.

Driven adapters will implement an Interface and an Application Service
will use it, an Interface is inside the Hexagon (Application Core),
but the implementation is in the Adapter, therefore outside
of the Hexagon (in the Infrastructure).