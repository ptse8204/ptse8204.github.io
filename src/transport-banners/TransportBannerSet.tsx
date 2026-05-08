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
  animate: boolean;
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
  animate = false,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  animate?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <g>
        {animate ? (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 0 80;0.6 0 80;0 0 80;-0.6 0 80;0 0 80"
            dur="7.2s"
            repeatCount="indefinite"
          />
        ) : null}
        <path d="M -6 32 C -3 26, 3 26, 6 32 L 9 82 H -9 Z" fill={palette.steelBlue} />
        <ellipse cx={-17} cy={28} rx={18} ry={20} fill={palette.treeBlueGreen} />
        <ellipse cx={0} cy={18} rx={22} ry={24} fill={palette.treeBlueGreen} />
        <ellipse cx={18} cy={30} rx={17} ry={18} fill={palette.treeBlueGreen} />
        <ellipse cx={2} cy={4} rx={16} ry={16} fill={palette.treeBlueGreen} />
        <ellipse cx={-5} cy={20} rx={30} ry={28} fill={palette.sky} opacity={0.14} />
      </g>
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
  const lean = pose === "walking_left" ? -2 : pose === "walking_right" ? 2 : 0;
  const leftLeg = pose === "walking_right" ? -3 : 1;
  const rightLeg = pose === "walking_left" ? 3 : -1;
  const leftArm = pose === "walking_right" ? 10 : 6;
  const rightArm = pose === "walking_left" ? 0 : 3;

  return (
    <g transform={`translate(${x} ${y - 42})`} fill={palette.deepBlue} opacity={0.94}>
      <circle cx={6} cy={6} r={4.6} />
      <path d={`M 6 11 C ${5 + lean} 16, ${5 + lean} 21, ${6 + lean} 27 L 7 33 L 5 42 L 3 42 L 4 33 L 2 22 Z`} />
      <path d={`M 6 16 L ${leftArm} 25 L ${leftArm - 1} 27 L 5 20 Z`} />
      <path d={`M 6 15 L ${rightArm} 25 L ${rightArm + 1} 27 L 7 20 Z`} />
      <path d={`M 6 28 L ${3 + leftLeg} 42 L ${5 + leftLeg} 42 L 8 30 Z`} />
      <path d={`M 7 28 L ${9 + rightLeg} 42 L ${11 + rightLeg} 42 L 8 30 Z`} />
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
      <rect x={x} y={y + height - 4} width={width} height={4} fill={palette.sky} opacity={0.18} />
      <polygon
        points={`${x},${y} ${x + width - 25},${y} ${x + width},${y + height} ${x},${y + height}`}
        fill={palette.canopyMid}
      />
      <rect x={x + 22} y={y + 10} width={width - 64} height={5} fill={palette.sky} opacity={0.16} />
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
          <rect x={post.x - 6} y={y + height + post.h - 1} width={12} height={4} rx={2} fill={palette.deepBlue} opacity={0.28} />
        </g>
      ))}
      {sign ? (
        <g opacity={sign.opacity ?? 0.7}>
          <rect x={sign.x} y={sign.y} width={sign.width} height={sign.height} fill={palette.city} />
          <rect x={sign.x + 6} y={sign.y + 5} width={sign.width - 12} height={4} rx={2} fill={palette.sky} opacity={0.18} />
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
      <rect x={x + 8} y={y - 9} width={width - 16} height={9} rx={1.5} fill={palette.mediumBlue} />
      <rect x={x + 15} y={y} width={width - 30} height={height} fill={fill} stroke={palette.mediumBlue} />
      <rect x={x + 15} y={y} width={4} height={height} fill={palette.mediumBlue} />
      <rect x={x + width - 19} y={y} width={4} height={height} fill={palette.mediumBlue} />
      <rect x={x + 58} y={y} width={2.5} height={height} fill={palette.mediumBlue} opacity={0.45} />
      <rect x={x + 103} y={y} width={2.5} height={height} fill={palette.mediumBlue} opacity={0.45} />
      <path d={`M ${x + 28} ${y + 7} H ${x + width - 46}`} stroke={palette.sky} strokeWidth={2.5} opacity={0.25} />
      <path d={`M ${x + 34} ${y + 16} L ${x + 22} ${y + height - 10}`} stroke={palette.sky} strokeWidth={2} opacity={0.22} />
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
      <rect x={x + 2.5} y={y + 2.5} width={width - 5} height={height - 5} fill={palette.sky} opacity={0.2} />
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
      <circle cx={x + width * 0.5} cy={y + 16} r={2} fill={palette.platformLine} />
    </g>
  );
}

function Bench({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <g stroke={palette.mediumBlue} strokeWidth={3} fill="none" strokeLinecap="round">
      <line x1={x} y1={y} x2={x + width} y2={y} />
      <line x1={x + 4} y1={y + 6} x2={x + width - 4} y2={y + 6} opacity={0.66} />
      <line x1={x + 10} y1={y} x2={x + 6} y2={y + 18} />
      <line x1={x + width - 10} y1={y} x2={x + width - 6} y2={y + 18} />
    </g>
  );
}

