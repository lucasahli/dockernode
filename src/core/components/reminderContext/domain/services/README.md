Domain logic should stay out of the application layer (use cases)!

A Domain Service has the role of receiving a set of entities (**not getting them from a repository**) and performing some business logic on them. 
A Domain Service belongs to the Domain Layer, and therefore it knows nothing about the classes in the Application Layer,
like the Application Services (use cases) or the Repositories. In the other hand, it can use other Domain Services and, 
of course, the Domain Model objects.