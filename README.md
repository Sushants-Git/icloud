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

4. Configure Environment
    - Add `.env`, you can take a look at `.env.example` for reference.

5. Set Up the Database
```bash
turbo dev db:push
```

6. Start the server
```bash
turbo run dev
```

7. Build the Project
```bash
turbo build
```

## Assumptions
- I initially set up the x-api-key to be generated dynamically from the server when a user logs in. However, this meant I had to ensure the key was set up before every request, which could slow things down. So, I decided to abandon that approach. ( I am assuming the main purpsose of the `x-api-key` is just to be able to query the `db` externally without loging in, thought i would let you know this since there will be some deadcode regarding this in the codebase)

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
curl -X GET "https://icloud-huddle01.vercel.app/api/trpc/user.getAllUsers" \
     -H "Content-Type: application/json" \
     -H "x-api-key: f7695f9920bf637b831a2c2d497182d86f31216c4b941f12408b5501cdbf3e05"
```

- Since the api key was asked to be hardcoded, i am also putting it here as well.
