# Personal icloud

Link : [icloud-huddle01.vercel.app](https://icloud-huddle01.vercel.app)

## Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/Sushants-Git/icloud
```

2. Change the working directory
```bash
cd icloud
```

3. Install dependencies
```bash
bun install
```

4. Add `.env`, you can take a look at `.env.example` for reference.

5. Setup the db
```bash
turbo dev db:push
```

6. Start the server
```bash
turbo run dev
```

7. To Build
```bash
turbo build
```

## Assumptions
- I am assuming that the `x-api-key` was meant to be mostly so that someone who has proper access can access the data without needing to login.
- Therefore i did not focus much on it's handling, initally i set it up dynamically whenever the user logged in and then send it with every subsiquient request, but then i realised then i would need to make sure that no request goes out before it, since they all would need the `x-api-key` header, making the request, response cycle kinda slow, so gave up on that.

## DB Schema

## Database Schema Overview

1. **Users Table**:
   - Stores user information including `id`, `name`, `email`, `emailVerified`, and `image`.
   - The `id` is the primary key.
   - Relationships:
     - Users have many associated `accounts` and `sessions`.
   
2. **Authenticator Table**:
   - Contains authentication-related information such as `credentialID`, `userId`, and other credential details.
   - References `userId` from the `users` table.
   - Index on `credentialID` for fast lookup.

3. **Accounts Table**:
   - Stores external account details for users, such as `provider`, `providerAccountId`, and `tokens`.
   - Compound primary key (`provider`, `providerAccountId`).
   - References `userId` from the `users` table.

4. **Sessions Table**:
   - Stores session information like `sessionToken`, `userId`, and `expires`.
   - References `userId` from the `users` table.

6. **Files Table**:
   - Stores files uploaded by users, with `id`, `name`, `type`, `size`, `date`, and `url`.
   - References `userId` from the `users` table.

7. **Notes Table**:
   - Contains user notes with `id`, `title`, `content`, `userId`, and `date`.
   - References `userId` from the `users` table.


## How to call the `/api/users`

```bash
curl -X GET "http://localhost:3000/api/trpc/user.getAllUsers" \
     -H "Content-Type: application/json" \
     -H "x-api-key: f7695f9920bf637b831a2c2d497182d86f31216c4b941f12408b5501cdbf3e05"
```

- Since the api key was asked to be hardcoded, i am also putting it here.
