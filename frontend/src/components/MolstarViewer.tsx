import { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import { createPluginUI } from "molstar/lib/mol-plugin-ui/react18";
import "molstar/lib/mol-plugin-ui/skin/light.scss";
import { createRef, useEffect, useState } from "react";
// import Reader from "./Reader";
import { CloseIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import { PostprocessingParams } from "molstar/lib/mol-canvas3d/passes/postprocessing";
import { AnimateModelIndex } from "molstar/lib/mol-plugin-state/animation/built-in/model-index";
import { PresetStructureRepresentations } from "molstar/lib/mol-plugin-state/builder/structure/representation-preset";
import { StructureComponentManager } from "molstar/lib/mol-plugin-state/manager/structure/component";
import {
  DefaultPluginUISpec,
  PluginUISpec,
} from "molstar/lib/mol-plugin-ui/spec";
import { PluginCommands } from "molstar/lib/mol-plugin/commands";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { PluginLayoutControlsDisplay } from "molstar/lib/mol-plugin/layout";
import { Color } from "molstar/lib/mol-util/color";
import { ColorNames } from "molstar/lib/mol-util/color/names";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { MdFullscreen } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import { setSelectedMols } from "../redux/actions/settings";

declare global {
  interface Window {
    molstar?: PluginUIContext;
  }
}
const MySpec: PluginUISpec = {
  ...DefaultPluginUISpec(),
  canvas3d: {
    camera: { mode: "orthographic" },
    renderer: {
      backgroundColor: 0x303030 as Color,
    },
    postprocessing: {
      occlusion: {
        name: "off",
        params: {},
      },
    },
  },
  animations: [AnimateModelIndex],
  layout: {
    initial: {
      isExpanded: false,
      showControls: true,
      regionState: {
        top: "hidden",
        left: "hidden",
        right: "hidden",
        bottom: "hidden",
      },
      controlsDisplay: "landscape" as PluginLayoutControlsDisplay,
    },
  },
  components: {
    remoteState: "none",
  },
  config: [
    [PluginConfig.VolumeStreaming.Enabled, false],
    [PluginConfig.Viewport.ShowSettings, true],
    [PluginConfig.Viewport.ShowTrajectoryControls, false],
    [PluginConfig.Background.Styles, ["#fff", "#fff", "#fff", "#fff", "#fff"]],
    [PluginConfig.Viewport.ShowExpand, false],
    [PluginConfig.Viewport.ShowSelectionMode, false],
    [PluginConfig.Viewport.ShowControls, false],
    [PluginConfig.Viewport.ShowAnimation, false],
  ],
};

const MolstarViewer = () => {
  const parent = createRef<HTMLDivElement>();
  const selectedMols = useAppSelector((state) => state.settings.selectedMols);
  const dispatch = useAppDispatch();
  // @ts-expect-error ts-migrate(2532) FIXME: use URL.
  const [url, setURl] = useState("");
  const handle = useFullScreenHandle();
  const handleFullScreen = () => {
    handle.active ? handle.exit() : handle.enter();
  };

  // if (setting.pdb.length === 0) {
  //   dispatch(setSelectedMols([]));
  //   dispatch(setErrorMessage("First load PDB file"));
  //   return null;
  // }

  // let blob = new Blob(
  //   [
  //     setting.pdb &&
  //       setting.pdb.find((obj: { relativePath: string | any[] }) =>
  //         obj.relativePath.includes(selectedMols[0])
  //       ).fileData,
  //   ],
  //   { type: "text/plain" }
  // );

  useEffect(() => {
    async function init() {
      window.molstar = await createPluginUI(
        parent.current as HTMLDivElement,
        MySpec
      );

      const data = await window.molstar.builders.data.download(
        {
          url: `https://protspace.onrender.com/data/${selectedMols[0]}.pdb`,
        },
        { state: { isGhost: true } }
      );
      window.molstar.builders.structure.plugin.config.set(
        PluginConfig.Viewport.ShowSettings,
        true
      );
      const trajectory =
        await window.molstar.builders.structure.parseTrajectory(data, "pdb");
      await window.molstar.builders.structure.hierarchy.applyPreset(
        trajectory,
        "default",
        {
          representationPreset: "protein-and-nucleic",
        }
      );

      const { structures } =
        window.molstar.managers.structure.hierarchy.selection;
      const preset =
        window.molstar.config.get(
          PluginConfig.Structure.DefaultRepresentationPreset
        ) || PresetStructureRepresentations.auto.id;
      const provider =
        window.molstar.builders.structure.representation.resolveProvider(
          preset
        );
      await window.molstar.managers.structure.component.applyPreset(
        structures,
        provider
      );

      window.molstar.managers.structure.component.setOptions(
        PD.getDefaultValues(StructureComponentManager.OptionsParams)
      );

      if (window.molstar.canvas3d) {
        const p = PD.getDefaultValues(PostprocessingParams);
        window.molstar.canvas3d.setProps({
          postprocessing: { outline: p.outline, occlusion: p.occlusion },
        });
      }

      const renderer = window.molstar.canvas3d!.props.renderer;
      PluginCommands.Canvas3D.SetSettings(window.molstar, {
        settings: {
          renderer: {
            ...renderer,
            backgroundColor: ColorNames.beige /* or: 0xff0000 as Color */,
          },
        },
      });
    }
    // "unitcell" | "default" | "all-models" | "supercell" | "crystalContacts"

    // fetchData();
    init();

    return () => {
      window.molstar?.dispose();
      window.molstar = undefined;
    };
  }, []);
  return (
    <div
      style={{
        width: 340,
        height: 320,
        position: "absolute",
        bottom: 16,
        left: 16,
      }}
    >
      <FullScreen handle={handle}>
        <Tooltip label="Close">
          <button
            className="absolute bottom-4 right-4 z-10 w-4 h-4 cursor-pointer"
            onClick={() => dispatch(setSelectedMols([]))}
            style={{ zIndex: 9999, right: 12, bottom: 18 }}
          >
            <CloseIcon boxSize={"12px"} />
          </button>
        </Tooltip>
        <Tooltip label="Full Screen">
          <button
            className="absolute bottom-12 right-4 z-10 w-4 h-4 cursor-pointer"
            onClick={handleFullScreen}
          >
            <MdFullscreen size="24px" />
          </button>
        </Tooltip>

        <div
          ref={parent}
          style={{
            width: handle.active ? window.screen.width : "100%",
            height: handle.active ? window.screen.height : "320px",
          }}
        />
      </FullScreen>
    </div>
  );
};

export default MolstarViewer;
