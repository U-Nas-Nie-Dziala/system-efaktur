import { defineConfig } from "tsdown";

export default defineConfig({
    clean: true,
    entry: ["./src/index.ts"],
    dts: true,
    outDir: "dist",
    sourcemap: true,
    format: ["commonjs"],
    watch: true,
});
