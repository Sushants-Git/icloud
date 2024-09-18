"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";

import { type AppRouter } from "~/server/api/root";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
    if (typeof window === "undefined") {
        // Server: always make a new query client
        return createQueryClient();
    }
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// TODO : This key is set dynamically, but since the 
// x-api-key header is necessary in every request i would need to 
// make sure that the header is set before any request
// that includes requests made to fetch inital data
// making me use the useApiKey hook before every request.
// Which is bad, so gotta fix this later.
// this was meant to be (let XAPIKey: string = ""; 

export let XApiKey: string = "f7695f9920bf637b831a2c2d497182d86f31216c4b941f12408b5501cdbf3e05";

export const setXApiKey = (apiKey: string) => {
    XApiKey = apiKey;
}

export function TRPCReactProvider(props: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                loggerLink({
                    enabled: (op) =>
                        process.env.NODE_ENV === "development" ||
                        (op.direction === "down" && op.result instanceof Error),
                }),
                unstable_httpBatchStreamLink({
                    transformer: SuperJSON,
                    url: getBaseUrl() + "/api/trpc",
                    headers: () => {
                        const headers = new Headers();
                        headers.set("x-trpc-source", "nextjs-react");
                        headers.set("x-api-key", XApiKey);
                        return headers;
                    },
                }),
            ],
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <api.Provider client={trpcClient} queryClient={queryClient}>
                {props.children}
            </api.Provider>
        </QueryClientProvider>
    );
}

function getBaseUrl() {
    if (typeof window !== "undefined") return window.location.origin;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
}
