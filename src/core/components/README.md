# Component
Bounded Contexts (Components) separate areas of potentially different meanings.
Inside a Component are **two main layers**:
- Domain
- Application

The inner layer is the **Domain layer**. It consists of the following three things:
- Entities
- Domain Services
- Value Objects

The outer layer is the **Application layer**. It consists of the following things:
- Application Services
- Use Cases

## Application layer
### Use Cases vs Application Services
Each serves a distinct purpose within the architecture:

1. **Use Cases**:
   - **Purpose**: Use Cases represent specific application functionalities or business processes. They encapsulate the core logic of these processes.
   - **Responsibility**: Use Cases define how a particular operation should be executed. They encapsulate the business rules and orchestrate interactions between entities, services, and data sources.
   - **Abstraction**: Use Cases abstract away the details of how the application achieves a specific outcome. They provide a clear, high-level interface for invoking business operations.
   - **Scalability**: Use Cases can be granular, allowing you to compose complex operations from smaller, reusable building blocks.
   - **Example**: In a blogging application, you might have Use Cases like `CreateArticleUseCase` and `ListArticlesUseCase`.

2. **Application Services**:
   - **Purpose**: Application Services act as intermediaries between the Use Cases and the underlying infrastructure (e.g., repositories, external services).
   - **Responsibility**: Application Services provide a boundary between the Use Cases and the technical details of data storage and retrieval. They manage the interaction with repositories and other services.
   - **Abstraction**: They encapsulate the specific interactions with data storage and external systems, shielding the Use Cases from these details.
   - **Reusability**: Application Services can be shared among multiple Use Cases, promoting code reuse for common operations like data persistence.
   - **Example**: In the same blogging application, you might have an `ArticleService` responsible for creating and listing articles. It interacts with the `ArticleRepository`.

The key benefit of this separation is to maintain a clear distinction between the application's business logic (Use Cases) and the technical concerns (Application Services and infrastructure). This separation helps in several ways:

- **Modularity**: You can change the underlying data storage or replace external services without affecting the core business logic (Use Cases).

- **Testability**: Use Cases can be unit tested in isolation because they don't have direct dependencies on data access or external systems. Mocked or stubbed Application Services can be used during testing.

- **Readability and Maintainability**: The separation provides a clear structure to the codebase, making it easier for developers to understand, modify, and extend the application.

- **Flexibility**: You can reuse Application Services across different Use Cases, avoiding duplication of code for common operations.

While this separation can introduce some additional layers and complexity, it often pays off in the long run, especially in larger and more complex applications where maintainability and adaptability are essential. However, in simpler applications, this separation may be less pronounced, and you may choose to combine the responsibilities of Use Cases and Application Services to some extent for the sake of simplicity.




## Example of an e-commerce system.

1. **Application Layer**:

   The Application Layer represents the top-level layer of the architecture, responsible for handling use cases triggered by various user interfaces and external systems.

2. **Use Cases**:

   In our e-commerce system, we can have several use cases, such as:
    - **Place an Order**: This use case allows users to place an order for products.
    - **Cancel an Order**: This use case allows users to cancel their orders.
    - **View Order History**: This use case lets users view their order history.

3. **Application Services**:

   Application Services coordinate the execution of use cases. Each use case might have its corresponding Application Service, and they interact with the domain model and repositories. Here are some examples of Application Services:

    - `OrderService`: Responsible for handling order-related use cases.
    - `UserService`: Manages user-related use cases.
    - `NotificationService`: Handles sending notifications, such as emails and push notifications.

4. **Ports & Adapters**:

   Ports and Adapters represent the interfaces for external systems or technologies. In our example, we can have the following ports and adapters:

    - **Repository Interface**: An interface for data storage and retrieval, which can be implemented by different data storage technologies (e.g., a SQL database, NoSQL database).
    - **Payment Gateway Adapter**: An adapter for interfacing with external payment gateways like PayPal or Stripe.
    - **Email Service Adapter**: An adapter for sending emails using external email service providers.

Now, let's break down one specific use case and how it fits into this architecture:

**Use Case: Place an Order**

- **Application Layer**: This use case is part of the Application Layer, which orchestrates the interactions between different components.

- **Application Service**: We have an `OrderService` Application Service responsible for handling order-related use cases. The `PlaceOrder` method in this service would coordinate the execution of this specific use case.

- **Domain Model**: Within the Application Layer, we have a domain model that includes entities like `Order` and `Product`. The `PlaceOrder` method in the `OrderService` will create an `Order` entity, update the inventory of products, and perform other necessary domain logic.

- **Repository Interface**: The `OrderService` interacts with a repository interface (e.g., `OrderRepository`) to persist the order data in the chosen storage (e.g., a database).

