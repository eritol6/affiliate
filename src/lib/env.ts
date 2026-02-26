const AMAZON_TAG_PATTERN = /^[a-z0-9-]{3,64}$/i;

type ValidatedEnv = {
  NEXT_PUBLIC_AMAZON_TAG: string;
  CHECKLIST_KEY?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  MERCHANT_WALMART_SUBTAG?: string;
  MERCHANT_TARGET_SUBTAG?: string;
  MERCHANT_OTHER_SUBTAG?: string;
};

let cachedEnv: ValidatedEnv | null = null;

function normalizeSiteUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return url;
  }
}

function validateEnvInternal(source: NodeJS.ProcessEnv): ValidatedEnv {
  const issues: string[] = [];
  const amazonTag = source.NEXT_PUBLIC_AMAZON_TAG?.trim();

  if (!amazonTag) {
    issues.push("NEXT_PUBLIC_AMAZON_TAG is required and cannot be empty.");
  } else if (!AMAZON_TAG_PATTERN.test(amazonTag)) {
    issues.push("NEXT_PUBLIC_AMAZON_TAG format looks invalid.");
  }

  const siteUrl = source.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    try {
      new URL(siteUrl);
    } catch {
      issues.push("NEXT_PUBLIC_SITE_URL must be a valid absolute URL when set.");
    }
  }

  if (issues.length > 0) {
    const message = `[env] Invalid environment configuration:\n- ${issues.join("\n- ")}`;
    throw new Error(message);
  }

  return {
    NEXT_PUBLIC_AMAZON_TAG: amazonTag!,
    CHECKLIST_KEY: source.CHECKLIST_KEY?.trim() || undefined,
    NEXT_PUBLIC_SITE_URL: siteUrl ? normalizeSiteUrl(siteUrl) : undefined,
    MERCHANT_WALMART_SUBTAG: source.MERCHANT_WALMART_SUBTAG?.trim() || undefined,
    MERCHANT_TARGET_SUBTAG: source.MERCHANT_TARGET_SUBTAG?.trim() || undefined,
    MERCHANT_OTHER_SUBTAG: source.MERCHANT_OTHER_SUBTAG?.trim() || undefined,
  };
}

export function getEnv(): ValidatedEnv {
  if (cachedEnv) return cachedEnv;
  cachedEnv = validateEnvInternal(process.env);
  return cachedEnv;
}
