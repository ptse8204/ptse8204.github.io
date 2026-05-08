import React, { type CSSProperties, useEffect, useId, useMemo, useState } from "react";

import {
  transportSceneMap,
  transportScenes,
  transportTokens,
  type TransportLayout,
  type TransportSceneId,
  type TransportSceneMeta,
  type TransportSceneState,
} from "./transportTokens.js";

const sceneOrder = transportScenes.map((scene) => scene.id);

type SvgGroupTransforms = {
  background: number;
  mid: number;
  foreground: number;
  vehicle: number;
};

interface SceneRenderProps {
  ids: {
    gradient: string;
  };
  transforms: SvgGroupTransforms;
  selected: boolean;
}

interface TransportBannerSetProps {
  layout?: TransportLayout;
  scenes?: TransportSceneId[];
  decorative?: boolean;
  interactive?: boolean;
  captions?: boolean;
  className?: string;
  selectedSceneId?: TransportSceneId;
  defaultSelectedSceneId?: TransportSceneId;
  onSceneSelect?: (sceneId: TransportSceneId) => void;
  sceneStates?: Partial<Record<TransportSceneId, TransportSceneState>>;
}

interface SceneFrameProps {
  scene: TransportSceneMeta;
  state: TransportSceneState;
  decorative: boolean;
  interactive: boolean;
  captions: boolean;
  selected: boolean;
  onSelect?: (sceneId: TransportSceneId) => void;
}

const palette = transportTokens.palette;

function useMediaFlag(query: string): boolean {
  const getInitialValue = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;

  const [matches, setMatches] = useState<boolean>(getInitialValue);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function createFilter(state: TransportSceneState): string {
  const current = transportTokens.states[state];
  return `saturate(${current.saturation}) contrast(${current.contrast})`;
}

function range(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index);
}

function SoftMountains({
  x,
  y,
  w,
  h,
  fill,
  opacity = 0.3,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  opacity?: number;
}) {
  const d = [
    `M ${x} ${y + h}`,
    `C ${x + w * 0.1} ${y + h * 0.45}, ${x + w * 0.2} ${y + h * 0.08}, ${x + w * 0.32} ${y + h * 0.48}`,
    `C ${x + w * 0.43} ${y + h * 0.84}, ${x + w * 0.55} ${y + h * 0.12}, ${x + w * 0.66} ${y + h * 0.42}`,
    `C ${x + w * 0.77} ${y + h * 0.76}, ${x + w * 0.9} ${y + h * 0.2}, ${x + w} ${y + h * 0.52}`,
    `L ${x + w} ${y + h}`,
    "Z",
  ].join(" ");

  return <path d={d} fill={fill} opacity={opacity} />;
}

function DistantCity({
  x,
  y,
  w,
  h,
  opacity = 0.22,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
}) {
  const buildings = [
    { x: 0, w: 42, h: 80 },
    { x: 56, w: 34, h: 112 },
    { x: 106, w: 48, h: 96 },
    { x: 176, w: 38, h: 126 },
    { x: 228, w: 62, h: 102 },
  ];

  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      {buildings.map((building, index) => {
        const top = h - building.h;
        return (
          <g key={`${building.x}-${index}`}>
            <rect
              x={building.x}
              y={top}
              width={building.w}
              height={building.h}
              fill={palette.city}
            />
            {range(3).map((column) => (
              <rect
                key={column}
                x={building.x + 7 + column * 10}
                y={top + 18}
                width={3}
                height={building.h - 30}
                fill={palette.sky}
                opacity={0.25}
              />
            ))}
          </g>
        );
      })}
      <rect x={0} y={h - 6} width={w} height={6} fill={palette.horizon} opacity={0.55} />
    </g>
  );
}

function Tree({
  x,
  y,
  scale = 1,
  opacity = 0.65,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x={-4} y={36} width={8} height={46} rx={3} fill={palette.steelBlue} />
      <circle cx={-20} cy={24} r={18} fill={palette.treeBlueGreen} />
      <circle cx={0} cy={18} r={20} fill={palette.treeBlueGreen} />
      <circle cx={18} cy={26} r={16} fill={palette.treeBlueGreen} />
      <circle cx={2} cy={2} r={15} fill={palette.treeBlueGreen} />
    </g>
  );
}

function HumanFigure({
  x,
  y,
  pose = "standing",
  bag = false,
  luggage = false,
}: {
  x: number;
  y: number;
  pose?: "standing" | "walking_left" | "walking_right";
  bag?: boolean;
  luggage?: boolean;
}) {
  const lean = pose === "walking_left" ? -3 : pose === "walking_right" ? 3 : 0;
  const leftLeg = pose === "walking_right" ? -2 : 1;
  const rightLeg = pose === "walking_left" ? 2 : -1;

  return (
    <g transform={`translate(${x} ${y - 42})`} fill={palette.deepBlue}>
      <circle cx={6} cy={6} r={5} />
      <path d={`M 6 12 L ${6 + lean} 24 L 7 34 L 5 42 L 3 42 L 4 34 L 2 24 Z`} />
      <rect x={3} y={15} width={6} height={15} rx={2} />
      <path d={`M 6 29 L ${3 + leftLeg} 42 L ${5 + leftLeg} 42 L 7 31 Z`} />
      <path d={`M 7 29 L ${9 + rightLeg} 42 L ${11 + rightLeg} 42 L 8 31 Z`} />
      {bag ? <rect x={10} y={18} width={5} height={7} rx={1.5} /> : null}
      {luggage ? (
        <g>
          <rect x={13} y={27} width={7} height={11} rx={1.5} />
          <rect x={15} y={23} width={3} height={4} rx={1} />
          <path d="M 12 24 L 16 20" stroke={palette.deepBlue} strokeWidth={1.5} fill="none" />
        </g>
      ) : null}
    </g>
  );
}

