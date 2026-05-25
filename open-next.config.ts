import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

const config = defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});

config.default.minify = true;

export default config;
