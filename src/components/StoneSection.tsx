"use client";

import type { StoneMaterial, StoneSpecimen } from "@/data/types";
import ChapterIntro from "./chapter/ChapterIntro";
import MacroPanel from "./chapter/MacroPanel";
import HorizontalGallery from "./chapter/HorizontalGallery";
import SpecimenList from "./chapter/SpecimenList";
import TechnicalDataTable from "./chapter/TechnicalDataTable";
import ProvenanceNote from "./chapter/ProvenanceNote";

interface StoneSectionProps {
  material: StoneMaterial;
  index: number;
  onSelectSpecimen: (specimen: StoneSpecimen) => void;
}

const MACRO_LABEL: Record<string, string> = {
  turquoise: "Macro Texture",
  garnet: "Macro Crystal",
};

/**
 * One full visual chapter per material — orchestrates the cinematic intro,
 * a second visual beat (a macro detail panel or a horizontal gallery,
 * depending on the material), the specimen list, and a technical data
 * reference. The experimental material (meteorite) takes a lighter path:
 * intro + a provenance note only, no specimen list or spec table, since
 * its documentation is not yet verified.
 */
export default function StoneSection({ material, index, onSelectSpecimen }: StoneSectionProps) {
  if (material.isExperimental) {
    return (
      <>
        <ChapterIntro material={material} index={index} />
        <ProvenanceNote note={material.description[1] ?? material.description[0]} />
      </>
    );
  }

  const firstSpecimen = material.specimens[0];
  const macroImage = firstSpecimen?.gallery[0] ?? material.heroImage;
  const galleryImages = [
    material.heroImage,
    ...material.specimens.flatMap((s) => [s.mainImage, ...s.gallery]),
  ];

  return (
    <>
      <ChapterIntro material={material} index={index} />

      {material.visualTreatment === "horizontal" ? (
        <HorizontalGallery images={galleryImages} label="The Collection, in Detail" />
      ) : (
        <MacroPanel
          image={macroImage}
          label={MACRO_LABEL[material.slug] ?? "Macro Detail"}
          caption={material.highlights[0]}
        />
      )}

      <SpecimenList specimens={material.specimens} onSelectSpecimen={onSelectSpecimen} />
      <TechnicalDataTable specimens={material.specimens} />
    </>
  );
}
