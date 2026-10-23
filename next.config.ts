import type { NextConfig } from "next";
import dns from "node:dns";

// Ensure Node server resolves Supabase domains using reliable public DNS (prevents local ISP/router DNS failures)
try {
  if (typeof dns?.setServers === "function") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    const origLookup = dns.lookup;
    dns.lookup = function (hostname: any, options: any, callback: any) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      if (typeof hostname === "string" && hostname.includes("supabase.co")) {
        dns.resolve4(hostname, (err, addrs) => {
          if (err || !addrs || addrs.length === 0) {
            return origLookup(hostname, options, callback);
          }
          if (options && options.all) {
            callback(
              null,
              addrs.map((a) => ({ address: a, family: 4 }))
            );
          } else {
            callback(null, addrs[0], 4);
          }
        });
        return;
      }
      return origLookup(hostname, options, callback);
    } as any;
  }
} catch {
  // Ignore in environments where node:dns is not available
}

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "*.supabase.co" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
