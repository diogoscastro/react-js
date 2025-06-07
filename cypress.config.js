import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // ajuste aqui se a porta for diferente
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

