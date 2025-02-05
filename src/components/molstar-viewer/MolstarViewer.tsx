import { CloseIcon } from '@chakra-ui/icons';
import { Tooltip, useColorMode } from '@chakra-ui/react';
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context';
import { createPluginUI } from 'molstar/lib/mol-plugin-ui/react18';
import 'molstar/lib/mol-plugin-ui/skin/light.scss';
import { createRef, useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import { PostprocessingParams } from 'molstar/lib/mol-canvas3d/passes/postprocessing';
import { AnimateModelIndex } from 'molstar/lib/mol-plugin-state/animation/built-in/model-index';
import { PresetStructureRepresentations } from 'molstar/lib/mol-plugin-state/builder/structure/representation-preset';
import { StructureComponentManager } from 'molstar/lib/mol-plugin-state/manager/structure/component';
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PluginLayoutControlsDisplay } from 'molstar/lib/mol-plugin/layout';
import { Color } from 'molstar/lib/mol-util/color';
import { ColorNames } from 'molstar/lib/mol-util/color/names';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import { MdFullscreen } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../helpers/hooks';
import { setSelectedMols } from '../../redux/actions/settings';

declare global {
  interface Window {
    molstar?: PluginUIContext;
    molstar1?: PluginUIContext;
    molstar2?: PluginUIContext;
  }
}

const MySpec: PluginUISpec = {
  ...DefaultPluginUISpec(),
  canvas3d: {
    camera: { mode: 'orthographic' },
    renderer: {
      backgroundColor: 0x303030 as Color
    },
    postprocessing: {
      occlusion: {
        name: 'off',
        params: {}
      }
    }
  },
  animations: [AnimateModelIndex],
  layout: {
    initial: {
      isExpanded: false,
      showControls: true,
      regionState: {
        top: 'hidden',
        left: 'hidden',
        right: 'hidden',
        bottom: 'hidden'
      },
      controlsDisplay: 'landscape' as PluginLayoutControlsDisplay
    }
  },
  components: {
    remoteState: 'none'
  },
  config: [
    [PluginConfig.VolumeStreaming.Enabled, false],
    [PluginConfig.Viewport.ShowSettings, true],
    [PluginConfig.Viewport.ShowTrajectoryControls, false],
    [PluginConfig.Background.Styles, ['#fff', '#fff', '#fff', '#fff', '#fff']],
    [PluginConfig.Viewport.ShowExpand, false],
    [PluginConfig.Viewport.ShowSelectionMode, false],
    [PluginConfig.Viewport.ShowControls, false],
    [PluginConfig.Viewport.ShowAnimation, false]
  ]
};

