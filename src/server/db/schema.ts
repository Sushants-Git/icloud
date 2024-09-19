import { relations, sql } from "drizzle-orm";
import {
    index,
    integer,
    pgTableCreator,
    primaryKey,
    serial,
    text,
    timestamp,
    varchar,
    boolean,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `icloud_${name}`);

export const users = createTable("user", {
    id: varchar("id", { length: 255 })
        .$defaultFn(() => crypto.randomUUID())
        .notNull()
        .primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("email_verified", {
        mode: "date",
        withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    image: varchar("image", { length: 255 }),
});

export const authenticator = createTable(
    "authenticator",
    {
        id: serial("id").primaryKey(),
        credentialID: varchar("credential_id").notNull(),
        userId: varchar("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: varchar("provider_account_id").notNull(),
        credentialPublicKey: varchar("credential_public_key").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: varchar("credential_device_type").notNull(),
        credentialBackedUp: boolean("credential_backed_up").notNull(),
        transports: varchar("transports"),
    },
    (authenticator) => ({
        creadentialIdIdx: index("authenticator_credentialid_idx").on(
            authenticator.credentialID,
        ),
    }),
);

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
}));

export const accounts = createTable(
    "account",
    {
        userId: varchar("user_id", { length: 255 })
            .notNull()
            .references(() => users.id),
        type: varchar("type", { length: 255 })
            .$type<AdapterAccount["type"]>()
            .notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("provider_account_id", {
            length: 255,
        }).notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: varchar("token_type", { length: 255 }),
        scope: varchar("scope", { length: 255 }),
        id_token: text("id_token"),
        session_state: varchar("session_state", { length: 255 }),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
        userIdIdx: index("account_user_id_idx").on(account.userId),
    }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
    "session",
    {
        sessionToken: varchar("session_token", { length: 255 })
            .notNull()
            .primaryKey(),
        userId: varchar("user_id", { length: 255 })
            .notNull()
            .references(() => users.id),
        expires: timestamp("expires", {
            mode: "date",
            withTimezone: true,
        }).notNull(),
    },
    (session) => ({
        userIdIdx: index("session_user_id_idx").on(session.userId),
    }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
    "verification_token",
    {
        identifier: varchar("identifier", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires", {
            mode: "date",
            withTimezone: true,
        }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    }),
);

export const files = createTable(
    "files",
    {
        id: varchar("id", { length: 1024 }).notNull().primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        type: varchar("kind", { length: 255 }).notNull(),
        size: integer("size").notNull(),
        date: timestamp("date", { mode: "date", withTimezone: true }).default(
            sql`CURRENT_TIMESTAMP`,
        ),
        url: varchar("url", { length: 1024 }).notNull(),
        userId: varchar("user_id", { length: 255 })
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }), // Foreign key to users table
    },
    (files) => ({
        userIdIdx: index("files_user_id_idx").on(files.userId),
        nameIdx: index("files_name_idx").on(files.name),
        typeIdx: index("files_kind_idx").on(files.type),
    }),
);

export const notes = createTable(
    "notes",
    {
        id: varchar("id", { length: 1024 })
            .notNull()
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        title: varchar("title", { length: 255 }).notNull(),
        content: text("content").notNull(),
        userId: varchar("user_id", { length: 255 })
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        date: timestamp("date", { mode: "date", withTimezone: true }).default(
            sql`CURRENT_TIMESTAMP`,
        ),
    },
    (notes) => ({
        userIdIdx: index("notes_user_id_idx").on(notes.userId),
        titleIdx: index("notes_title_idx").on(notes.title),
    }),
);
