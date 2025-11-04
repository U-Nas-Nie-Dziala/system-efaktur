import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["./src/index.ts"],
    outDir: "dist",
    format: ["cjs"],
    target: "node18",
    sourcemap: true,
    clean: true,
    dts: true,
    watch: false,
    // outputOptions: {
    //     esModule: true,
    // },
});
