**1. Introduction**

**1.1 Purpose**  
This Software Requirements Specification (SRS) describes the functional and non-functional requirements for the Donation & Messaging application. It defines user roles, item management workflows, and real-time chat capabilities, referencing existing Mongoose models (`User`, `Item`, `Chat`, `Message`).

**1.2 Scope**  
The application enables donors to list items for donation, receivers to request and claim items, and supports in-app messaging between users. Administrative roles manage user verification and system-wide settings.

**1.3 Definitions, Acronyms, and Abbreviations**

- **User**: Any individual who registers—roles include `receiver`, `donor`, `admin`, `superadmin`.
- **Item**: A physical object offered for donation.
- **Chat**: Conversation thread identified by `chatId`.
- **Message**: Individual text element in a chat session.

**2. Overall Description**

**2.1 Product Perspective**  
Built with Next.js and MongoDB using Mongoose schemas:

- `User`: handles identity and profile (see `UserSchema`).
- `Item`: models donation listings and lifecycle status (`ItemSchema`).
- `Chat` & `Message`: provide messaging service (`ChatSchema`, `MessageSchema`).

**2.2 User Classes and Characteristics**

- **Receiver**: Browses, requests, and picks up items.
- **Donor**: Creates, updates, and manages donation items.
- **Admin**: Verifies users, oversees content and resolves disputes.
- **Superadmin**: Full system control, can manage admins.

**2.3 Operating Environment**

- Server: Node.js 22, Next.js 15.3.1, MongoDB 6.15.0
- Client: Next.js, React 19 with Tailwind CSS.
- RESTful API endpoints secured via JWT.

**2.4 Design Constraints**

- Follow OWASP guidelines for password and token storage (`password`, `verificationToken`).
- Image upload limit: max 4 per `Item` (enforced by `validateImageLimit`).

**2.5 Assumptions and Dependencies**

- Users have verified email prior to donation (controlled by `isVerified`).
- Notification service (email/SMS) for request and pickup updates.

**3. Specific Requirements**

**3.1 Functional Requirements**

**3.1.1 User Management**

- **Registration & Authentication**:
  - Fields: `name`, `email`, `password`, `role` (default `receiver`).
  - Email verification workflow: generate/store `verificationToken`, set `verifiedAt` on success.
- **Profile Management**: optional fields (`country`, `city`, `address`, social links).
- **Roles & Permissions**:
  - Donor: `createItem()`, `updateItem()`, `softDeleteItem()`.
  - Receiver: `requestItem()`, `cancelRequest()`, `confirmPickup()`.
  - Admin/Superadmin: `verifyUser()`, `overrideStatuses()`, `manageRoles()`.

**3.1.2 Item Lifecycle**

- **Create Item** (`POST /items`): use `ItemSchema` fields (`title`, `description`, `quantity`, `category`, `condition`, `images`).
- **View Items** (`GET /items?status=available`): filter by `status` enum.
- **Request Flow**:
  - Receiver adds self to `requesters` array; `isRequested = true`, `status = 'requested'`.
  - Donor accepts: set `requestAccepted = true`, `isAccepted = true`, `receiver` populated, `status = 'claimed'`.
  - Receiver picks up: donor confirms pickup → `isClaimed = true`, `status = 'picked'`.
  - Final donation: receiver confirms → `isPicked = true`, `isDonated = true`, `status = 'donated'`.
- **Cancel & Soft Delete**: donor sets `isCancelled = true`, `status = 'inactive'`, item hidden from listings.

**3.1.3 Chat & Messaging**

- **Chat Initialization** (`POST /chats`): create `Chat` with unique `chatId` and `participants` array.
- **Send Message** (`POST /messages`): add new document to `Message` collection, index by `chatId`, store `sender`, `text`, `timestamp`.
- **Fetch Messages** (`GET /messages?chatId=<id>`): sorted by `timestamp` descending.

**3.2 Non-Functional Requirements**

**3.2.1 Performance**

- API response time < 200ms for read operations under typical load.
- Message retrieval uses index on `{ chatId, timestamp }` for efficient queries.

**3.2.2 Security**

- Passwords hashed with bcrypt.
- JWT tokens for session management; token expiration enforced.
- Rate-limiting on authentication and messaging endpoints.

**3.2.3 Usability**

- Responsive UI in React with Tailwind CSS.
- Re-fetch the latest chats every few second via RESTful API(websocket don't work with Next.js).

**3.2.4 Scalability**

- Horizontal scaling of Node.js instances.
- MongoDB replica sets for high availability.

**3.2.5 Maintainability**

- Code organized by feDature modules (User, Item, Chat, Message).
- Comprehensive unit and integration tests for each schema and endpoint.

**4. Appendices**

- **Model References**:
  - User: see `UserSchema` definition.
  - Item: see `ItemSchema` with lifecycle flags.
  - Chat & Message: see respective schemas and indexes.

**Revision History**  
| Date | Version | Description |
|------------|---------|------------------------------------|
| 2025-04-30 | 1.0 | Initial draft of SRS document |
