Value objects are the objects that describe things. An object that represents a descriptive aspect of the domain with no conceptual identity.
Value objects are instantiated to represent elements of the design that we care about only for what they are, not who or which they are.

Colors are an example of Value objects that are provided in the base libraries of many modern development systems; so are strings and numbers. (You don't care which "4" you have or which "Q".) These basic examples are simple, but Value objects are not necessarily simple. For example, a color-mixing program might have a rich model in which enhanced color objects could be combined to produce other colors. These colors could have complex algorithms for collaborating to derive the new resulting Value object.

A Value object can be an assemblage of other objects.

**Value objects can even reference entities.**
For example, if I ask an online map service for a scenic driving route from San Francisco to Los Angeles, it might derive a Route object linking L.A. and San Francisco via the Pacific Coast Highway. That Route object would be a value , even though the three objects it references (two cities and a highway) are all entities.

When you care only about the attributes of an element of the model, classify it as a value object. Make it express the meaning of the attributes it conveys and give it related functionality. Treat the value object as immutable. Don't give it any identity.

The attributes that make up a value object should form a conceptual whole. For example, street, city, and postal code shouldn't be separate attributes of a Person object. They are part of a single, whole address, which makes a simpler Person, and a more coherent value object.