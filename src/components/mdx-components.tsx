import Link from "next/link";

import { BuyButton } from "@/components/BuyButton";
import { ComparisonWinnerCard } from "@/components/ComparisonWinnerCard";
import { FootprintVisual } from "@/components/FootprintVisual";

export const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => <h2 className="mt-8 text-2xl font-semibold text-slate-900" {...props} />,
  h3: (props: React.ComponentProps<"h3">) => <h3 className="mt-6 text-xl font-semibold text-slate-900" {...props} />,
  p: (props: React.ComponentProps<"p">) => <p className="mt-3 text-base leading-7 text-slate-700" {...props} />,
  ul: (props: React.ComponentProps<"ul">) => <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700" {...props} />,
  ol: (props: React.ComponentProps<"ol">) => <ol className="mt-3 list-decimal space-y-1 pl-5 text-slate-700" {...props} />,
  a: (props: React.ComponentProps<"a">) => {
    const href = props.href ?? "#";
    if (href.startsWith("/")) {
      return <Link href={href} className="text-slate-900 underline" {...props} />;
    }
    return <a className="text-slate-900 underline" target="_blank" rel="noopener noreferrer" {...props} />;
  },
  BuyButton,
  ComparisonWinnerCard,
  FootprintVisual,
};
