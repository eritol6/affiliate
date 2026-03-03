import { redirect } from "next/navigation";

export default function LegacyCompareIndexRedirectPage() {
  redirect("/comparisons");
}
