import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import { TransportBannerSet } from "./TransportBannerSet.js";
import { transportSceneMap, transportScenes, type TransportLayout, type TransportSceneId } from "./transportTokens.js";

function DemoApp() {
  const [layout, setLayout] = useState<TransportLayout>("auto");
  const [selectedScene, setSelectedScene] = useState<TransportSceneId>("rail_platform_empty");

  const selectedMeta = useMemo(() => transportSceneMap[selectedScene], [selectedScene]);

  return (
    <div className="transport-demo">
      <header className="transport-demo__hero">
        <div className="transport-demo__hero-copy">
          <p className="transport-demo__eyebrow">Transport Banner Illustration Set</p>
          <h1>Eight transport scenes, rebuilt as layered SVG React components.</h1>
          <p className="transport-demo__lede">
            The set keeps the panoramic 1000 x 250 viewBox, the blue-gray palette, quiet side-view vehicles, and sparse amber accents from the source artwork.
          </p>
        </div>

        <div className="transport-demo__controls" aria-label="Gallery layout">
          <span className="transport-demo__controls-label">Layout</span>
          <div className="transport-demo__segmented" role="tablist" aria-label="Choose gallery layout">
            {[
              { label: "Responsive", value: "auto" as const },
              { label: "Stacked", value: "stacked" as const },
              { label: "Carousel", value: "carousel" as const },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={layout === option.value}
                className="transport-demo__segment"
                data-active={layout === option.value ? "true" : "false"}
                onClick={() => setLayout(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="transport-demo__main">
        <section className="transport-demo__gallery-section" aria-labelledby="transport-demo-gallery-heading">
          <div className="transport-demo__section-header">
            <div>
              <p className="transport-demo__eyebrow">Gallery</p>
              <h2 id="transport-demo-gallery-heading">All 8 scenes</h2>
            </div>
            <p className="transport-demo__hint">Click or tab through the scenes to inspect the selected state and hover parallax.</p>
          </div>

          <TransportBannerSet
            layout={layout}
            selectedSceneId={selectedScene}
            onSceneSelect={setSelectedScene}
          />
        </section>

        <section className="transport-demo__detail-band" aria-labelledby="transport-demo-selected-heading">
          <div className="transport-demo__detail-copy">
            <p className="transport-demo__eyebrow">Selected scene</p>
            <h2 id="transport-demo-selected-heading">{selectedMeta.title}</h2>
            <p>{selectedMeta.description}</p>
          </div>

          <div className="transport-demo__scene-list" aria-label="Scene quick list">
            {transportScenes.map((scene) => (
              <button
                key={scene.id}
                type="button"
                className="transport-demo__scene-chip"
                data-active={scene.id === selectedScene ? "true" : "false"}
                onClick={() => setSelectedScene(scene.id)}
              >
                {scene.title}
              </button>
            ))}
          </div>
        </section>

        <section className="transport-demo__notes" aria-labelledby="transport-demo-notes-heading">
          <div className="transport-demo__section-header">
            <div>
              <p className="transport-demo__eyebrow">Implementation notes</p>
              <h2 id="transport-demo-notes-heading">Simplifications kept on purpose</h2>
            </div>
          </div>

          <div className="transport-demo__note-grid">
            <article>
              <h3>Reduced micro-detail</h3>
              <p>Window counts, route-board text, distant building cuts, and individual passenger poses are simplified to keep the SVG readable and maintainable.</p>
            </article>
            <article>
              <h3>Shared primitives</h3>
              <p>Mountains, trees, figures, shelters, canopies, and vehicle bodies are reusable primitives rather than one-off traced vectors.</p>
            </article>
            <article>
              <h3>Responsive cropping</h3>
              <p>Tablet and mobile views crop outer scenery first by anchoring each scene around the primary vehicle instead of preserving every edge detail.</p>
            </article>
            <article>
              <h3>Motion scope</h3>
              <p>Interaction motion is limited to hover parallax and selected-state emphasis. Reduced-motion mode disables the parallax layer shifts.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

const mountNode = document.getElementById("transport-demo-root");

if (mountNode) {
  createRoot(mountNode).render(<DemoApp />);
}
