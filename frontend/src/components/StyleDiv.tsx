import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export function StyleDiv(props: any) {
  const [isOpen, setIsOpen] = useState(false);

  const featureHandlers: { [key: string]: string } = {
    arrows: "Arrows",
    singleBonds: "Single Bonds",
    hidden: "Hidden",
    showNonBonded: "Show Non-Bonded",
    style: "Style",
    opacity: "Opacity",
    color: "Color",
    radius: "Radius",
    thickness: "Thickness",
    ribbon: "Ribbon",
    tubes: "Tubes",
    width: "Width",
    scale: "Scale",
    wireframe: "Wireframe",
  };

  const hasFeature = (feature: string) =>
    props.styleSpec[feature] !== undefined;

  const renderFeatureInput = (feature: string) => {
    if (!hasFeature(feature)) {
      return null;
    }

    const renderRadioButton = () => (
      <input
        type="radio"
        checked={props.styleSpec[feature]}
        onClick={() => props.setStyleSpec(feature, !props.styleSpec[feature])}
      />
    );

    const renderSelectOptions = () =>
      ["trace", "oval", "rectangle", "parabola", "edged"].map(
        (option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        )
      );

    const renderNumberInput = (max: number, step: number, prop: string) => (
      <input
        type="number"
        step={step}
        min="0"
        max={max}
        value={props.styleSpec[prop]}
        onChange={(event) =>
          props.setStyleSpec(prop, Number(event.target.value))
        }
      />
    );

    const renderOpacityInput = () => renderNumberInput(1, 0.05, "opacity");

    const renderColorInput = () => (
      <>
        <input
          type="color"
          id="colorInput"
          value={props.styleSpec.color as string}
          onChange={(event) => props.setStyleSpec("color", event.target.value)}
        />
        <p className="mr-2">Spectrum</p>
        <input
          type="radio"
          checked={props.styleSpec.color === "spectrum"}
          onClick={() => {
            const newColor =
              props.styleSpec.color !== "spectrum" ? "spectrum" : "#000000";
            props.setStyleSpec("color", newColor);
          }}
        />
      </>
    );

    return (
      <div key={feature}>
        <div className="flex mb-1">
          <p className="mr-2">{featureHandlers[feature]}</p>
          {feature === "color" ? (
            renderColorInput()
          ) : feature === "style" ? (
            <select
              onChange={(event) => {
                props.setStyleSpec("style", event.target.value);
              }}
              className="mx-4 min-w-100 bg-transparent"
              value={props.styleSpec.style}
            >
              {renderSelectOptions()}
            </select>
          ) : feature === "opacity" ? (
            renderOpacityInput()
          ) : feature === "radius" ||
            feature === "width" ||
            feature === "thickness" ||
            feature === "scale" ? (
            renderNumberInput(5, feature === "thickness" ? 0.1 : 0.5, feature)
          ) : (
            renderRadioButton()
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex content-between my-1" data-testid="chevronIcon">
        <p>{props.name}</p>
        {isOpen ? (
          <ChevronUpIcon
            data-testid="chevronIcon"
            className="w-4"
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <ChevronDownIcon className="w-4" onClick={() => setIsOpen(!isOpen)} />
        )}
      </div>
      {isOpen && (
        <div>
          <div>
            {Object.keys(featureHandlers).map((feature) =>
              [
                "arrows",
                "singleBonds",
                "showNonBonded",
                "hidden",
                "ribbon",
                "tubes",
                "wireframe",
                "width",
                "thickness",
                "color",
                "opacity",
                "scale",
                "radius",
                "style",
              ].includes(feature) && hasFeature(feature)
                ? renderFeatureInput(feature)
                : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
