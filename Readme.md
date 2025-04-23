# NestJS Semi-Monolith Application

## Architecture

This application follows a layered architecture with modules deployed as separate Docker containers.

### Layers

*   **Presentation Layer:** Handles user interface and API endpoints (GraphQL, REST).
*   **Application Layer:** Contains the application logic and orchestrates the domain layer.
*   **Domain Layer:** Contains the core business logic and domain models.
*   **Infrastructure Layer:** Provides implementation details for external systems, such as databases (Prisma), message queues, and Docker containers.

### Modules

*   **Auth Module:** Handles authentication and authorization.
*   **User Module:** Manages user accounts and profiles.
*   **Product Module:** Manages product information.
*   **Order Module:** Handles order processing and fulfillment.

## Technologies

*   NestJS
*   Zod
*   Prisma
*   GraphQL
*   Websockets
*   Docker

## Getting Started

### Prerequisites

*   Node.js
*   Docker
*   Docker Compose

### Installation

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Configure environment variables (see `.env.example` in each module).
4.  Start the Docker containers: `docker-compose up -d`

### Running the Application

1.  Access the application through the specified ports for each module.
2.  Use GraphQL Playground for API queries.
3.  Connect to Websockets endpoints for real-time communication.

## Development

### Module Structure

Each module should have the following structure:

*   `src/`: Contains the source code for the module.
*   `src/presentation/`: Contains the presentation layer (controllers, resolvers).
*   `src/application/`: Contains the application layer (services).
*   `src/domain/`: Contains the domain layer (entities, value objects).
*   `src/infrastructure/`: Contains the infrastructure layer (Prisma, Docker).
*   `Dockerfile`: Defines the Docker image for the module.
*   `.env.example`: Contains example environment variables.

### Docker

Each module should have its own `Dockerfile` for containerization. Use `docker-compose.yml` to orchestrate the containers.

### Prisma

Configure Prisma for each module to connect to the database. Use Prisma Migrate for database schema management.

### Zod

Use Zod for input validation in the presentation layer.

### GraphQL

Implement GraphQL resolvers in the presentation layer to handle API queries.

### Websockets

Implement Websockets endpoints for real-time communication.

## Contributing

Please follow the contributing guidelines.

## License

MIT