function StationCanopy({
  x,
  y,
  width,
  height,
  posts,
  sign,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  posts: Array<{ x: number; h: number }>;
  sign?: { x: number; y: number; width: number; height: number; opacity?: number };
}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={palette.deepBlue} />
      <polygon
        points={`${x},${y} ${x + width - 25},${y} ${x + width},${y + height} ${x},${y + height}`}
        fill={palette.canopyMid}
      />
      {posts.map((post) => (
        <g key={`${post.x}-${post.h}`}>
          <rect x={post.x - 3} y={y + height - 1} width={6} height={post.h} fill={palette.deepBlue} />
          <path
            d={`M ${post.x - 2} ${y + height} L ${post.x - 15} ${y + height - 18} M ${post.x + 2} ${y + height} L ${post.x + 15} ${y + height - 18}`}
            stroke={palette.deepBlue}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
      {sign ? (
        <g opacity={sign.opacity ?? 0.7}>
          <rect x={sign.x} y={sign.y} width={sign.width} height={sign.height} fill={palette.city} />
          <path
            d={`M ${sign.x + 8} ${sign.y} L ${sign.x + 8} ${sign.y - 14} M ${sign.x + sign.width - 8} ${sign.y} L ${sign.x + sign.width - 8} ${sign.y - 14}`}
            stroke={palette.deepBlue}
            strokeWidth={2}
          />
        </g>
      ) : null}
    </g>
  );
}

function Shelter({
  x,
  y,
  width,
  height,
  fill = "rgba(196,214,227,0.25)",
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
}) {
  return (
    <g>
      <rect x={x + 8} y={y - 8} width={width - 16} height={8} fill={palette.mediumBlue} />
      <rect x={x + 15} y={y} width={width - 30} height={height} fill={fill} stroke={palette.mediumBlue} />
      <rect x={x + 15} y={y} width={4} height={height} fill={palette.mediumBlue} />
      <rect x={x + width - 19} y={y} width={4} height={height} fill={palette.mediumBlue} />
      <rect x={x + 58} y={y} width={2.5} height={height} fill={palette.mediumBlue} opacity={0.45} />
      <rect x={x + 103} y={y} width={2.5} height={height} fill={palette.mediumBlue} opacity={0.45} />
    </g>
  );
}

function RouteBoard({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={palette.vehicleWhite} stroke={palette.mediumBlue} />
      <rect x={x + width * 0.5 - 1.5} y={y + height} width={3} height={8} fill={palette.mediumBlue} />
      {range(6).map((line) => (
        <rect
          key={line}
          x={x + 6}
          y={y + 8 + line * 10}
          width={width - 12 - (line % 2) * 5}
          height={2.5}
          rx={1.2}
          fill={palette.mediumBlue}
          opacity={0.78}
        />
      ))}
    </g>
  );
}

function Bench({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <g stroke={palette.mediumBlue} strokeWidth={3} fill="none" strokeLinecap="round">
      <line x1={x} y1={y} x2={x + width} y2={y} />
      <line x1={x + 10} y1={y} x2={x + 6} y2={y + 18} />
      <line x1={x + width - 10} y1={y} x2={x + width - 6} y2={y + 18} />
    </g>
  );
}

function Planter({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={2} fill={palette.planter} />
      <circle cx={x + size * 0.35} cy={y + 8} r={7} fill={palette.treeBlueGreen} opacity={0.92} />
      <circle cx={x + size * 0.55} cy={y + 5} r={8} fill={palette.treeBlueGreen} opacity={0.92} />
      <circle cx={x + size * 0.72} cy={y + 10} r={6} fill={palette.treeBlueGreen} opacity={0.92} />
    </g>
  );
}

function StreetLamp({ x, y, height }: { x: number; y: number; height: number }) {
  return (
    <g stroke={palette.mediumBlue} strokeWidth={3} fill="none" strokeLinecap="round">
      <line x1={x} y1={y} x2={x} y2={y + height} />
      <path d={`M ${x} ${y} C ${x} ${y - 12}, ${x + 10} ${y - 18}, ${x + 16} ${y - 18}`} />
      <line x1={x + 16} y1={y - 18} x2={x + 16} y2={y - 10} />
    </g>
  );
}

function MotionBlur({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <g opacity={0.5}>
      {range(4).map((line) => (
        <rect
          key={line}
          x={x}
          y={y + line * 16}
          width={width - line * 16}
          height={10 + (line % 2) * 4}
          rx={5}
          fill={line % 2 === 0 ? "#DCE7EF" : palette.sky}
          opacity={0.42 - line * 0.06}
        />
      ))}
      <rect x={x + 24} y={y + height - 16} width={width - 36} height={7} rx={3.5} fill={palette.sky} opacity={0.18} />
    </g>
  );
}

function HighSpeedTrain({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  const bodyHeight = height * 0.88;
  const bodyY = y + height - bodyHeight;
  const noseX = x + width - 120;
  const windowY = bodyY + 26;

  return (
    <g>
      <path
        d={[
          `M ${x} ${bodyY + 10}`,
          `H ${noseX - 40}`,
          `C ${noseX - 10} ${bodyY + 10}, ${noseX + 12} ${bodyY + 6}, ${noseX + 35} ${bodyY + 2}`,
          `C ${noseX + 70} ${bodyY + 2}, ${x + width - 4} ${bodyY + 28}, ${x + width} ${bodyY + 58}`,
          `L ${x + width} ${y + height - 4}`,
          `L ${x} ${y + height - 4}`,
          "Z",
        ].join(" ")}
        fill={palette.vehicleWhite}
        stroke={palette.steelBlue}
        strokeWidth={3}
      />
      <rect x={x + 48} y={windowY} width={width - 204} height={29} rx={4} fill={palette.deepBlue} />
      <rect x={noseX + 42} y={windowY + 8} width={30} height={18} rx={9} fill={palette.windowDark} />
      <path
        d={`M ${noseX + 8} ${bodyY + 10} C ${noseX + 38} ${bodyY + 14}, ${x + width - 32} ${bodyY + 38}, ${x + width - 18} ${bodyY + 66}`}
        fill="none"
        stroke={palette.steelBlue}
        strokeWidth={3}
      />
      <rect x={x + width - 45} y={bodyY + 42} width={18} height={8} rx={4} fill={palette.warmLight} />
      <ellipse cx={x + width - 116} cy={y + height - 6} rx={95} ry={8} fill={palette.nearBlackBlue} opacity={0.65} />
    </g>
  );
}

function PassengerTrain({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <g>
      <rect x={x} y={y} width={width - 74} height={height} rx={16} fill={palette.vehicleWhite} stroke={palette.steelBlue} strokeWidth={3} />
      <path
        d={`M ${x + width - 116} ${y + 2} C ${x + width - 70} ${y + 2}, ${x + width - 10} ${y + 32}, ${x + width} ${y + 74} L ${x + width} ${y + height} L ${x + width - 116} ${y + height} Z`}
        fill={palette.vehicleWhite}
        stroke={palette.steelBlue}
        strokeWidth={3}
      />
      {range(6).map((windowIndex) => (
        <rect
          key={windowIndex}
          x={x + 34 + windowIndex * 56}
          y={y + 20}
          width={42}
          height={30}
          rx={3}
          fill={palette.deepBlue}
        />
      ))}
      <rect x={x + 330} y={y - 6} width={50} height={height + 6} rx={4} fill={palette.doorAmber} />
      <rect x={x + 338} y={y + 8} width={34} height={height - 14} rx={3} fill={palette.windowDark} />
      <rect x={x + 566} y={y - 6} width={46} height={height + 6} rx={4} fill={palette.doorAmber} />
      <rect x={x + 574} y={y + 8} width={30} height={height - 14} rx={3} fill={palette.windowDark} />
      <rect x={x + width - 36} y={y + 44} width={14} height={8} rx={4} fill={palette.warmLight} />
    </g>
  );
}

function Tram({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <g>
      <rect x={x} y={y} width={width - 40} height={height} rx={18} fill={palette.vehicleWhite} stroke={palette.steelBlue} strokeWidth={3} />
      <rect x={x + width - 58} y={y + 1} width={55} height={height - 2} rx={16} fill={palette.vehicleWhite} stroke={palette.steelBlue} strokeWidth={3} />
      <rect x={x + 25} y={y + 16} width={width - 126} height={42} rx={5} fill={palette.deepBlue} />
      <rect x={x + width - 52} y={y + 16} width={38} height={44} rx={4} fill={palette.deepBlue} />
      <rect x={x + 255} y={y - 1} width={34} height={height + 2} rx={3} fill={palette.deepBlue} opacity={0.85} />
      <circle cx={x + 122} cy={y + height} r={16} fill={palette.nearBlackBlue} />
      <circle cx={x + 448} cy={y + height} r={16} fill={palette.nearBlackBlue} />
      <path
        d={`M ${x + 185} ${y - 4} L ${x + 220} ${y - 44} L ${x + 262} ${y - 4} M ${x + 202} ${y - 22} L ${x + 246} ${y - 22}`}
        stroke={palette.deepBlue}
        strokeWidth={4}
        fill="none"
      />
      <path d={`M 0 ${y - 46} H 1000`} stroke={palette.deepBlue} strokeWidth={2} />
    </g>
  );
}

function Bus({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={20} fill={palette.vehicleWhite} stroke={palette.steelBlue} strokeWidth={3} />
      <rect x={x + 20} y={y + 14} width={width - 95} height={48} rx={5} fill={palette.deepBlue} />
      <rect x={x + 220} y={y + 14} width={42} height={76} rx={4} fill={palette.doorAmber} opacity={0.9} />
      <rect x={x + width - 55} y={y + 10} width={45} height={55} rx={4} fill={palette.deepBlue} />
      <circle cx={x + 85} cy={y + height - 2} r={22} fill={palette.nearBlackBlue} />
      <circle cx={x + width - 80} cy={y + height - 2} r={22} fill={palette.nearBlackBlue} />
    </g>
  );
}

function TruckWarehouse({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={250} height={88} fill={palette.deepBlue} />
      <rect x={x + 250} y={y + 16} width={95} height={72} rx={10} fill={palette.vehicleWhite} stroke={palette.steelBlue} strokeWidth={3} />
      <rect x={x + 275} y={y + 25} width={38} height={28} rx={3} fill={palette.deepBlue} />
      <path d={`M ${x + 250} ${y + 40} H ${x + 345}`} stroke={palette.steelBlue} strokeWidth={3} />
      <circle cx={x + 65} cy={y + 89} r={18} fill={palette.nearBlackBlue} />
      <circle cx={x + 300} cy={y + 89} r={18} fill={palette.nearBlackBlue} />
    </g>
  );
}

function Airplane({ x, y, rotation = -11 }: { x: number; y: number; rotation?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
      <rect x={0} y={24} width={365} height={28} rx={14} fill={palette.vehicleWhite} stroke={palette.steelBlue} strokeWidth={2.5} />
      <path d="M 342 20 C 378 22, 400 26, 424 38 C 398 53, 376 57, 342 56 Z" fill={palette.vehicleWhite} stroke={palette.steelBlue} strokeWidth={2.5} />
      <path d="M 138 42 L 238 122 L 290 122 L 196 41 Z" fill={palette.steelBlue} />
      <path d="M 44 28 L 92 -22 L 130 -22 L 92 31 Z" fill={palette.steelBlue} />
      <path d="M 38 52 L 96 92 L 132 92 L 88 50 Z" fill={palette.steelBlue} />
      <ellipse cx={214} cy={78} rx={20} ry={14} fill={palette.mediumBlue} />
      <ellipse cx={300} cy={78} rx={18} ry={12} fill={palette.mediumBlue} />
      {range(16).map((windowIndex) => (
        <circle
          key={windowIndex}
          cx={102 + windowIndex * 14}
          cy={36}
          r={2.2}
          fill={palette.mediumBlue}
        />
      ))}
      <path d="M 214 92 L 214 118 M 300 92 L 300 114" stroke={palette.nearBlackBlue} strokeWidth={4} />
      <circle cx={214} cy={120} r={6} fill={palette.nearBlackBlue} />
      <circle cx={300} cy={116} r={6} fill={palette.nearBlackBlue} />
    </g>
  );
}

function Ferry({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path
        d={`M ${x} ${y + 24} H ${x + 245} L ${x + 275} ${y + 50} H ${x + 28} Z`}
        fill={palette.nearBlackBlue}
      />
      <rect x={x + 42} y={y - 18} width={210} height={55} rx={6} fill={palette.vehicleWhite} stroke={palette.steelBlue} strokeWidth={3} />
      <rect x={x + 62} y={y - 2} width={168} height={20} rx={4} fill={palette.deepBlue} />
      <rect x={x + 182} y={y - 39} width={70} height={48} rx={4} fill={palette.vehicleWhite} stroke={palette.steelBlue} strokeWidth={2.5} />
      <line x1={x + 228} y1={y - 60} x2={x + 228} y2={y - 16} stroke={palette.deepBlue} strokeWidth={4} />
      <path d={`M ${x + 228} ${y - 52} L ${x + 240} ${y - 44}`} stroke={palette.deepBlue} strokeWidth={3} fill="none" />
      {range(8).map((windowIndex) => (
        <rect
          key={windowIndex}
          x={x + 58 + windowIndex * 20}
          y={y + 4}
          width={12}
          height={8}
          rx={2}
          fill={palette.vehicleWhite}
          opacity={0.8}
        />
      ))}
    </g>
  );
}

function TrainRouteIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={color} fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <rect x={-16} y={-16} width={32} height={34} rx={10} />
      <line x1={-7} y1={-3} x2={7} y2={-3} />
      <line x1={-10} y1={4} x2={10} y2={4} />
      <line x1={-8} y1={18} x2={-2} y2={26} />
      <line x1={8} y1={18} x2={2} y2={26} />
    </g>
  );
}

function BusRouteIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={color} fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <rect x={-18} y={-13} width={36} height={22} rx={6} />
      <line x1={-8} y1={-13} x2={-8} y2={9} />
      <line x1={8} y1={-13} x2={8} y2={9} />
      <circle cx={-9} cy={13} r={3} fill={color} />
      <circle cx={9} cy={13} r={3} fill={color} />
    </g>
  );
}

function TramRouteIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={color} fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <rect x={-17} y={-10} width={34} height={18} rx={5} />
      <line x1={-7} y1={-15} x2={0} y2={-24} />
      <line x1={0} y1={-24} x2={7} y2={-15} />
      <circle cx={-9} cy={12} r={3} fill={color} />
      <circle cx={9} cy={12} r={3} fill={color} />
    </g>
  );
}

function TruckRouteIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={color} fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <rect x={-20} y={-10} width={24} height={18} rx={2} />
      <path d="M 4 -10 H 13 L 18 -4 V 8 H 4 Z" />
      <circle cx={-8} cy={12} r={3.5} fill={color} />
      <circle cx={10} cy={12} r={3.5} fill={color} />
    </g>
  );
}

function AirplaneRouteIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-18)`} stroke={color} fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <line x1={-20} y1={0} x2={20} y2={0} />
      <line x1={-5} y1={0} x2={-16} y2={12} />
      <line x1={-5} y1={0} x2={-16} y2={-12} />
      <line x1={6} y1={0} x2={18} y2={10} />
      <line x1={6} y1={0} x2={18} y2={-10} />
    </g>
  );
}

function FerryRouteIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={color} fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M -18 8 H 18 L 10 18 H -12 Z" />
      <rect x={-10} y={-4} width={20} height={9} rx={2} />
      <rect x={0} y={-12} width={9} height={8} rx={2} />
      <path d="M -18 23 C -12 19, -6 19, 0 23 C 6 19, 12 19, 18 23" />
    </g>
  );
}

function IconBubble({
  cx,
  cy,
  r,
  icon,
}: {
  cx: number;
  cy: number;
  r: number;
  icon: "train" | "bus" | "tram" | "truck" | "airplane" | "ferry";
}) {
  const color = palette.mediumBlue;

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={palette.sky} stroke={palette.paleBlue} strokeWidth={3} />
      {icon === "train" ? <TrainRouteIcon x={cx} y={cy} color={color} /> : null}
      {icon === "bus" ? <BusRouteIcon x={cx} y={cy} color={color} /> : null}
      {icon === "tram" ? <TramRouteIcon x={cx} y={cy} color={color} /> : null}
      {icon === "truck" ? <TruckRouteIcon x={cx} y={cy} color={color} /> : null}
      {icon === "airplane" ? <AirplaneRouteIcon x={cx} y={cy} color={color} /> : null}
      {icon === "ferry" ? <FerryRouteIcon x={cx} y={cy} color={color} /> : null}
    </g>
  );
}

function RouteLine({
  points,
  stroke,
  strokeWidth = 2,
}: {
  points: Array<[number, number]>;
  stroke: string;
  strokeWidth?: number;
}) {
  return <polyline points={points.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={stroke} strokeWidth={strokeWidth} />;
}

function WaterLines() {
  return (
    <g opacity={0.5} stroke={palette.paleBlue} strokeWidth={2}>
      {range(6).map((line) => (
        <line
          key={line}
          x1={80 + line * 140}
          y1={205 + (line % 2) * 5}
          x2={180 + line * 140}
          y2={205 + (line % 2) * 5}
        />
      ))}
    </g>
  );
}

function GenericBackdrop({
  gradientId,
  from,
  to,
}: {
  gradientId: string;
  from: string;
  to: string;
}) {
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1000} height={250} fill={`url(#${gradientId})`} />
      <rect x={0} y={152} width={1000} height={98} fill={palette.mist} opacity={0.28} />
    </>
  );
}

