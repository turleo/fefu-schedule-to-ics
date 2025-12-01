await Bun.build({
  entrypoints: ["./src/index.ts"],
  target: "bun",
  outdir: "./out",
  env: "BUILD_INFO_PUBLIC_*",
  bytecode: true,
  format: "cjs",
});
