"use client";

import type { StoneMaterial } from "@/data/types";
import ChapterIntro from "./chapter/ChapterIntro";
import ShowcasePair from "./chapter/ShowcasePair";

interface StoneSectionProps {
  material: StoneMaterial;
  index: number;
}

/**
 * One visual chapter per material: the cinematic opening shot, followed by
 * a pair of vertical photographs (a swipe slider on mobile). Specimen and
 * technical data remain in /src/data/stones.ts but are not rendered here.
 */
export default function StoneSection({ material, index }: StoneSectionProps) {
  return (
    <>
      <ChapterIntro material={material} index={index} />
      <ShowcasePair material={material} />
    </>
  );
}
