import * as San from "./san";

// export for use in Node.js
export * from "./san";
export * from "./anode";
export * from "./expr";

// export as browser global variable
declare global {
    const san: typeof San;
}
