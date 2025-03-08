import esbuild from "esbuild";

esbuild
  .build({
    loader: { ".node": "file" },
    entryPoints: ["./src/index.ts"], // Entry point for your app
    // outfile: "dist/index.js", // Output bundled file
    outdir: "dist",
    bundle: true, // Bundle the application
    platform: "node", // Platform for Node.js
    target: "node18", // Node.js version to target (use the version you're running)
    format: "esm", // Output CommonJS
    //sourcemap: true, // Generate sourcemaps for debugging
    //external: ["dotenv", "fs", "path", "express"], // External dependencies
    packages: "external",
  })
  .catch(() => process.exit(1));