function RailPlatformEmptyScene({ ids, transforms }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E1EAF1" />
      <g transform={`translate(${transforms.background} 0)`}>
        <SoftMountains x={360} y={115} w={360} h={55} fill={palette.paleBlue} opacity={0.3} />
        <Tree x={590} y={98} scale={0.9} opacity={0.45} />
        <Tree x={680} y={103} scale={0.75} opacity={0.38} />
      </g>
      <g transform={`translate(${transforms.mid} 0)`}>
        <StationCanopy
          x={0}
          y={35}
          width={735}
          height={34}
          posts={[
            { x: 420, h: 128 },
            { x: 645, h: 128 },
          ]}
          sign={{ x: 505, y: 82, width: 78, height: 18, opacity: 0.7 }}
        />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <HighSpeedTrain x={-80} y={99} width={505} height={88} />
      </g>
      <g transform={`translate(${transforms.foreground} 0)`}>
        <Bench x={550} y={180} width={68} />
        <Planter x={635} y={176} size={28} />
        <StreetLamp x={780} y={62} height={134} />
      </g>
      <line x1={0} y1={199} x2={1000} y2={199} stroke={palette.platformGround} strokeWidth={3} />
      <line x1={0} y1={196} x2={1000} y2={196} stroke={palette.platformLine} strokeWidth={3} />
    </>
  );
}