// eslint-disable-next-line react/prop-types
const MolstarViewer = ({ isCompareMode = false }) => {
  const { colorMode } = useColorMode();
  const viewer1Ref = createRef<HTMLDivElement>();
  const viewer2Ref = createRef<HTMLDivElement>();
  const selectedMols = useAppSelector((state) => state.settings.selectedMols);
  const dispatch = useAppDispatch();
  const handle = useFullScreenHandle();

  const handleFullScreen = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    handle.active ? handle.exit() : handle.enter();
  };

  useEffect(() => {
    async function init() {
      if (isCompareMode && selectedMols.length >= 2) {
        window.molstar1 = await createPluginUI(viewer1Ref.current as HTMLDivElement, MySpec);
        window.molstar2 = await createPluginUI(viewer2Ref.current as HTMLDivElement, MySpec);

        await loadMolecule(window.molstar1, selectedMols[0]);

        await loadMolecule(window.molstar2, selectedMols[1]);
      } else {
        window.molstar = await createPluginUI(viewer1Ref.current as HTMLDivElement, MySpec);
        await loadMolecule(window.molstar, selectedMols[0]);
      }
    }

    init();

    return () => {
      window.molstar?.dispose();
      window.molstar = undefined;
      window.molstar1?.dispose();
      window.molstar1 = undefined;
      window.molstar2?.dispose();
      window.molstar2 = undefined;
    };
  }, [isCompareMode, selectedMols]);

  async function loadMolecule(plugin: PluginUIContext, moleculeName: string) {
    const data = await plugin.builders.data.download(
      { url: `https://protspace.onrender.com/data/${moleculeName}.pdb` },
      { state: { isGhost: true } }
    );

    plugin.builders.structure.plugin.config.set(PluginConfig.Viewport.ShowSettings, true);

    const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb');
    await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default', {
      representationPreset: 'protein-and-nucleic'
    });

    const { structures } = plugin.managers.structure.hierarchy.selection;
    const preset =
      plugin.config.get(PluginConfig.Structure.DefaultRepresentationPreset) ||
      PresetStructureRepresentations.auto.id;
    const provider = plugin.builders.structure.representation.resolveProvider(preset);
    await plugin.managers.structure.component.applyPreset(structures, provider);

    plugin.managers.structure.component.setOptions(
      PD.getDefaultValues(StructureComponentManager.OptionsParams)
    );

    if (plugin.canvas3d) {
      const p = PD.getDefaultValues(PostprocessingParams);
      plugin.canvas3d.setProps({
        postprocessing: { outline: p.outline, occlusion: p.occlusion }
      });
    }

    const renderer = plugin.canvas3d!.props.renderer;
    PluginCommands.Canvas3D.SetSettings(plugin, {
      settings: {
        renderer: {
          ...renderer,
          backgroundColor: ColorNames.beige
        }
      }
    });
  }

  return (
    <div
      style={{
        width: isCompareMode ? 680 : 340,
        height: 320,
        position: 'absolute',
        bottom: 32,
        left: 16,
        display: 'flex'
      }}
    >
      <FullScreen handle={handle} className="w-full">
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: handle.active ? (isCompareMode ? '50%' : '100%') : '340px',
              height: handle.active ? window.screen.height : '340px',
              position: 'relative'
            }}
          >
            <div ref={viewer1Ref} style={{ width: '100%', height: '100%' }} />
            <Tooltip label="Close">
              <button
                className="absolute bottom-4 right-4 z-10 w-4 h-4 cursor-pointer"
                onClick={() => dispatch(setSelectedMols([]))}
                style={{ zIndex: 9999, right: 12, bottom: 18 }}
              >
                <CloseIcon boxSize={'12px'} color={colorMode === 'light' ? 'black' : 'black'} />
              </button>
            </Tooltip>
            <Tooltip label="Full Screen">
              <button
                className="absolute bottom-12 right-4 z-10 w-4 h-4 cursor-pointer"
                onClick={handleFullScreen}
                style={{ zIndex: 9999, right: 16, bottom: 48 }}
              >
                <MdFullscreen size="24px" color={colorMode === 'light' ? 'black' : 'black'} />
              </button>
            </Tooltip>
          </div>
          {isCompareMode && (
            <div
              style={{
                width: '50%',
                height: handle.active ? window.screen.height : '340px',
                position: 'relative',
                paddingLeft: '16px'
              }}
            >
              <div ref={viewer2Ref} style={{ width: '100%', height: '100%' }} />
              <Tooltip label="Close">
                <button
                  className="absolute bottom-4 right-4 z-10 w-4 h-4 cursor-pointer"
                  onClick={() => dispatch(setSelectedMols([]))}
                  style={{ zIndex: 9999, right: 12, bottom: 18 }}
                >
                  <CloseIcon boxSize={'12px'} color={colorMode === 'light' ? 'black' : 'black'} />
                </button>
              </Tooltip>
              <Tooltip label="Full Screen">
                <button
                  className="absolute bottom-12 right-4 z-10 w-4 h-4 cursor-pointer"
                  onClick={handleFullScreen}
                  style={{ zIndex: 9999, right: 16, bottom: 48 }}
                >
                  <MdFullscreen size="24px" color={colorMode === 'light' ? 'black' : 'black'} />
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      </FullScreen>
    </div>
  );
};

export default MolstarViewer;
