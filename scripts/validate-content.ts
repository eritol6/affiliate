import { getAllDocs } from "../src/lib/content.ts";

try {
  const docs = getAllDocs();
  console.info(`[content] Validation passed. Loaded ${docs.length} documents.`);
} catch (error) {
  console.error("[content] Validation failed.");
  throw error;
}