function RailPlatformPassengersScene({ ids, transforms }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E1EAF1" />
      <g transform={`translate(${transforms.background} 0)`}>
        <Tree x={745} y={111} scale={0.85} opacity={0.5} />
      </g>
      <g transform={`translate(${transforms.mid} 0)`}>
        <StationCanopy
          x={0}
          y={36}
          width={760}
          height={35}
          posts={[
            { x: 430, h: 124 },
            { x: 655, h: 124 },
          ]}
          sign={{ x: 505, y: 88, width: 88, height: 18, opacity: 0.65 }}
        />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <PassengerTrain x={-35} y={105} width={685} height={84} />
      </g>
      <g transform={`translate(${transforms.foreground} 0)`}>
        <HumanFigure x={55} y={151} pose="walking_left" />
        <HumanFigure x={110} y={149} pose="walking_right" bag />
        <HumanFigure x={170} y={150} pose="walking_right" />
        <HumanFigure x={225} y={151} pose="walking_right" />
        <HumanFigure x={275} y={150} pose="standing" />
        <HumanFigure x={360} y={151} pose="walking_right" luggage />
        <HumanFigure x={420} y={151} pose="walking_left" />
        <HumanFigure x={470} y={151} pose="walking_right" />
        <HumanFigure x={520} y={151} pose="standing" />
        <Bench x={735} y={181} width={70} />
        <Planter x={670} y={177} size={32} />
        <StreetLamp x={825} y={68} height={130} />
      </g>
      <line x1={0} y1={197} x2={1000} y2={197} stroke={palette.platformLine} strokeWidth={3} />
    </>
  );
}

