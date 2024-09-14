import { NextResponse } from "next/server";
import { generateOpenApiDocument } from "better-trpc-openapi";
import { appRouter } from "~/server/api/root"; 

export async function GET() {
    try {
        const openApiSchema = generateOpenApiDocument(appRouter, {
            title: "icloud-huddle01 tRPC API",
            version: "1.0.0",
            baseUrl: "http://localhost:3000/api",
            docsUrl: "https://example.com/api-docs", // Replace with your actual docs URL
            tags: ["apiKey", "user"],
        });

        return NextResponse.json(openApiSchema);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to generate OpenAPI schema" },
            { status: 500 },
        );
    }
}