- **Payment Gateway Adapter**: When placing an order, the `PlaceOrder` method may also interact with a Payment Gateway Adapter to handle payment processing and ensure payment authorization.

- **Email Service Adapter**: After a successful order placement, the `PlaceOrder` method can trigger an Email Service Adapter to send an order confirmation email to the customer.

This example demonstrates how the Application Layer, Use Cases, Application Services, and Ports & Adapters interact to implement a specific functionality within the architecture. Similar principles can be applied to other use cases and components in the system to maintain modularity and flexibility.


# Job Queue integration Example

To integrate the provided functionality into an architecture with an application layer, use cases, application services, and ports and adapters, you can follow a few guidelines:

1. **Create an Application Service**:

   Create an Application Service within the Application Layer that handles scheduling and processing of jobs. This service will encapsulate the scheduling and processing logic, making it a part of your domain logic.

   ```javascript
   // application/services/JobSchedulingService.js

   const Redis = require('ioredis');
   const redis = new Redis(); // Create a Redis client.

   class JobSchedulingService {
     async scheduleJob(jobType, jobData, timestamp) {
       // Your scheduleJob logic here
     }

     async processScheduledJobs() {
       // Your processScheduledJobs logic here
     }
   }

   module.exports = JobSchedulingService;
   ```

2. **Use Case**:

   Define a use case within the Application Layer that represents the scheduling and processing of jobs. This use case will use the Application Service created in the previous step.

   ```javascript
   // application/use-cases/ScheduleAndProcessJobs.js

   const JobSchedulingService = require('../services/JobSchedulingService');

   class ScheduleAndProcessJobs {
     constructor() {
       this.jobSchedulingService = new JobSchedulingService();
     }

     async execute(jobType, jobData, timestamp) {
       // Your use case logic here
       await this.jobSchedulingService.scheduleJob(jobType, jobData, timestamp);
       await this.jobSchedulingService.processScheduledJobs();
     }
   }

   module.exports = ScheduleAndProcessJobs;
   ```

3. **Adapters**:

   Create adapter interfaces (ports) for interacting with external systems, such as Redis. These interfaces will allow you to swap out the implementation if needed. In this case, you might create a `RedisAdapter` for interacting with Redis.

   ```javascript
   // application/adapters/RedisAdapter.js

   const Redis = require('ioredis');

   class RedisAdapter {
     constructor() {
       this.redis = new Redis();
     }

     async zadd(key, score, value) {
       // Your zadd implementation here
     }

     async zrange(key, start, stop, withScores) {
       // Your zrange implementation here
     }

     async zpopmin(key) {
       // Your zpopmin implementation here
     }
   }

   module.exports = RedisAdapter;
   ```

4. **Dependency Injection**:

   In your Application Service and Use Case, inject the appropriate adapters/interfaces to interact with external systems. This allows you to switch between implementations (e.g., using Redis or another queuing system) without affecting your core logic.

   ```javascript
   // application/services/JobSchedulingService.js

   class JobSchedulingService {
     constructor(redisAdapter) {
       this.redisAdapter = redisAdapter;
     }

     async scheduleJob(jobType, jobData, timestamp) {
       // Use this.redisAdapter to interact with Redis
     }

     async processScheduledJobs() {
       // Use this.redisAdapter to interact with Redis
     }
   }

   // application/use-cases/ScheduleAndProcessJobs.js

   class ScheduleAndProcessJobs {
     constructor(jobSchedulingService) {
       this.jobSchedulingService = jobSchedulingService;
     }

     async execute(jobType, jobData, timestamp) {
       // Your use case logic here
       await this.jobSchedulingService.scheduleJob(jobType, jobData, timestamp);
       await this.jobSchedulingService.processScheduledJobs();
     }
   }
   ```

5. **Integration**:

   In your application's entry point (e.g., an HTTP controller or a CLI script), create instances of the Use Case and inject the necessary dependencies, including the RedisAdapter, to use the scheduling and processing functionality.

   ```javascript
   const ScheduleAndProcessJobs = require('./application/use-cases/ScheduleAndProcessJobs');
   const RedisAdapter = require('./application/adapters/RedisAdapter');

   // Create instances and inject dependencies
   const redisAdapter = new RedisAdapter();
   const jobSchedulingService = new JobSchedulingService(redisAdapter);
   const scheduleAndProcessJobs = new ScheduleAndProcessJobs(jobSchedulingService);

   // Example: Schedule a job
   const scheduledTime = new Date('2023-09-06T12:00:00Z');
   scheduleAndProcessJobs.execute('scheduledTask', { message: 'Scheduled task executed!' }, scheduledTime);
   ```

By following these steps, you've integrated the provided scheduling and processing functionality into an architecture with an Application Layer, Use Cases, Application Services, and Ports & Adapters. This design allows for flexibility in terms of using different external systems and dependencies while keeping your core logic organized and testable.