function TramStopScene({ ids, transforms }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E5EDF3" />
      <g transform={`translate(${transforms.background} 0)`}>
        <DistantCity x={490} y={40} w={310} h={130} opacity={0.22} />
        <Tree x={850} y={85} scale={1.2} opacity={0.55} />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <MotionBlur x={0} y={100} width={160} height={80} />
        <Tram x={70} y={102} width={585} height={86} />
      </g>
      <g transform={`translate(${transforms.foreground} 0)`}>
        <Shelter x={690} y={135} width={160} height={58} />
        <RouteBoard x={865} y={105} width={35} height={90} />
        <HumanFigure x={675} y={155} pose="standing" />
        <HumanFigure x={720} y={155} pose="standing" />
        <HumanFigure x={770} y={155} pose="standing" />
        <HumanFigure x={820} y={155} pose="standing" />
      </g>
    </>
  );
}

function BusStopScene({ ids, transforms }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E5EDF3" />
      <g transform={`translate(${transforms.background} 0)`}>
        <DistantCity x={535} y={50} w={275} h={132} opacity={0.2} />
        <Tree x={840} y={83} scale={1.15} opacity={0.58} />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <MotionBlur x={0} y={98} width={85} height={82} />
        <Bus x={75} y={94} width={465} height={98} />
      </g>
      <g transform={`translate(${transforms.foreground} 0)`}>
        <Shelter x={630} y={128} width={165} height={68} fill="rgba(196,214,227,0.18)" />
        <Bench x={670} y={172} width={78} />
        <RouteBoard x={810} y={120} width={35} height={78} />
        <StreetLamp x={875} y={75} height={123} />
        <HumanFigure x={430} y={157} pose="walking_right" />
        <HumanFigure x={545} y={154} pose="walking_right" />
        <HumanFigure x={590} y={154} pose="walking_right" />
        <HumanFigure x={635} y={154} pose="walking_right" />
      </g>
    </>
  );
}

function WarehouseTruckScene({ ids, transforms }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E4ECF3" />
      <g transform={`translate(${transforms.background} 0)`}>
        <SoftMountains x={80} y={78} w={420} h={80} fill={palette.paleBlue} opacity={0.28} />
        <Tree x={925} y={115} scale={0.82} opacity={0.5} />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <MotionBlur x={0} y={103} width={150} height={80} />
        <TruckWarehouse x={95} y={99} />
      </g>
      <g transform={`translate(${transforms.foreground} 0)`}>
        <rect x={395} y={72} width={500} height={122} fill={palette.platformGround} stroke={palette.steelBlue} strokeWidth={3} />
        {[
          { x: 455, light: 96 },
          { x: 605, light: 116 },
          { x: 755, light: 136 },
        ].map((door) => (
          <g key={door.x}>
            <rect x={door.x} y={96} width={80} height={98} fill={palette.deepBlue} />
            <rect x={door.x + 24} y={102} width={32} height={6} rx={3} fill={palette.warmLight} opacity={0.7} />
          </g>
        ))}
        <g fill={palette.pallet}>
          <rect x={425} y={156} width={70} height={38} />
          <rect x={705} y={153} width={90} height={42} />
          {range(3).map((column) => (
            <rect key={`left-${column}`} x={430 + column * 18} y={146 - (column % 2) * 10} width={16} height={10} />
          ))}
          {range(4).map((column) => (
            <rect key={`right-${column}`} x={714 + column * 18} y={142 - (column % 2) * 9} width={16} height={10} />
          ))}
        </g>
        <g transform="translate(525 150)">
          <rect x={0} y={10} width={34} height={18} rx={3} fill={palette.doorAmber} />
          <rect x={32} y={2} width={15} height={26} rx={3} fill={palette.doorAmber} />
          <rect x={7} y={0} width={18} height={12} rx={2} fill={palette.windowDark} />
          <circle cx={8} cy={30} r={7} fill={palette.nearBlackBlue} />
          <circle cx={30} cy={30} r={7} fill={palette.nearBlackBlue} />
          <rect x={46} y={18} width={18} height={4} fill={palette.doorAmber} />
          <rect x={46} y={12} width={4} height={22} fill={palette.doorAmber} />
          <rect x={60} y={12} width={4} height={22} fill={palette.doorAmber} />
        </g>
        <HumanFigure x={655} y={145} pose="walking_left" />
      </g>
    </>
  );
}