function Planter({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={2} fill={palette.planter} />
      <rect x={x + 4} y={y + size - 5} width={size - 8} height={3} rx={1.5} fill={palette.deepBlue} opacity={0.2} />
      <circle cx={x + size * 0.3} cy={y + 10} r={7} fill={palette.treeBlueGreen} opacity={0.92} />
      <circle cx={x + size * 0.52} cy={y + 7} r={8} fill={palette.treeBlueGreen} opacity={0.92} />
      <circle cx={x + size * 0.7} cy={y + 12} r={6} fill={palette.treeBlueGreen} opacity={0.92} />
      <path d={`M ${x + size * 0.24} ${y + 12} L ${x + size * 0.28} ${y + 5}`} stroke={palette.deepBlue} strokeWidth={1.5} opacity={0.2} />
    </g>
  );
}

function StreetLamp({ x, y, height }: { x: number; y: number; height: number }) {
  return (
    <g stroke={palette.mediumBlue} strokeWidth={3} fill="none" strokeLinecap="round">
      <line x1={x} y1={y} x2={x} y2={y + height} />
      <path d={`M ${x} ${y} C ${x} ${y - 12}, ${x + 10} ${y - 18}, ${x + 16} ${y - 18}`} />
      <line x1={x + 16} y1={y - 18} x2={x + 16} y2={y - 10} />
      <path d={`M ${x + 10} ${y - 10} H ${x + 19}`} strokeWidth={2} opacity={0.42} />
    </g>
  );
}

