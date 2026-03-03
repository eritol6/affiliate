type FootprintItem = {
  name: string;
  footprint: string;
};

type FootprintVisualProps = {
  a?: FootprintItem;
  b?: FootprintItem;
  nameA?: string;
  footprintA?: string;
  widthA?: number | string;
  depthA?: number | string;
  nameB?: string;
  footprintB?: string;
  widthB?: number | string;
  depthB?: number | string;
};

function parseFootprint(footprint: string) {
  const values = footprint.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (values.length < 2) return null;

  const [width, depth] = values;
  if (!Number.isFinite(width) || !Number.isFinite(depth) || width <= 0 || depth <= 0) return null;

  return { width, depth, area: width * depth };
}

function getRectSize(item: { width: number; depth: number; area: number }, maxArea: number, maxSize = 220) {
  const areaScale = Math.sqrt(item.area / maxArea);
  const shapeMax = Math.max(item.width, item.depth);
  const maxSide = maxSize * areaScale;

  return {
    width: Math.max(56, (item.width / shapeMax) * maxSide),
    height: Math.max(56, (item.depth / shapeMax) * maxSide),
  };
}

function coerceNumber(value: number | string | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const match = value.match(/\d+(?:\.\d+)?/);
    if (!match) return null;
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function FootprintCard({
  name,
  footprint,
  rect,
  parsed,
}: {
  name: string;
  footprint: string;
  rect: { width: number; height: number } | null;
  parsed: { width: number; depth: number; area: number } | null;
}) {
  const footprintLabel = parsed ? `${parsed.width}" x ${parsed.depth}"` : footprint;
  const areaLabel = parsed ? `${Math.round(parsed.area).toLocaleString()} sq in` : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-900">{name}</p>
      <p className="mt-1 text-xs text-slate-600">{footprint}</p>
      <p className="mt-1 text-[11px] font-medium text-slate-500">{parsed ? `Parsed: ${footprintLabel}` : "Could not parse dimensions"}</p>
      <div className="mt-4 flex min-h-[180px] items-center justify-center">
        {rect ? (
          <div
            style={{ width: `${rect.width}px`, height: `${rect.height}px` }}
            className="flex flex-col items-center justify-center rounded-md border-2 border-blue-500 bg-blue-100 px-2 text-center text-xs font-semibold text-slate-900 shadow-sm"
          >
            <span className="rounded bg-white/90 px-2 py-0.5">{footprintLabel}</span>
            {areaLabel ? <span className="mt-1 rounded bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-700">{areaLabel}</span> : null}
          </div>
        ) : (
          <p className="text-xs font-medium text-slate-700">Footprint available: {footprint}</p>
        )}
      </div>
    </div>
  );
}

export function FootprintVisual({ a, b, nameA, footprintA, widthA, depthA, nameB, footprintB, widthB, depthB }: FootprintVisualProps) {
  const numericWidthA = coerceNumber(widthA);
  const numericDepthA = coerceNumber(depthA);
  const numericWidthB = coerceNumber(widthB);
  const numericDepthB = coerceNumber(depthB);

  const fromNumbersA =
    numericWidthA && numericDepthA ? { name: nameA ?? "Item A", footprint: `${numericWidthA}" W x ${numericDepthA}" D` } : null;
  const fromNumbersB =
    numericWidthB && numericDepthB ? { name: nameB ?? "Item B", footprint: `${numericWidthB}" W x ${numericDepthB}" D` } : null;

  const itemA: FootprintItem = a ?? fromNumbersA ?? { name: nameA ?? "Item A", footprint: footprintA ?? "" };
  const itemB: FootprintItem = b ?? fromNumbersB ?? { name: nameB ?? "Item B", footprint: footprintB ?? "" };

  const parsedA = parseFootprint(itemA.footprint);
  const parsedB = parseFootprint(itemB.footprint);

  if (!parsedA || !parsedB) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <FootprintCard name={itemA.name} footprint={itemA.footprint} rect={null} parsed={null} />
        <FootprintCard name={itemB.name} footprint={itemB.footprint} rect={null} parsed={null} />
      </div>
    );
  }

  const maxArea = Math.max(parsedA.area, parsedB.area);
  const rectA = getRectSize(parsedA, maxArea);
  const rectB = getRectSize(parsedB, maxArea);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FootprintCard name={itemA.name} footprint={itemA.footprint} rect={rectA} parsed={parsedA} />
      <FootprintCard name={itemB.name} footprint={itemB.footprint} rect={rectB} parsed={parsedB} />
    </div>
  );
}