function AirplaneTakeoffScene({ ids, transforms }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E5EDF3" />
      <g transform={`translate(${transforms.background} 0)`}>
        <rect x={40} y={115} width={190} height={70} fill={palette.platformGround} opacity={0.62} />
        <rect x={92} y={64} width={52} height={118} fill={palette.warehouseBlue} opacity={0.7} />
        <rect x={100} y={54} width={36} height={18} rx={4} fill={palette.deepBlue} opacity={0.3} />
        <SoftMountains x={535} y={120} w={340} h={54} fill={palette.paleBlue} opacity={0.3} />
        <path d="M 885 86 L 914 79 L 944 88 M 907 83 L 925 69 M 907 83 L 925 96" stroke={palette.city} strokeWidth={3} fill="none" opacity={0.7} />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <Airplane x={365} y={66} />
      </g>
      <g transform={`translate(${transforms.foreground} 0)`}>
        <line x1={0} y1={188} x2={1000} y2={188} stroke={palette.platformGround} strokeWidth={4} />
        {range(10).map((light) => (
          <circle
            key={light}
            cx={54 + light * 98}
            cy={185}
            r={2.8}
            fill={palette.warmLight}
            opacity={0.85}
          />
        ))}
      </g>
    </>
  );
}

function FerryPortScene({ ids, transforms }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E1EAF1" />
      <g transform={`translate(${transforms.background} 0)`}>
        <SoftMountains x={140} y={65} w={720} h={95} fill={palette.paleBlue} opacity={0.3} />
        <path d="M 530 92 C 536 88, 542 88, 548 92 M 560 88 C 565 84, 571 84, 576 88" stroke={palette.steelBlue} strokeWidth={2.5} fill="none" opacity={0.5} />
      </g>
      <g transform={`translate(${transforms.mid} 0)`}>
        <rect x={0} y={170} width={380} height={30} fill={palette.platformGround} />
        <g fill={palette.pallet}>
          <rect x={155} y={130} width={170} height={40} />
          {range(4).map((column) => (
            <rect key={`cargo-${column}`} x={165 + column * 35} y={118 + (column % 2) * 8} width={28} height={12} />
          ))}
        </g>
        <path d="M 80 170 L 80 100 L 150 70 L 150 170 M 122 92 L 142 170" stroke={palette.mediumBlue} strokeWidth={4} fill="none" />
      </g>
      <g transform={`translate(${transforms.foreground} 0)`}>
        <rect x={0} y={195} width={1000} height={55} fill="#DDE8F1" />
        <WaterLines />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <Ferry x={470} y={145} />
        <path d="M 430 192 C 450 180, 490 182, 540 192" stroke={palette.sky} strokeWidth={8} fill="none" opacity={0.8} />
      </g>
    </>
  );
}

function RouteNetworkScene({ ids, selected }: SceneRenderProps) {
  const accent = selected ? palette.platformLine : palette.routeTeal;

  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E7EEF4" />
      <g opacity={0.22}>
        <SoftMountains x={420} y={155} w={340} h={40} fill={palette.paleBlue} opacity={0.22} />
      </g>
      <RouteLine
        points={[
          [0, 145],
          [110, 145],
          [230, 145],
          [350, 145],
          [435, 145],
          [535, 145],
          [660, 145],
          [760, 145],
          [850, 145],
          [1000, 145],
        ]}
        stroke={accent}
        strokeWidth={3}
      />
      <RouteLine
        points={[
          [110, 145],
          [175, 90],
          [250, 90],
          [350, 145],
        ]}
        stroke={palette.paleBlue}
        strokeWidth={2}
      />
      <RouteLine
        points={[
          [535, 145],
          [630, 95],
          [725, 95],
          [760, 145],
        ]}
        stroke={palette.paleBlue}
        strokeWidth={2}
      />
      <RouteLine
        points={[
          [760, 145],
          [810, 72],
          [900, 72],
        ]}
        stroke={palette.routeTeal}
        strokeWidth={2}
      />
      {[75, 230, 535, 760, 850].map((cx) => (
        <circle key={cx} cx={cx} cy={145} r={8} fill={palette.routeTeal} />
      ))}
      <circle cx={350} cy={145} r={8} fill={palette.platformLine} />
      <IconBubble cx={75} cy={145} r={42} icon="train" />
      <IconBubble cx={205} cy={92} r={38} icon="bus" />
      <IconBubble cx={225} cy={190} r={38} icon="tram" />
      <IconBubble cx={535} cy={145} r={42} icon="truck" />
      <IconBubble cx={690} cy={75} r={42} icon="airplane" />
      <IconBubble cx={915} cy={145} r={42} icon="ferry" />
    </>
  );
}

function SceneIllustration({
  sceneId,
  decorative,
  interactive,
  label,
  transforms,
  selected,
}: {
  sceneId: TransportSceneId;
  decorative: boolean;
  interactive: boolean;
  label: string;
  transforms: SvgGroupTransforms;
  selected: boolean;
}) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <svg
      className="transport-card__svg"
      viewBox={transportTokens.viewBox}
      preserveAspectRatio="xMidYMid slice"
      role={!decorative && !interactive ? "img" : undefined}
      aria-label={!decorative && !interactive ? label : undefined}
      aria-hidden={decorative || interactive ? true : undefined}
    >
      {sceneId === "rail_platform_empty" ? (
        <RailPlatformEmptyScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} />
      ) : null}
      {sceneId === "rail_platform_passengers" ? (
        <RailPlatformPassengersScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} />
      ) : null}
      {sceneId === "tram_stop" ? (
        <TramStopScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} />
      ) : null}
      {sceneId === "bus_stop" ? (
        <BusStopScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} />
      ) : null}
      {sceneId === "warehouse_truck" ? (
        <WarehouseTruckScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} />
      ) : null}
      {sceneId === "airplane_takeoff" ? (
        <AirplaneTakeoffScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} />
      ) : null}
      {sceneId === "ferry_port" ? (
        <FerryPortScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} />
      ) : null}
      {sceneId === "route_network" ? (
        <RouteNetworkScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} />
      ) : null}
    </svg>
  );
}

