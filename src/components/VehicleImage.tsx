"use client";

import { useState } from "react";
import type { BodyStyle } from "@/lib/types";

// Generic side profiles used only when a model has no approved image yet.
// They never pretend to be the actual car.
const SHAPES: Record<BodyStyle, string> = {
  sedan:
    "M18 104c-6 0-9-4-8-10l4-16c2-6 7-10 14-11l58-7c18-2 34-14 50-24 12-8 26-12 42-12h70c22 0 40 7 58 20l24 17c6 4 12 6 19 7l22 4c8 1 13 7 13 15v7c0 6-4 10-10 10",
  coupe:
    "M18 104c-6 0-9-4-8-10l4-14c2-7 8-11 15-12l64-8c20-3 36-16 54-27 12-7 24-10 38-10h52c22 0 42 9 60 23l20 16c6 5 13 7 20 8l20 3c8 1 13 7 13 15v6c0 6-4 10-10 10",
  suv:
    "M16 106c-6 0-9-4-8-10l3-24c1-8 7-13 15-14l34-4c10-1 18-6 26-14l18-18c8-8 18-12 30-12h146c14 0 24 4 34 14l26 28c4 5 10 7 16 8l22 3c8 1 13 7 13 15v14c0 6-4 10-10 10",
  truck:
    "M14 106c-6 0-9-4-8-10l2-22c1-8 6-13 14-14l58-6V34c0-6 4-10 10-10h96c10 0 18 4 24 11l30 34h96c8 0 14 6 14 14v13c0 6-4 10-10 10",
  van:
    "M16 106c-6 0-9-4-8-10l3-28c2-14 10-26 24-34 18-10 40-16 70-16h170c16 0 28 6 38 18l30 36c4 5 10 7 16 8l12 2c8 1 13 7 13 15v9c0 6-4 10-10 10",
};

function Silhouette({ style }: { style: BodyStyle }) {
  return (
    <svg viewBox="0 0 400 140" fill="none" aria-hidden="true">
      <path d={SHAPES[style]} stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 106h68M182 106h106M344 106h22" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <circle cx="94" cy="106" r="24" stroke="currentColor" strokeWidth="5" />
      <circle cx="316" cy="106" r="24" stroke="currentColor" strokeWidth="5" />
      <path d="M24 128h352" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".5" />
    </svg>
  );
}

export function VehicleImage({
  src,
  alt,
  bodyStyle,
  priority = false,
}: {
  src: string | null;
  alt: string;
  bodyStyle: BodyStyle;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;
  return (
    <div className="vimg">
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="ph">
          <Silhouette style={bodyStyle} />
          <span className="ph-label">Photo coming soon</span>
        </div>
      )}
    </div>
  );
}
