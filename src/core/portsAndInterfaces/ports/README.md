An input port (driving port) lets the application core (component) 
to **expose the functionality** to the outside of the world.

Both the port and its concrete implementation (the use case) belong
inside the application core

Primary or Driving Adapters then use a port to tell the 
application core (component) what to do.

Driving Adapters will use a Port and an Application Service (use case)
will implement the port, in this case
both the Port and implementation of it are inside 
the Hexagon (Application core).