function SceneFrame({
  scene,
  state,
  decorative,
  interactive,
  captions,
  selected,
  onSelect,
}: SceneFrameProps) {
  const [parallaxRatio, setParallaxRatio] = useState(0);
  const prefersReducedMotion = useMediaFlag("(prefers-reduced-motion: reduce)");
  const canHover = useMediaFlag("(hover: hover) and (pointer: fine)");

  const transforms = useMemo<SvgGroupTransforms>(() => {
    if (!interactive || prefersReducedMotion || !canHover) {
      return { background: 0, mid: 0, foreground: 0, vehicle: 0 };
    }

    return {
      background: parallaxRatio * transportTokens.interactions.backgroundTranslateX,
      mid: parallaxRatio * transportTokens.interactions.backgroundTranslateX * 0.55,
      foreground: parallaxRatio * transportTokens.interactions.vehicleTranslateX * 0.62,
      vehicle: parallaxRatio * transportTokens.interactions.vehicleTranslateX,
    };
  }, [canHover, interactive, parallaxRatio, prefersReducedMotion]);

  const sharedProps = {
    className: "transport-card",
    "data-state": state,
    "data-selected": selected ? "true" : "false",
    style: {
      "--scene-focus-x": scene.focusX,
      "--scene-opacity": `${transportTokens.states[state].opacity}`,
      "--scene-filter": createFilter(state),
      transitionDuration: `${transportTokens.interactions.durationMs}ms`,
      transitionTimingFunction: transportTokens.interactions.easing,
    } as CSSProperties,
  };

  const media = (
    <div className="transport-card__media">
      <SceneIllustration
        sceneId={scene.id}
        decorative={decorative}
        interactive={interactive}
        label={scene.ariaLabel}
        transforms={transforms}
        selected={selected}
      />
    </div>
  );

  const content = (
    <>
      {media}
      {captions ? (
        <div className="transport-card__caption">
          <p className="transport-card__title">{scene.title}</p>
          <p className="transport-card__description">{scene.description}</p>
        </div>
      ) : null}
    </>
  );

  if (interactive && !decorative) {
    return (
      <button
        type="button"
        {...sharedProps}
        aria-label={scene.ariaLabel}
        aria-pressed={selected}
        onClick={() => onSelect?.(scene.id)}
        onPointerMove={(event) => {
          if (!canHover || prefersReducedMotion) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const ratio = (event.clientX - bounds.left) / bounds.width;
          setParallaxRatio((ratio - 0.5) * 2);
        }}
        onPointerLeave={() => setParallaxRatio(0)}
      >
        {content}
      </button>
    );
  }

  return <div {...sharedProps}>{content}</div>;
}

export function TransportBannerSet({
  layout = "auto",
  scenes = sceneOrder,
  decorative = false,
  interactive = !decorative,
  captions = true,
  className,
  selectedSceneId,
  defaultSelectedSceneId,
  onSceneSelect,
  sceneStates,
}: TransportBannerSetProps) {
  const initialScene =
    defaultSelectedSceneId ?? (interactive && !decorative ? scenes[0] ?? "rail_platform_empty" : undefined);
  const [internalSelection, setInternalSelection] = useState<TransportSceneId | undefined>(initialScene);
  const resolvedSelection = selectedSceneId ?? internalSelection;

  const resolvedScenes = scenes.map((sceneId) => transportSceneMap[sceneId]).filter(Boolean);

  const wrapperClassName = [
    "transport-banner-set",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const resolveState = (sceneId: TransportSceneId): TransportSceneState => {
    if (sceneStates?.[sceneId]) return sceneStates[sceneId] as TransportSceneState;
    if (resolvedSelection === sceneId) return "active";
    if (resolvedSelection) return interactive ? "muted" : "default";
    return "default";
  };

  const handleSelect = (sceneId: TransportSceneId) => {
    if (!interactive || decorative) return;
    setInternalSelection(sceneId);
    onSceneSelect?.(sceneId);
  };

  return (
    <div className={wrapperClassName} data-layout={layout}>
      {resolvedScenes.map((scene) => (
        <SceneFrame
          key={scene.id}
          scene={scene}
          state={resolveState(scene.id)}
          decorative={decorative}
          interactive={interactive}
          captions={captions}
          selected={resolvedSelection === scene.id}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

export {
  SceneFrame,
  SoftMountains,
  DistantCity,
  Tree,
  HumanFigure,
  StationCanopy,
  Shelter,
  RouteBoard,
  HighSpeedTrain,
  PassengerTrain,
  Tram,
  Bus,
  TruckWarehouse,
  Airplane,
  Ferry,
  RouteLine,
  IconBubble as RouteNetworkIcon,
};