function MotionBlur({
  x,
  y,
  width,
  height,
  animate = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  animate?: boolean;
}) {
  return (
    <g opacity={0.5}>
      {range(5).map((line) => (
        <rect
          key={line}
          x={x}
          y={y + line * 14}
          width={width - line * 12}
          height={9 + (line % 2) * 4}
          rx={5}
          fill={line % 2 === 0 ? "#DCE7EF" : palette.sky}
          opacity={0.42 - line * 0.05}
        >
          {animate ? (
            <>
              <animate
                attributeName="x"
                values={`${x};${x + 10 + line * 2};${x}`}
                dur={`${2.6 + line * 0.45}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values={`${0.22 - line * 0.02};${0.52 - line * 0.05};${0.22 - line * 0.02}`}
                dur={`${2.6 + line * 0.45}s`}
                repeatCount="indefinite"
              />
            </>
          ) : null}
        </rect>
      ))}
      <rect x={x + 24} y={y + height - 14} width={width - 28} height={7} rx={3.5} fill={palette.sky} opacity={0.18}>
        {animate ? (
          <animate attributeName="opacity" values="0.12;0.24;0.12" dur="3.4s" repeatCount="indefinite" />
        ) : null}
      </rect>
    </g>
  );
}

function HighSpeedTrain({
  x,
  y,
  width,
  height,
  idPrefix,
  animate = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  idPrefix: string;
  animate?: boolean;
}) {
  const bodyId = `${idPrefix}-hs-body`;
  const windshieldId = `${idPrefix}-hs-wind`;
  const shadowId = `${idPrefix}-hs-shadow`;
  const bodyY = y + 3;
  const noseX = x + width - 128;

  return (
    <g>
      <defs>
        <linearGradient id={bodyId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5F8FB" />
          <stop offset="55%" stopColor={palette.vehicleWhite} />
          <stop offset="100%" stopColor="#D9E4EE" />
        </linearGradient>
        <linearGradient id={windshieldId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.deepBlue} />
          <stop offset="100%" stopColor="#315774" />
        </linearGradient>
        <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.nearBlackBlue} stopOpacity="0.72" />
          <stop offset="100%" stopColor={palette.nearBlackBlue} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d={[
          `M ${x} ${bodyY + 18}`,
          `H ${noseX - 60}`,
          `C ${noseX - 10} ${bodyY + 20}, ${noseX + 18} ${bodyY + 12}, ${noseX + 56} ${bodyY + 8}`,
          `C ${noseX + 82} ${bodyY + 10}, ${x + width - 8} ${bodyY + 30}, ${x + width} ${bodyY + 68}`,
          `L ${x + width} ${y + height - 6}`,
          `L ${x} ${y + height - 6}`,
          "Z",
        ].join(" ")}
        fill={`url(#${bodyId})`}
      />
      <path
        d={[
          `M ${x - 8} ${bodyY + 9}`,
          `H ${noseX - 18}`,
          `C ${noseX + 18} ${bodyY + 10}, ${noseX + 48} ${bodyY + 14}, ${noseX + 84} ${bodyY + 24}`,
          `L ${x + width - 14} ${bodyY + 35}`,
          `L ${x + width - 14} ${bodyY + 24}`,
          `C ${x + width - 24} ${bodyY + 10}, ${noseX + 40} ${bodyY + 4}, ${noseX - 12} ${bodyY + 3}`,
          `H ${x - 8}`,
          "Z",
        ].join(" ")}
        fill={palette.deepBlue}
        opacity={0.18}
      />
      <rect x={x + 34} y={bodyY + 40} width={width - 212} height={28} rx={5} fill={palette.deepBlue} />
      <rect x={x + 28} y={bodyY + 76} width={width - 124} height={3.5} rx={1.75} fill={palette.steelBlue} opacity={0.55} />
      <path
        d={`M ${noseX - 14} ${bodyY + 18} C ${noseX + 30} ${bodyY + 20}, ${x + width - 26} ${bodyY + 48}, ${x + width - 18} ${bodyY + 78}`}
        fill="none"
        stroke={palette.steelBlue}
        strokeWidth={3}
      />
      <path
        d={[
          `M ${noseX + 26} ${bodyY + 18}`,
          `C ${noseX + 50} ${bodyY + 22}, ${x + width - 22} ${bodyY + 40}, ${x + width - 18} ${bodyY + 70}`,
          `L ${x + width - 54} ${bodyY + 71}`,
          `C ${x + width - 58} ${bodyY + 44}, ${noseX + 44} ${bodyY + 28}, ${noseX + 24} ${bodyY + 22}`,
          "Z",
        ].join(" ")}
        fill={`url(#${windshieldId})`}
      />
      <path d={`M ${x + 14} ${bodyY + 26} H ${noseX - 46}`} stroke={palette.sky} strokeWidth={3} opacity={0.58} />
      <rect x={noseX + 79} y={bodyY + 50} width={15} height={7} rx={3.5} fill={palette.warmLight}>
        {animate ? <animate attributeName="opacity" values="0.82;1;0.82" dur="2.8s" repeatCount="indefinite" /> : null}
      </rect>
      <path d={`M ${noseX + 66} ${bodyY + 84} L ${noseX + 98} ${bodyY + 84}`} stroke={palette.nearBlackBlue} strokeWidth={4} opacity={0.55} />
      <ellipse cx={x + width - 110} cy={y + height - 4} rx={108} ry={11} fill={`url(#${shadowId})`} />
      <ellipse cx={x + width - 121} cy={y + height - 6} rx={62} ry={6.5} fill={palette.nearBlackBlue} opacity={0.34} />
    </g>
  );
}

function PassengerTrain({
  x,
  y,
  width,
  height,
  idPrefix,
  animate = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  idPrefix: string;
  animate?: boolean;
}) {
  const bodyId = `${idPrefix}-pt-body`;
  const windowId = `${idPrefix}-pt-window`;

  return (
    <g>
      <defs>
        <linearGradient id={bodyId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F4F8FB" />
          <stop offset="64%" stopColor={palette.vehicleWhite} />
          <stop offset="100%" stopColor="#D8E2EB" />
        </linearGradient>
        <linearGradient id={windowId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#21445F" />
          <stop offset="100%" stopColor="#365E7B" />
        </linearGradient>
      </defs>
      <path
        d={`M ${x} ${y + 16} H ${x + width - 102} C ${x + width - 70} ${y + 16}, ${x + width - 22} ${y + 34}, ${x + width} ${y + 82} L ${x + width} ${y + height} H ${x} Z`}
        fill={`url(#${bodyId})`}
        stroke={palette.steelBlue}
        strokeWidth={3}
      />
      <path d={`M ${x - 2} ${y + 13} H ${x + width - 106}`} stroke={palette.deepBlue} strokeWidth={5} opacity={0.12} />
      {range(6).map((windowIndex) => (
        <g key={windowIndex}>
          <rect x={x + 28 + windowIndex * 56} y={y + 20} width={42} height={31} rx={4} fill={`url(#${windowId})`} />
          <rect x={x + 31 + windowIndex * 56} y={y + 23} width={36} height={4} rx={2} fill={palette.sky} opacity={0.14} />
        </g>
      ))}
      {[
        { x: x + 330, w: 48 },
        { x: x + 570, w: 44 },
      ].map((door, index) => (
        <g key={door.x}>
          <rect x={door.x} y={y - 1} width={door.w} height={height + 1} rx={4} fill={palette.doorAmber} />
          <rect x={door.x + 8} y={y + 10} width={door.w - 16} height={height - 16} rx={3} fill={palette.windowDark} />
          <rect x={door.x + 6} y={y + 8} width={door.w - 12} height={6} rx={3} fill={palette.sky} opacity={0.14} />
          {animate && index === 0 ? (
            <rect x={door.x + 16} y={y + 28} width={8} height={30} rx={4} fill={palette.vehicleWhite} opacity={0.18}>
              <animate attributeName="opacity" values="0.05;0.22;0.05" dur="3.2s" repeatCount="indefinite" />
            </rect>
          ) : null}
        </g>
      ))}
      <path d={`M ${x + width - 96} ${y + 18} C ${x + width - 38} ${y + 24}, ${x + width - 8} ${y + 42}, ${x + width - 4} ${y + 84}`} fill="none" stroke={palette.steelBlue} strokeWidth={3} />
      <rect x={x + width - 30} y={y + 45} width={14} height={7} rx={3.5} fill={palette.warmLight}>
        {animate ? <animate attributeName="opacity" values="0.7;1;0.7" dur="2.6s" repeatCount="indefinite" /> : null}
      </rect>
    </g>
  );
}

function Tram({
  x,
  y,
  width,
  height,
  idPrefix,
  animate = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  idPrefix: string;
  animate?: boolean;
}) {
  const bodyId = `${idPrefix}-tram-body`;
  const cabId = `${idPrefix}-tram-cab`;

  return (
    <g>
      <defs>
        <linearGradient id={bodyId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EDF3F7" />
          <stop offset="100%" stopColor="#D7E3EC" />
        </linearGradient>
        <linearGradient id={cabId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#29506D" />
          <stop offset="100%" stopColor="#4A728F" />
        </linearGradient>
      </defs>
      <path d={`M ${x + 20} ${y + 1} H ${x + width - 68} C ${x + width - 32} ${y + 1}, ${x + width - 6} ${y + 18}, ${x + width - 4} ${y + 42} V ${y + height - 3} H ${x + 20} C ${x + 6} ${y + height - 3}, ${x} ${y + height - 10}, ${x} ${y + height - 22} V ${y + 20} C ${x} ${y + 8}, ${x + 7} ${y + 1}, ${x + 20} ${y + 1} Z`} fill={`url(#${bodyId})`} stroke={palette.steelBlue} strokeWidth={3} />
      <rect x={x + 32} y={y + 18} width={width - 136} height={44} rx={5} fill={palette.deepBlue} />
      <rect x={x + width - 56} y={y + 18} width={36} height={46} rx={4} fill={`url(#${cabId})`} />
      <rect x={x + 254} y={y} width={32} height={height + 1} rx={3} fill={palette.deepBlue} opacity={0.88} />
      <path d={`M ${x + 32} ${y + 64} H ${x + width - 16}`} stroke={palette.steelBlue} strokeWidth={3} opacity={0.5} />
      {range(10).map((windowIndex) => (
        <rect key={windowIndex} x={x + 40 + windowIndex * 45} y={y + 22} width={28} height={35} rx={3} fill={palette.sky} opacity={0.06} />
      ))}
      <path d={`M ${x + 185} ${y - 4} L ${x + 220} ${y - 44} L ${x + 264} ${y - 4} M ${x + 201} ${y - 23} L ${x + 246} ${y - 23}`} stroke={palette.deepBlue} strokeWidth={4} fill="none" />
      <path d={`M 0 ${y - 46} H 1000`} stroke={palette.deepBlue} strokeWidth={2} opacity={0.6} />
      <rect x={x + 198} y={y - 8} width={54} height={6} rx={3} fill={palette.deepBlue} opacity={0.45} />
      {animate ? (
        <g opacity={0.22}>
          <rect x={x + width - 38} y={y + 16} width={16} height={8} fill={palette.warmLight}>
            <animate attributeName="opacity" values="0.12;0.28;0.12" dur="2.5s" repeatCount="indefinite" />
          </rect>
        </g>
      ) : null}
    </g>
  );
}

function Bus({
  x,
  y,
  width,
  height,
  idPrefix,
  animate = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  idPrefix: string;
  animate?: boolean;
}) {
  const bodyId = `${idPrefix}-bus-body`;
  const glassId = `${idPrefix}-bus-glass`;

  return (
    <g>
      <defs>
        <linearGradient id={bodyId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F2F7FA" />
          <stop offset="100%" stopColor="#D9E4ED" />
        </linearGradient>
        <linearGradient id={glassId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#23455F" />
          <stop offset="100%" stopColor="#3C6480" />
        </linearGradient>
      </defs>
      <path d={`M ${x + 14} ${y} H ${x + width - 54} C ${x + width - 18} ${y} ${x + width} ${y + 12} ${x + width} ${y + 40} V ${y + height - 20} C ${x + width} ${y + height - 6} ${x + width - 8} ${y + height} ${x + width - 24} ${y + height} H ${x + 18} C ${x + 6} ${y + height} ${x} ${y + height - 8} ${x} ${y + height - 22} V ${y + 20} C ${x} ${y + 8} ${x + 6} ${y} ${x + 14} ${y} Z`} fill={`url(#${bodyId})`} stroke={palette.steelBlue} strokeWidth={3} />
      <rect x={x + 22} y={y + 15} width={width - 96} height={49} rx={5} fill={`url(#${glassId})`} />
      <rect x={x + 215} y={y + 13} width={44} height={78} rx={4} fill={palette.doorAmber} opacity={0.92} />
      <rect x={x + 222} y={y + 18} width={30} height={68} rx={3} fill={palette.windowDark} />
      <path d={`M ${x + width - 62} ${y + 12} H ${x + width - 20} V ${y + 64} H ${x + width - 48}`} fill={palette.deepBlue} />
      <path d={`M ${x + 18} ${y + 72} H ${x + width - 28}`} stroke={palette.steelBlue} strokeWidth={3} opacity={0.42} />
      <circle cx={x + 85} cy={y + height - 2} r={22} fill={palette.nearBlackBlue} />
      <circle cx={x + width - 80} cy={y + height - 2} r={22} fill={palette.nearBlackBlue} />
      <circle cx={x + 85} cy={y + height - 2} r={10} fill={palette.steelBlue} opacity={0.25} />
      <circle cx={x + width - 80} cy={y + height - 2} r={10} fill={palette.steelBlue} opacity={0.25} />
      <rect x={x + width - 20} y={y + 61} width={10} height={6} rx={2.5} fill={palette.warmLight}>
        {animate ? <animate attributeName="opacity" values="0.72;1;0.72" dur="2.4s" repeatCount="indefinite" /> : null}
      </rect>
    </g>
  );
}

function TruckWarehouse({
  x,
  y,
  idPrefix,
  animate = false,
}: {
  x: number;
  y: number;
  idPrefix: string;
  animate?: boolean;
}) {
  const trailerId = `${idPrefix}-truck-trailer`;
  const cabId = `${idPrefix}-truck-cab`;

  return (
    <g>
      <defs>
        <linearGradient id={trailerId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1B4060" />
          <stop offset="100%" stopColor="#102F49" />
        </linearGradient>
        <linearGradient id={cabId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F2F6FA" />
          <stop offset="100%" stopColor="#DDE7EF" />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={250} height={88} fill={`url(#${trailerId})`} />
      <rect x={x + 250} y={y + 16} width={95} height={72} rx={10} fill={`url(#${cabId})`} stroke={palette.steelBlue} strokeWidth={3} />
      <path d={`M ${x + 278} ${y + 25} H ${x + 314} V ${y + 54} H ${x + 268} C ${x + 266} ${y + 44}, ${x + 270} ${y + 30}, ${x + 278} ${y + 25} Z`} fill={palette.deepBlue} />
      <rect x={x + 250} y={y + 48} width={95} height={4} fill={palette.steelBlue} opacity={0.55} />
      <rect x={x + 332} y={y + 66} width={11} height={6} rx={2} fill={palette.warmLight}>
        {animate ? <animate attributeName="opacity" values="0.55;0.95;0.55" dur="2.6s" repeatCount="indefinite" /> : null}
      </rect>
      <rect x={x + 235} y={y + 58} width={18} height={16} rx={2} fill={palette.nearBlackBlue} opacity={0.4} />
      <circle cx={x + 65} cy={y + 89} r={18} fill={palette.nearBlackBlue} />
      <circle cx={x + 300} cy={y + 89} r={18} fill={palette.nearBlackBlue} />
      <circle cx={x + 65} cy={y + 89} r={8} fill={palette.steelBlue} opacity={0.22} />
      <circle cx={x + 300} cy={y + 89} r={8} fill={palette.steelBlue} opacity={0.22} />
    </g>
  );
}

function Airplane({
  x,
  y,
  rotation = -11,
  idPrefix,
  animate = false,
}: {
  x: number;
  y: number;
  rotation?: number;
  idPrefix: string;
  animate?: boolean;
}) {
  const bodyId = `${idPrefix}-plane-body`;
  const wingId = `${idPrefix}-plane-wing`;
  const engineId = `${idPrefix}-plane-engine`;

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
      <defs>
        <linearGradient id={bodyId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F7FAFC" />
          <stop offset="100%" stopColor="#DCE7EF" />
        </linearGradient>
        <linearGradient id={wingId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8AA8BF" />
          <stop offset="100%" stopColor="#6A8BA5" />
        </linearGradient>
        <linearGradient id={engineId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#53708A" />
          <stop offset="100%" stopColor="#36526B" />
        </linearGradient>
      </defs>
      <path
        d="M 6 46 C 48 26, 104 18, 186 19 H 316 C 365 18, 399 28, 430 42 C 397 56, 365 61, 316 61 H 185 C 98 61, 45 56, 0 48 Z"
        fill={`url(#${bodyId})`}
        stroke={palette.steelBlue}
        strokeWidth={2.5}
      />
      <path d="M 373 32 C 401 33, 425 38, 448 46 C 425 54, 403 58, 375 59 Z" fill={`url(#${bodyId})`} stroke={palette.steelBlue} strokeWidth={2.5} />
      <path d="M 146 53 L 264 134 H 315 L 207 50 Z" fill={`url(#${wingId})`} />
      <path d="M 46 40 L 104 -18 H 145 L 99 43 Z" fill={`url(#${wingId})`} />
      <path d="M 56 54 L 109 93 H 142 L 98 52 Z" fill={`url(#${wingId})`} />
      <ellipse cx={234} cy={88} rx={22} ry={15} fill={`url(#${engineId})`} />
      <ellipse cx={325} cy={76} rx={20} ry={13} fill={`url(#${engineId})`} />
      <ellipse cx={234} cy={88} rx={11} ry={7} fill={palette.nearBlackBlue} opacity={0.32} />
      <ellipse cx={325} cy={76} rx={10} ry={6} fill={palette.nearBlackBlue} opacity={0.32} />
      {range(17).map((windowIndex) => (
        <circle key={windowIndex} cx={107 + windowIndex * 13} cy={33} r={2.15} fill={palette.mediumBlue} />
      ))}
      <path d="M 227 101 L 227 126 M 322 88 L 322 116" stroke={palette.nearBlackBlue} strokeWidth={4} />
      <circle cx={227} cy={128} r={5.5} fill={palette.nearBlackBlue} />
      <circle cx={322} cy={118} r={5.5} fill={palette.nearBlackBlue} />
      {animate ? (
        <path d="M -54 48 C -10 44, 18 44, 46 48" stroke={palette.sky} strokeWidth={12} opacity={0.18} fill="none">
          <animate attributeName="opacity" values="0.1;0.26;0.1" dur="3.6s" repeatCount="indefinite" />
        </path>
      ) : null}
    </g>
  );
}

function Ferry({
  x,
  y,
  idPrefix,
  animate = false,
}: {
  x: number;
  y: number;
  idPrefix: string;
  animate?: boolean;
}) {
  const hullId = `${idPrefix}-ferry-hull`;
  const deckId = `${idPrefix}-ferry-deck`;

  return (
    <g>
      <defs>
        <linearGradient id={hullId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#153754" />
          <stop offset="100%" stopColor="#0E2A43" />
        </linearGradient>
        <linearGradient id={deckId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F4F8FB" />
          <stop offset="100%" stopColor="#DCE6EE" />
        </linearGradient>
      </defs>
      <path d={`M ${x} ${y + 24} H ${x + 246} C ${x + 264} ${y + 25}, ${x + 274} ${y + 34}, ${x + 286} ${y + 49} H ${x + 26} Z`} fill={`url(#${hullId})`} />
      <rect x={x + 42} y={y - 18} width={210} height={55} rx={6} fill={`url(#${deckId})`} stroke={palette.steelBlue} strokeWidth={3} />
      <rect x={x + 58} y={y - 1} width={172} height={21} rx={4} fill={palette.deepBlue} />
      <rect x={x + 178} y={y - 40} width={74} height={48} rx={4} fill={`url(#${deckId})`} stroke={palette.steelBlue} strokeWidth={2.5} />
      <path d={`M ${x + 224} ${y - 61} V ${y - 15} M ${x + 236} ${y - 48} L ${x + 224} ${y - 42}`} stroke={palette.deepBlue} strokeWidth={4} fill="none" />
      {range(9).map((windowIndex) => (
        <rect key={windowIndex} x={x + 60 + windowIndex * 18} y={y + 3} width={11} height={8} rx={2} fill={palette.vehicleWhite} opacity={0.82} />
      ))}
      {range(4).map((windowIndex) => (
        <rect key={`top-${windowIndex}`} x={x + 187 + windowIndex * 14} y={y - 28} width={9} height={7} rx={1.8} fill={palette.deepBlue} opacity={0.82} />
      ))}
      {animate ? (
        <path d={`M ${x - 40} ${y + 49} C ${x - 10} ${y + 40}, ${x + 18} ${y + 40}, ${x + 54} ${y + 49}`} stroke={palette.sky} strokeWidth={8} fill="none" opacity={0.72}>
          <animate attributeName="d" values={`M ${x - 40} ${y + 49} C ${x - 10} ${y + 40}, ${x + 18} ${y + 40}, ${x + 54} ${y + 49};M ${x - 44} ${y + 48} C ${x - 12} ${y + 37}, ${x + 20} ${y + 37}, ${x + 58} ${y + 48};M ${x - 40} ${y + 49} C ${x - 10} ${y + 40}, ${x + 18} ${y + 40}, ${x + 54} ${y + 49}`} dur="3.8s" repeatCount="indefinite" />
        </path>
      ) : null}
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

function WaterLines({ animate = false }: { animate?: boolean }) {
  return (
    <g opacity={0.5} stroke={palette.paleBlue} strokeWidth={2}>
      {range(6).map((line) => (
        <line
          key={line}
          x1={80 + line * 140}
          y1={205 + (line % 2) * 5}
          x2={180 + line * 140}
          y2={205 + (line % 2) * 5}
        >
          {animate ? (
            <animate
              attributeName="opacity"
              values={`${0.2 + (line % 2) * 0.1};${0.65 - line * 0.05};${0.2 + (line % 2) * 0.1}`}
              dur={`${3.2 + line * 0.25}s`}
              repeatCount="indefinite"
            />
          ) : null}
        </line>
      ))}
    </g>
  );
}

function GenericBackdrop({
  gradientId,
  from,
  to,
  animate = false,
}: {
  gradientId: string;
  from: string;
  to: string;
  animate?: boolean;
}) {
  const mistId = `${gradientId}-mist`;
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <radialGradient id={mistId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.sky} stopOpacity="0.75" />
          <stop offset="100%" stopColor={palette.sky} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1000} height={250} fill={`url(#${gradientId})`} />
      <rect x={0} y={152} width={1000} height={98} fill={palette.mist} opacity={0.28} />
      <ellipse cx={210} cy={56} rx={220} ry={42} fill={`url(#${mistId})`} opacity={0.28}>
        {animate ? <animate attributeName="cx" values="210;238;210" dur="11s" repeatCount="indefinite" /> : null}
      </ellipse>
      <ellipse cx={714} cy={78} rx={260} ry={58} fill={`url(#${mistId})`} opacity={0.2}>
        {animate ? <animate attributeName="cx" values="714;680;714" dur="13s" repeatCount="indefinite" /> : null}
      </ellipse>
    </>
  );
}

function RailPlatformEmptyScene({ ids, transforms, animate }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E1EAF1" animate={animate} />
      <g transform={`translate(${transforms.background} 0)`}>
        <SoftMountains x={360} y={115} w={360} h={55} fill={palette.paleBlue} opacity={0.3} />
        <Tree x={590} y={98} scale={0.92} opacity={0.45} animate={animate} />
        <Tree x={680} y={103} scale={0.76} opacity={0.38} animate={animate} />
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
        <MotionBlur x={0} y={102} width={162} height={78} animate={animate} />
        <HighSpeedTrain x={-80} y={99} width={505} height={88} idPrefix={ids.gradient} animate={animate} />
      </g>
      <g transform={`translate(${transforms.foreground} 0)`}>
        <Bench x={550} y={180} width={68} />
        <Planter x={635} y={176} size={28} />
        <StreetLamp x={780} y={62} height={134} />
      </g>
      <line x1={0} y1={199} x2={1000} y2={199} stroke={palette.platformGround} strokeWidth={3} />
      <line x1={0} y1={196} x2={1000} y2={196} stroke={palette.platformLine} strokeWidth={3} />
      <line x1={0} y1={193} x2={1000} y2={193} stroke={palette.sky} strokeWidth={1.5} opacity={0.34} />
    </>
  );
}

function RailPlatformPassengersScene({ ids, transforms, animate }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E1EAF1" animate={animate} />
      <g transform={`translate(${transforms.background} 0)`}>
        <Tree x={745} y={111} scale={0.85} opacity={0.5} animate={animate} />
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
        <MotionBlur x={0} y={106} width={120} height={70} animate={animate} />
        <PassengerTrain x={-35} y={105} width={685} height={84} idPrefix={ids.gradient} animate={animate} />
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
      <line x1={0} y1={200} x2={1000} y2={200} stroke={palette.platformGround} strokeWidth={3} opacity={0.75} />
    </>
  );
}

function TramStopScene({ ids, transforms, animate }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E5EDF3" animate={animate} />
      <g transform={`translate(${transforms.background} 0)`}>
        <DistantCity x={490} y={40} w={310} h={130} opacity={0.22} />
        <Tree x={850} y={85} scale={1.2} opacity={0.55} animate={animate} />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <MotionBlur x={0} y={100} width={160} height={80} animate={animate} />
        <Tram x={70} y={102} width={585} height={86} idPrefix={ids.gradient} animate={animate} />
      </g>
      <g transform={`translate(${transforms.foreground} 0)`}>
        <Shelter x={690} y={135} width={160} height={58} />
        <RouteBoard x={865} y={105} width={35} height={90} />
        <HumanFigure x={675} y={155} pose="standing" />
        <HumanFigure x={720} y={155} pose="standing" />
        <HumanFigure x={770} y={155} pose="standing" />
        <HumanFigure x={820} y={155} pose="standing" />
      </g>
      <line x1={0} y1={199} x2={1000} y2={199} stroke={palette.platformGround} strokeWidth={2.5} opacity={0.55} />
    </>
  );
}

function BusStopScene({ ids, transforms, animate }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E5EDF3" animate={animate} />
      <g transform={`translate(${transforms.background} 0)`}>
        <DistantCity x={535} y={50} w={275} h={132} opacity={0.2} />
        <Tree x={840} y={83} scale={1.15} opacity={0.58} animate={animate} />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <MotionBlur x={0} y={98} width={85} height={82} animate={animate} />
        <Bus x={75} y={94} width={465} height={98} idPrefix={ids.gradient} animate={animate} />
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
      <line x1={0} y1={198} x2={1000} y2={198} stroke={palette.platformGround} strokeWidth={2.5} opacity={0.52} />
    </>
  );
}

function WarehouseTruckScene({ ids, transforms, animate }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E4ECF3" animate={animate} />
      <g transform={`translate(${transforms.background} 0)`}>
        <SoftMountains x={80} y={78} w={420} h={80} fill={palette.paleBlue} opacity={0.28} />
        <Tree x={925} y={115} scale={0.82} opacity={0.5} animate={animate} />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <MotionBlur x={0} y={103} width={150} height={80} animate={animate} />
        <TruckWarehouse x={95} y={99} idPrefix={ids.gradient} animate={animate} />
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
            <rect x={door.x + 8} y={88} width={64} height={4} rx={2} fill={palette.sky} opacity={0.18} />
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
      <line x1={0} y1={196} x2={1000} y2={196} stroke={palette.platformGround} strokeWidth={3} opacity={0.55} />
    </>
  );
}

function AirplaneTakeoffScene({ ids, transforms, animate }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E5EDF3" animate={animate} />
      <g transform={`translate(${transforms.background} 0)`}>
        <rect x={40} y={115} width={190} height={70} fill={palette.platformGround} opacity={0.62} />
        <rect x={92} y={64} width={52} height={118} fill={palette.warehouseBlue} opacity={0.7} />
        <rect x={100} y={54} width={36} height={18} rx={4} fill={palette.deepBlue} opacity={0.3} />
        <SoftMountains x={535} y={120} w={340} h={54} fill={palette.paleBlue} opacity={0.3} />
        <path d="M 885 86 L 914 79 L 944 88 M 907 83 L 925 69 M 907 83 L 925 96" stroke={palette.city} strokeWidth={3} fill="none" opacity={0.7} />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <MotionBlur x={324} y={100} width={120} height={34} animate={animate} />
        <Airplane x={365} y={66} idPrefix={ids.gradient} animate={animate} />
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
          >
            {animate ? (
              <animate
                attributeName="opacity"
                values={`${0.3 + (light % 2) * 0.15};1;${0.3 + (light % 2) * 0.15}`}
                dur={`${2.3 + light * 0.08}s`}
                repeatCount="indefinite"
              />
            ) : null}
          </circle>
        ))}
      </g>
    </>
  );
}

function FerryPortScene({ ids, transforms, animate }: SceneRenderProps) {
  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E1EAF1" animate={animate} />
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
        <WaterLines animate={animate} />
      </g>
      <g transform={`translate(${transforms.vehicle} 0)`}>
        <Ferry x={470} y={145} idPrefix={ids.gradient} animate={animate} />
        <path d="M 430 192 C 450 180, 490 182, 540 192" stroke={palette.sky} strokeWidth={8} fill="none" opacity={0.8}>
          {animate ? <animate attributeName="opacity" values="0.52;0.9;0.52" dur="3.4s" repeatCount="indefinite" /> : null}
        </path>
      </g>
    </>
  );
}

function RouteNetworkScene({ ids, selected, animate }: SceneRenderProps) {
  const accent = selected ? palette.platformLine : palette.routeTeal;

  return (
    <>
      <GenericBackdrop gradientId={ids.gradient} from={palette.sky} to="#E7EEF4" animate={animate} />
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
        stroke={palette.sky}
        strokeWidth={1.25}
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
      {animate ? (
        <g stroke={palette.routeTeal} strokeWidth={3} fill="none" strokeDasharray="1 18" strokeLinecap="round" opacity={0.65}>
          <path d="M 0 145 H 1000">
            <animate attributeName="stroke-dashoffset" values="0;-120" dur="7s" repeatCount="indefinite" />
          </path>
        </g>
      ) : null}
      {[75, 230, 535, 760, 850].map((cx, index) => (
        <circle key={cx} cx={cx} cy={145} r={8} fill={palette.routeTeal}>
          {animate ? (
            <animate attributeName="r" values="7.2;8.8;7.2" dur={`${2.2 + index * 0.3}s`} repeatCount="indefinite" />
          ) : null}
        </circle>
      ))}
      <circle cx={350} cy={145} r={8} fill={palette.platformLine}>
        {animate ? <animate attributeName="r" values="7;10;7" dur="2.6s" repeatCount="indefinite" /> : null}
      </circle>
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
  animate,
}: {
  sceneId: TransportSceneId;
  decorative: boolean;
  interactive: boolean;
  label: string;
  transforms: SvgGroupTransforms;
  selected: boolean;
  animate: boolean;
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
        <RailPlatformEmptyScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} animate={animate} />
      ) : null}
      {sceneId === "rail_platform_passengers" ? (
        <RailPlatformPassengersScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} animate={animate} />
      ) : null}
      {sceneId === "tram_stop" ? (
        <TramStopScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} animate={animate} />
      ) : null}
      {sceneId === "bus_stop" ? (
        <BusStopScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} animate={animate} />
      ) : null}
      {sceneId === "warehouse_truck" ? (
        <WarehouseTruckScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} animate={animate} />
      ) : null}
      {sceneId === "airplane_takeoff" ? (
        <AirplaneTakeoffScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} animate={animate} />
      ) : null}
      {sceneId === "ferry_port" ? (
        <FerryPortScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} animate={animate} />
      ) : null}
      {sceneId === "route_network" ? (
        <RouteNetworkScene ids={{ gradient: gradientId }} transforms={transforms} selected={selected} animate={animate} />
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
  const animateScene = !prefersReducedMotion;

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
        animate={animateScene}
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
