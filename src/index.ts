import {
  bearerAuth,
  StreamableHTTPTransport,
  simpleMcpAuthRouter,
} from "@hono/mcp";
import { Hono } from "hono";
import { cors } from "hono/cors";
import mcp from "./mcp.ts";
import { json } from "zod/v4";

const app = new Hono().use(
  cors({
    origin: (origin) => origin,
    credentials: true,
  }),
);



const transport = new StreamableHTTPTransport();

app.all(
  "/mcp",
  bearerAuth({
    verifyToken: (token:string) => {
      return !!token;  // PostGREST request will verify token
    },
    // The correct option name for customizing missing-auth responses
    noAuthenticationHeader: {
      wwwAuthenticateHeader: (c) => {
        const protocol = c.req.header("x-forwarded-proto") || "https";
        const host = c.req.header("x-forwarded-host") || c.req.header("host");
        const metadataUrl = `${protocol}://${host}/.well-known/oauth-protected-resource`;

        // This challenge is what triggers Claude to fetch your metadata
        return `Bearer realm="mcp", resource_metadata="${metadataUrl}"`;
      }
    }
  }),
  async (c) => {
    console.log(mcp.isConnected() ? "MCP connected" : "MCP not connected");

    if (!mcp.isConnected()) {
      await mcp.connect(transport);
    }
    return transport.handleRequest(c);
  }
);


// OAuth protected resource metadata
app.get("/.well-known/oauth-protected-resource", (c) => {
  // Get the resource URL from x-forwarded-host or construct from request
  const url = new URL(c.req.url);
  const protocol = c.req.header("x-forwarded-proto") || url.protocol.slice(0, -1); // removes the ':'
  const host = c.req.header("x-forwarded-host") || c.req.header("host") || url.host;

  const resource = `${protocol}://${host}`;
  return c.json({
    resource,
    authorization_servers: [
      "https://jdnlvjebzatlybaysdcp.supabase.co/auth/v1"
    ],
    bearer_methods_supported: ["header"]
    
  });
});

// Catch-all route for 404
app.all("*", (c) => {
  console.log(`404 - Route not found: ${c.req.url}`);
  return c.json({ error: "Not Found" }, 404);
});

export default app;
