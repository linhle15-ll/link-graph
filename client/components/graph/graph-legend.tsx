import { EDGE_COLORS } from "./relation-edge";

/** Bottom-right legend: edge colors → relation meaning. */
export function GraphLegend() {
  return (
    <div className="absolute right-4 bottom-24 z-10 flex flex-col gap-1.5 rounded-md bg-white px-3 py-2 shadow-sm">
      <span className="flex items-center gap-2 text-xs">
        <span
          className="h-0.5 w-6 rounded-full"
          style={{ backgroundColor: EDGE_COLORS.agrees }}
        />
        Agrees
      </span>
      <span className="flex items-center gap-2 text-xs">
        <span
          className="h-0.5 w-6 rounded-full"
          style={{ backgroundColor: EDGE_COLORS.disagrees }}
        />
        Disagrees
      </span>
    </div>
  );
}
