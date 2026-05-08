import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useId, useMemo, useState } from "react";
import { transportSceneMap, transportScenes, transportTokens, } from "./transportTokens.js";
const sceneOrder = transportScenes.map((scene) => scene.id);
const palette = transportTokens.palette;
function useMediaFlag(query) {
    const getInitialValue = () => typeof window !== "undefined" ? window.matchMedia(query).matches : false;
    const [matches, setMatches] = useState(getInitialValue);
    useEffect(() => {
        if (typeof window === "undefined")
            return undefined;
        const media = window.matchMedia(query);
        const update = () => setMatches(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, [query]);
    return matches;
}
function createFilter(state) {
    const current = transportTokens.states[state];
    return `saturate(${current.saturation}) contrast(${current.contrast})`;
}
function range(count) {
    return Array.from({ length: count }, (_, index) => index);
}
function SoftMountains({ x, y, w, h, fill, opacity = 0.3, }) {
    const d = [
        `M ${x} ${y + h}`,
        `C ${x + w * 0.1} ${y + h * 0.45}, ${x + w * 0.2} ${y + h * 0.08}, ${x + w * 0.32} ${y + h * 0.48}`,
        `C ${x + w * 0.43} ${y + h * 0.84}, ${x + w * 0.55} ${y + h * 0.12}, ${x + w * 0.66} ${y + h * 0.42}`,
        `C ${x + w * 0.77} ${y + h * 0.76}, ${x + w * 0.9} ${y + h * 0.2}, ${x + w} ${y + h * 0.52}`,
        `L ${x + w} ${y + h}`,
        "Z",
    ].join(" ");
    return _jsx("path", { d: d, fill: fill, opacity: opacity });
}
function DistantCity({ x, y, w, h, opacity = 0.22, }) {
    const buildings = [
        { x: 0, w: 42, h: 80 },
        { x: 56, w: 34, h: 112 },
        { x: 106, w: 48, h: 96 },
        { x: 176, w: 38, h: 126 },
        { x: 228, w: 62, h: 102 },
    ];
    return (_jsxs("g", { transform: `translate(${x} ${y})`, opacity: opacity, children: [buildings.map((building, index) => {
                const top = h - building.h;
                return (_jsxs("g", { children: [_jsx("rect", { x: building.x, y: top, width: building.w, height: building.h, fill: palette.city }), range(3).map((column) => (_jsx("rect", { x: building.x + 7 + column * 10, y: top + 18, width: 3, height: building.h - 30, fill: palette.sky, opacity: 0.25 }, column)))] }, `${building.x}-${index}`));
            }), _jsx("rect", { x: 0, y: h - 6, width: w, height: 6, fill: palette.horizon, opacity: 0.55 })] }));
}
function Tree({ x, y, scale = 1, opacity = 0.65, animate = false, }) {
    return (_jsx("g", { transform: `translate(${x} ${y}) scale(${scale})`, opacity: opacity, children: _jsxs("g", { children: [animate ? (_jsx("animateTransform", { attributeName: "transform", type: "rotate", values: "0 0 80;0.6 0 80;0 0 80;-0.6 0 80;0 0 80", dur: "7.2s", repeatCount: "indefinite" })) : null, _jsx("path", { d: "M -6 32 C -3 26, 3 26, 6 32 L 9 82 H -9 Z", fill: palette.steelBlue }), _jsx("ellipse", { cx: -17, cy: 28, rx: 18, ry: 20, fill: palette.treeBlueGreen }), _jsx("ellipse", { cx: 0, cy: 18, rx: 22, ry: 24, fill: palette.treeBlueGreen }), _jsx("ellipse", { cx: 18, cy: 30, rx: 17, ry: 18, fill: palette.treeBlueGreen }), _jsx("ellipse", { cx: 2, cy: 4, rx: 16, ry: 16, fill: palette.treeBlueGreen }), _jsx("ellipse", { cx: -5, cy: 20, rx: 30, ry: 28, fill: palette.sky, opacity: 0.14 })] }) }));
}
function HumanFigure({ x, y, pose = "standing", bag = false, luggage = false, }) {
    const lean = pose === "walking_left" ? -2 : pose === "walking_right" ? 2 : 0;
    const leftLeg = pose === "walking_right" ? -3 : 1;
    const rightLeg = pose === "walking_left" ? 3 : -1;
    const leftArm = pose === "walking_right" ? 10 : 6;
    const rightArm = pose === "walking_left" ? 0 : 3;
    return (_jsxs("g", { transform: `translate(${x} ${y - 42})`, fill: palette.deepBlue, opacity: 0.94, children: [_jsx("circle", { cx: 6, cy: 6, r: 4.6 }), _jsx("path", { d: `M 6 11 C ${5 + lean} 16, ${5 + lean} 21, ${6 + lean} 27 L 7 33 L 5 42 L 3 42 L 4 33 L 2 22 Z` }), _jsx("path", { d: `M 6 16 L ${leftArm} 25 L ${leftArm - 1} 27 L 5 20 Z` }), _jsx("path", { d: `M 6 15 L ${rightArm} 25 L ${rightArm + 1} 27 L 7 20 Z` }), _jsx("path", { d: `M 6 28 L ${3 + leftLeg} 42 L ${5 + leftLeg} 42 L 8 30 Z` }), _jsx("path", { d: `M 7 28 L ${9 + rightLeg} 42 L ${11 + rightLeg} 42 L 8 30 Z` }), bag ? _jsx("rect", { x: 10, y: 18, width: 5, height: 7, rx: 1.5 }) : null, luggage ? (_jsxs("g", { children: [_jsx("rect", { x: 13, y: 27, width: 7, height: 11, rx: 1.5 }), _jsx("rect", { x: 15, y: 23, width: 3, height: 4, rx: 1 }), _jsx("path", { d: "M 12 24 L 16 20", stroke: palette.deepBlue, strokeWidth: 1.5, fill: "none" })] })) : null] }));
}
function StationCanopy({ x, y, width, height, posts, sign, }) {
    return (_jsxs("g", { children: [_jsx("rect", { x: x, y: y, width: width, height: height, fill: palette.deepBlue }), _jsx("rect", { x: x, y: y + height - 4, width: width, height: 4, fill: palette.sky, opacity: 0.18 }), _jsx("polygon", { points: `${x},${y} ${x + width - 25},${y} ${x + width},${y + height} ${x},${y + height}`, fill: palette.canopyMid }), _jsx("rect", { x: x + 22, y: y + 10, width: width - 64, height: 5, fill: palette.sky, opacity: 0.16 }), posts.map((post) => (_jsxs("g", { children: [_jsx("rect", { x: post.x - 3, y: y + height - 1, width: 6, height: post.h, fill: palette.deepBlue }), _jsx("path", { d: `M ${post.x - 2} ${y + height} L ${post.x - 15} ${y + height - 18} M ${post.x + 2} ${y + height} L ${post.x + 15} ${y + height - 18}`, stroke: palette.deepBlue, strokeWidth: 4, fill: "none", strokeLinecap: "round" }), _jsx("rect", { x: post.x - 6, y: y + height + post.h - 1, width: 12, height: 4, rx: 2, fill: palette.deepBlue, opacity: 0.28 })] }, `${post.x}-${post.h}`))), sign ? (_jsxs("g", { opacity: sign.opacity ?? 0.7, children: [_jsx("rect", { x: sign.x, y: sign.y, width: sign.width, height: sign.height, fill: palette.city }), _jsx("rect", { x: sign.x + 6, y: sign.y + 5, width: sign.width - 12, height: 4, rx: 2, fill: palette.sky, opacity: 0.18 }), _jsx("path", { d: `M ${sign.x + 8} ${sign.y} L ${sign.x + 8} ${sign.y - 14} M ${sign.x + sign.width - 8} ${sign.y} L ${sign.x + sign.width - 8} ${sign.y - 14}`, stroke: palette.deepBlue, strokeWidth: 2 })] })) : null] }));
}
function Shelter({ x, y, width, height, fill = "rgba(196,214,227,0.25)", }) {
    return (_jsxs("g", { children: [_jsx("rect", { x: x + 8, y: y - 9, width: width - 16, height: 9, rx: 1.5, fill: palette.mediumBlue }), _jsx("rect", { x: x + 15, y: y, width: width - 30, height: height, fill: fill, stroke: palette.mediumBlue }), _jsx("rect", { x: x + 15, y: y, width: 4, height: height, fill: palette.mediumBlue }), _jsx("rect", { x: x + width - 19, y: y, width: 4, height: height, fill: palette.mediumBlue }), _jsx("rect", { x: x + 58, y: y, width: 2.5, height: height, fill: palette.mediumBlue, opacity: 0.45 }), _jsx("rect", { x: x + 103, y: y, width: 2.5, height: height, fill: palette.mediumBlue, opacity: 0.45 }), _jsx("path", { d: `M ${x + 28} ${y + 7} H ${x + width - 46}`, stroke: palette.sky, strokeWidth: 2.5, opacity: 0.25 }), _jsx("path", { d: `M ${x + 34} ${y + 16} L ${x + 22} ${y + height - 10}`, stroke: palette.sky, strokeWidth: 2, opacity: 0.22 })] }));
}
function RouteBoard({ x, y, width, height, }) {
    return (_jsxs("g", { children: [_jsx("rect", { x: x, y: y, width: width, height: height, fill: palette.vehicleWhite, stroke: palette.mediumBlue }), _jsx("rect", { x: x + 2.5, y: y + 2.5, width: width - 5, height: height - 5, fill: palette.sky, opacity: 0.2 }), _jsx("rect", { x: x + width * 0.5 - 1.5, y: y + height, width: 3, height: 8, fill: palette.mediumBlue }), range(6).map((line) => (_jsx("rect", { x: x + 6, y: y + 8 + line * 10, width: width - 12 - (line % 2) * 5, height: 2.5, rx: 1.2, fill: palette.mediumBlue, opacity: 0.78 }, line))), _jsx("circle", { cx: x + width * 0.5, cy: y + 16, r: 2, fill: palette.platformLine })] }));
}
function Bench({ x, y, width }) {
    return (_jsxs("g", { stroke: palette.mediumBlue, strokeWidth: 3, fill: "none", strokeLinecap: "round", children: [_jsx("line", { x1: x, y1: y, x2: x + width, y2: y }), _jsx("line", { x1: x + 4, y1: y + 6, x2: x + width - 4, y2: y + 6, opacity: 0.66 }), _jsx("line", { x1: x + 10, y1: y, x2: x + 6, y2: y + 18 }), _jsx("line", { x1: x + width - 10, y1: y, x2: x + width - 6, y2: y + 18 })] }));
}
function Planter({ x, y, size }) {
    return (_jsxs("g", { children: [_jsx("rect", { x: x, y: y, width: size, height: size, rx: 2, fill: palette.planter }), _jsx("rect", { x: x + 4, y: y + size - 5, width: size - 8, height: 3, rx: 1.5, fill: palette.deepBlue, opacity: 0.2 }), _jsx("circle", { cx: x + size * 0.3, cy: y + 10, r: 7, fill: palette.treeBlueGreen, opacity: 0.92 }), _jsx("circle", { cx: x + size * 0.52, cy: y + 7, r: 8, fill: palette.treeBlueGreen, opacity: 0.92 }), _jsx("circle", { cx: x + size * 0.7, cy: y + 12, r: 6, fill: palette.treeBlueGreen, opacity: 0.92 }), _jsx("path", { d: `M ${x + size * 0.24} ${y + 12} L ${x + size * 0.28} ${y + 5}`, stroke: palette.deepBlue, strokeWidth: 1.5, opacity: 0.2 })] }));
}
function StreetLamp({ x, y, height }) {
    return (_jsxs("g", { stroke: palette.mediumBlue, strokeWidth: 3, fill: "none", strokeLinecap: "round", children: [_jsx("line", { x1: x, y1: y, x2: x, y2: y + height }), _jsx("path", { d: `M ${x} ${y} C ${x} ${y - 12}, ${x + 10} ${y - 18}, ${x + 16} ${y - 18}` }), _jsx("line", { x1: x + 16, y1: y - 18, x2: x + 16, y2: y - 10 }), _jsx("path", { d: `M ${x + 10} ${y - 10} H ${x + 19}`, strokeWidth: 2, opacity: 0.42 })] }));
}
function MotionBlur({ x, y, width, height, animate = false, }) {
    return (_jsxs("g", { opacity: 0.5, children: [range(5).map((line) => (_jsx("rect", { x: x, y: y + line * 14, width: width - line * 12, height: 9 + (line % 2) * 4, rx: 5, fill: line % 2 === 0 ? "#DCE7EF" : palette.sky, opacity: 0.42 - line * 0.05, children: animate ? (_jsxs(_Fragment, { children: [_jsx("animate", { attributeName: "x", values: `${x};${x + 10 + line * 2};${x}`, dur: `${2.6 + line * 0.45}s`, repeatCount: "indefinite" }), _jsx("animate", { attributeName: "opacity", values: `${0.22 - line * 0.02};${0.52 - line * 0.05};${0.22 - line * 0.02}`, dur: `${2.6 + line * 0.45}s`, repeatCount: "indefinite" })] })) : null }, line))), _jsx("rect", { x: x + 24, y: y + height - 14, width: width - 28, height: 7, rx: 3.5, fill: palette.sky, opacity: 0.18, children: animate ? (_jsx("animate", { attributeName: "opacity", values: "0.12;0.24;0.12", dur: "3.4s", repeatCount: "indefinite" })) : null })] }));
}
function HighSpeedTrain({ x, y, width, height, idPrefix, animate = false, }) {
    const bodyId = `${idPrefix}-hs-body`;
    const windshieldId = `${idPrefix}-hs-wind`;
    const shadowId = `${idPrefix}-hs-shadow`;
    const bodyY = y + 3;
    const noseX = x + width - 128;
    return (_jsxs("g", { children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: bodyId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#F5F8FB" }), _jsx("stop", { offset: "55%", stopColor: palette.vehicleWhite }), _jsx("stop", { offset: "100%", stopColor: "#D9E4EE" })] }), _jsxs("linearGradient", { id: windshieldId, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: palette.deepBlue }), _jsx("stop", { offset: "100%", stopColor: "#315774" })] }), _jsxs("radialGradient", { id: shadowId, cx: "50%", cy: "50%", r: "50%", children: [_jsx("stop", { offset: "0%", stopColor: palette.nearBlackBlue, stopOpacity: "0.72" }), _jsx("stop", { offset: "100%", stopColor: palette.nearBlackBlue, stopOpacity: "0" })] })] }), _jsx("path", { d: [
                    `M ${x} ${bodyY + 18}`,
                    `H ${noseX - 60}`,
                    `C ${noseX - 10} ${bodyY + 20}, ${noseX + 18} ${bodyY + 12}, ${noseX + 56} ${bodyY + 8}`,
                    `C ${noseX + 82} ${bodyY + 10}, ${x + width - 8} ${bodyY + 30}, ${x + width} ${bodyY + 68}`,
                    `L ${x + width} ${y + height - 6}`,
                    `L ${x} ${y + height - 6}`,
                    "Z",
                ].join(" "), fill: `url(#${bodyId})` }), _jsx("path", { d: [
                    `M ${x - 8} ${bodyY + 9}`,
                    `H ${noseX - 18}`,
                    `C ${noseX + 18} ${bodyY + 10}, ${noseX + 48} ${bodyY + 14}, ${noseX + 84} ${bodyY + 24}`,
                    `L ${x + width - 14} ${bodyY + 35}`,
                    `L ${x + width - 14} ${bodyY + 24}`,
                    `C ${x + width - 24} ${bodyY + 10}, ${noseX + 40} ${bodyY + 4}, ${noseX - 12} ${bodyY + 3}`,
                    `H ${x - 8}`,
                    "Z",
                ].join(" "), fill: palette.deepBlue, opacity: 0.18 }), _jsx("rect", { x: x + 34, y: bodyY + 40, width: width - 212, height: 28, rx: 5, fill: palette.deepBlue }), _jsx("rect", { x: x + 28, y: bodyY + 76, width: width - 124, height: 3.5, rx: 1.75, fill: palette.steelBlue, opacity: 0.55 }), _jsx("path", { d: `M ${noseX - 14} ${bodyY + 18} C ${noseX + 30} ${bodyY + 20}, ${x + width - 26} ${bodyY + 48}, ${x + width - 18} ${bodyY + 78}`, fill: "none", stroke: palette.steelBlue, strokeWidth: 3 }), _jsx("path", { d: [
                    `M ${noseX + 26} ${bodyY + 18}`,
                    `C ${noseX + 50} ${bodyY + 22}, ${x + width - 22} ${bodyY + 40}, ${x + width - 18} ${bodyY + 70}`,
                    `L ${x + width - 54} ${bodyY + 71}`,
                    `C ${x + width - 58} ${bodyY + 44}, ${noseX + 44} ${bodyY + 28}, ${noseX + 24} ${bodyY + 22}`,
                    "Z",
                ].join(" "), fill: `url(#${windshieldId})` }), _jsx("path", { d: `M ${x + 14} ${bodyY + 26} H ${noseX - 46}`, stroke: palette.sky, strokeWidth: 3, opacity: 0.58 }), _jsx("rect", { x: noseX + 79, y: bodyY + 50, width: 15, height: 7, rx: 3.5, fill: palette.warmLight, children: animate ? _jsx("animate", { attributeName: "opacity", values: "0.82;1;0.82", dur: "2.8s", repeatCount: "indefinite" }) : null }), _jsx("path", { d: `M ${noseX + 66} ${bodyY + 84} L ${noseX + 98} ${bodyY + 84}`, stroke: palette.nearBlackBlue, strokeWidth: 4, opacity: 0.55 }), _jsx("ellipse", { cx: x + width - 110, cy: y + height - 4, rx: 108, ry: 11, fill: `url(#${shadowId})` }), _jsx("ellipse", { cx: x + width - 121, cy: y + height - 6, rx: 62, ry: 6.5, fill: palette.nearBlackBlue, opacity: 0.34 })] }));
}
function PassengerTrain({ x, y, width, height, idPrefix, animate = false, }) {
    const bodyId = `${idPrefix}-pt-body`;
    const windowId = `${idPrefix}-pt-window`;
    return (_jsxs("g", { children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: bodyId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#F4F8FB" }), _jsx("stop", { offset: "64%", stopColor: palette.vehicleWhite }), _jsx("stop", { offset: "100%", stopColor: "#D8E2EB" })] }), _jsxs("linearGradient", { id: windowId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#21445F" }), _jsx("stop", { offset: "100%", stopColor: "#365E7B" })] })] }), _jsx("path", { d: `M ${x} ${y + 16} H ${x + width - 102} C ${x + width - 70} ${y + 16}, ${x + width - 22} ${y + 34}, ${x + width} ${y + 82} L ${x + width} ${y + height} H ${x} Z`, fill: `url(#${bodyId})`, stroke: palette.steelBlue, strokeWidth: 3 }), _jsx("path", { d: `M ${x - 2} ${y + 13} H ${x + width - 106}`, stroke: palette.deepBlue, strokeWidth: 5, opacity: 0.12 }), range(6).map((windowIndex) => (_jsxs("g", { children: [_jsx("rect", { x: x + 28 + windowIndex * 56, y: y + 20, width: 42, height: 31, rx: 4, fill: `url(#${windowId})` }), _jsx("rect", { x: x + 31 + windowIndex * 56, y: y + 23, width: 36, height: 4, rx: 2, fill: palette.sky, opacity: 0.14 })] }, windowIndex))), [
                { x: x + 330, w: 48 },
                { x: x + 570, w: 44 },
            ].map((door, index) => (_jsxs("g", { children: [_jsx("rect", { x: door.x, y: y - 1, width: door.w, height: height + 1, rx: 4, fill: palette.doorAmber }), _jsx("rect", { x: door.x + 8, y: y + 10, width: door.w - 16, height: height - 16, rx: 3, fill: palette.windowDark }), _jsx("rect", { x: door.x + 6, y: y + 8, width: door.w - 12, height: 6, rx: 3, fill: palette.sky, opacity: 0.14 }), animate && index === 0 ? (_jsx("rect", { x: door.x + 16, y: y + 28, width: 8, height: 30, rx: 4, fill: palette.vehicleWhite, opacity: 0.18, children: _jsx("animate", { attributeName: "opacity", values: "0.05;0.22;0.05", dur: "3.2s", repeatCount: "indefinite" }) })) : null] }, door.x))), _jsx("path", { d: `M ${x + width - 96} ${y + 18} C ${x + width - 38} ${y + 24}, ${x + width - 8} ${y + 42}, ${x + width - 4} ${y + 84}`, fill: "none", stroke: palette.steelBlue, strokeWidth: 3 }), _jsx("rect", { x: x + width - 30, y: y + 45, width: 14, height: 7, rx: 3.5, fill: palette.warmLight, children: animate ? _jsx("animate", { attributeName: "opacity", values: "0.7;1;0.7", dur: "2.6s", repeatCount: "indefinite" }) : null })] }));
}
function Tram({ x, y, width, height, idPrefix, animate = false, }) {
    const bodyId = `${idPrefix}-tram-body`;
    const cabId = `${idPrefix}-tram-cab`;
    return (_jsxs("g", { children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: bodyId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#EDF3F7" }), _jsx("stop", { offset: "100%", stopColor: "#D7E3EC" })] }), _jsxs("linearGradient", { id: cabId, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#29506D" }), _jsx("stop", { offset: "100%", stopColor: "#4A728F" })] })] }), _jsx("path", { d: `M ${x + 20} ${y + 1} H ${x + width - 68} C ${x + width - 32} ${y + 1}, ${x + width - 6} ${y + 18}, ${x + width - 4} ${y + 42} V ${y + height - 3} H ${x + 20} C ${x + 6} ${y + height - 3}, ${x} ${y + height - 10}, ${x} ${y + height - 22} V ${y + 20} C ${x} ${y + 8}, ${x + 7} ${y + 1}, ${x + 20} ${y + 1} Z`, fill: `url(#${bodyId})`, stroke: palette.steelBlue, strokeWidth: 3 }), _jsx("rect", { x: x + 32, y: y + 18, width: width - 136, height: 44, rx: 5, fill: palette.deepBlue }), _jsx("rect", { x: x + width - 56, y: y + 18, width: 36, height: 46, rx: 4, fill: `url(#${cabId})` }), _jsx("rect", { x: x + 254, y: y, width: 32, height: height + 1, rx: 3, fill: palette.deepBlue, opacity: 0.88 }), _jsx("path", { d: `M ${x + 32} ${y + 64} H ${x + width - 16}`, stroke: palette.steelBlue, strokeWidth: 3, opacity: 0.5 }), range(10).map((windowIndex) => (_jsx("rect", { x: x + 40 + windowIndex * 45, y: y + 22, width: 28, height: 35, rx: 3, fill: palette.sky, opacity: 0.06 }, windowIndex))), _jsx("path", { d: `M ${x + 185} ${y - 4} L ${x + 220} ${y - 44} L ${x + 264} ${y - 4} M ${x + 201} ${y - 23} L ${x + 246} ${y - 23}`, stroke: palette.deepBlue, strokeWidth: 4, fill: "none" }), _jsx("path", { d: `M 0 ${y - 46} H 1000`, stroke: palette.deepBlue, strokeWidth: 2, opacity: 0.6 }), _jsx("rect", { x: x + 198, y: y - 8, width: 54, height: 6, rx: 3, fill: palette.deepBlue, opacity: 0.45 }), animate ? (_jsx("g", { opacity: 0.22, children: _jsx("rect", { x: x + width - 38, y: y + 16, width: 16, height: 8, fill: palette.warmLight, children: _jsx("animate", { attributeName: "opacity", values: "0.12;0.28;0.12", dur: "2.5s", repeatCount: "indefinite" }) }) })) : null] }));
}
function Bus({ x, y, width, height, idPrefix, animate = false, }) {
    const bodyId = `${idPrefix}-bus-body`;
    const glassId = `${idPrefix}-bus-glass`;
    return (_jsxs("g", { children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: bodyId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#F2F7FA" }), _jsx("stop", { offset: "100%", stopColor: "#D9E4ED" })] }), _jsxs("linearGradient", { id: glassId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#23455F" }), _jsx("stop", { offset: "100%", stopColor: "#3C6480" })] })] }), _jsx("path", { d: `M ${x + 14} ${y} H ${x + width - 54} C ${x + width - 18} ${y} ${x + width} ${y + 12} ${x + width} ${y + 40} V ${y + height - 20} C ${x + width} ${y + height - 6} ${x + width - 8} ${y + height} ${x + width - 24} ${y + height} H ${x + 18} C ${x + 6} ${y + height} ${x} ${y + height - 8} ${x} ${y + height - 22} V ${y + 20} C ${x} ${y + 8} ${x + 6} ${y} ${x + 14} ${y} Z`, fill: `url(#${bodyId})`, stroke: palette.steelBlue, strokeWidth: 3 }), _jsx("rect", { x: x + 22, y: y + 15, width: width - 96, height: 49, rx: 5, fill: `url(#${glassId})` }), _jsx("rect", { x: x + 215, y: y + 13, width: 44, height: 78, rx: 4, fill: palette.doorAmber, opacity: 0.92 }), _jsx("rect", { x: x + 222, y: y + 18, width: 30, height: 68, rx: 3, fill: palette.windowDark }), _jsx("path", { d: `M ${x + width - 62} ${y + 12} H ${x + width - 20} V ${y + 64} H ${x + width - 48}`, fill: palette.deepBlue }), _jsx("path", { d: `M ${x + 18} ${y + 72} H ${x + width - 28}`, stroke: palette.steelBlue, strokeWidth: 3, opacity: 0.42 }), _jsx("circle", { cx: x + 85, cy: y + height - 2, r: 22, fill: palette.nearBlackBlue }), _jsx("circle", { cx: x + width - 80, cy: y + height - 2, r: 22, fill: palette.nearBlackBlue }), _jsx("circle", { cx: x + 85, cy: y + height - 2, r: 10, fill: palette.steelBlue, opacity: 0.25 }), _jsx("circle", { cx: x + width - 80, cy: y + height - 2, r: 10, fill: palette.steelBlue, opacity: 0.25 }), _jsx("rect", { x: x + width - 20, y: y + 61, width: 10, height: 6, rx: 2.5, fill: palette.warmLight, children: animate ? _jsx("animate", { attributeName: "opacity", values: "0.72;1;0.72", dur: "2.4s", repeatCount: "indefinite" }) : null })] }));
}
function TruckWarehouse({ x, y, idPrefix, animate = false, }) {
    const trailerId = `${idPrefix}-truck-trailer`;
    const cabId = `${idPrefix}-truck-cab`;
    return (_jsxs("g", { children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: trailerId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#1B4060" }), _jsx("stop", { offset: "100%", stopColor: "#102F49" })] }), _jsxs("linearGradient", { id: cabId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#F2F6FA" }), _jsx("stop", { offset: "100%", stopColor: "#DDE7EF" })] })] }), _jsx("rect", { x: x, y: y, width: 250, height: 88, fill: `url(#${trailerId})` }), _jsx("rect", { x: x + 250, y: y + 16, width: 95, height: 72, rx: 10, fill: `url(#${cabId})`, stroke: palette.steelBlue, strokeWidth: 3 }), _jsx("path", { d: `M ${x + 278} ${y + 25} H ${x + 314} V ${y + 54} H ${x + 268} C ${x + 266} ${y + 44}, ${x + 270} ${y + 30}, ${x + 278} ${y + 25} Z`, fill: palette.deepBlue }), _jsx("rect", { x: x + 250, y: y + 48, width: 95, height: 4, fill: palette.steelBlue, opacity: 0.55 }), _jsx("rect", { x: x + 332, y: y + 66, width: 11, height: 6, rx: 2, fill: palette.warmLight, children: animate ? _jsx("animate", { attributeName: "opacity", values: "0.55;0.95;0.55", dur: "2.6s", repeatCount: "indefinite" }) : null }), _jsx("rect", { x: x + 235, y: y + 58, width: 18, height: 16, rx: 2, fill: palette.nearBlackBlue, opacity: 0.4 }), _jsx("circle", { cx: x + 65, cy: y + 89, r: 18, fill: palette.nearBlackBlue }), _jsx("circle", { cx: x + 300, cy: y + 89, r: 18, fill: palette.nearBlackBlue }), _jsx("circle", { cx: x + 65, cy: y + 89, r: 8, fill: palette.steelBlue, opacity: 0.22 }), _jsx("circle", { cx: x + 300, cy: y + 89, r: 8, fill: palette.steelBlue, opacity: 0.22 })] }));
}
function Airplane({ x, y, rotation = -11, idPrefix, animate = false, }) {
    const bodyId = `${idPrefix}-plane-body`;
    const wingId = `${idPrefix}-plane-wing`;
    const engineId = `${idPrefix}-plane-engine`;
    return (_jsxs("g", { transform: `translate(${x} ${y}) rotate(${rotation})`, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: bodyId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#F7FAFC" }), _jsx("stop", { offset: "100%", stopColor: "#DCE7EF" })] }), _jsxs("linearGradient", { id: wingId, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#8AA8BF" }), _jsx("stop", { offset: "100%", stopColor: "#6A8BA5" })] }), _jsxs("linearGradient", { id: engineId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#53708A" }), _jsx("stop", { offset: "100%", stopColor: "#36526B" })] })] }), _jsx("path", { d: "M 6 46 C 48 26, 104 18, 186 19 H 316 C 365 18, 399 28, 430 42 C 397 56, 365 61, 316 61 H 185 C 98 61, 45 56, 0 48 Z", fill: `url(#${bodyId})`, stroke: palette.steelBlue, strokeWidth: 2.5 }), _jsx("path", { d: "M 373 32 C 401 33, 425 38, 448 46 C 425 54, 403 58, 375 59 Z", fill: `url(#${bodyId})`, stroke: palette.steelBlue, strokeWidth: 2.5 }), _jsx("path", { d: "M 146 53 L 264 134 H 315 L 207 50 Z", fill: `url(#${wingId})` }), _jsx("path", { d: "M 46 40 L 104 -18 H 145 L 99 43 Z", fill: `url(#${wingId})` }), _jsx("path", { d: "M 56 54 L 109 93 H 142 L 98 52 Z", fill: `url(#${wingId})` }), _jsx("ellipse", { cx: 234, cy: 88, rx: 22, ry: 15, fill: `url(#${engineId})` }), _jsx("ellipse", { cx: 325, cy: 76, rx: 20, ry: 13, fill: `url(#${engineId})` }), _jsx("ellipse", { cx: 234, cy: 88, rx: 11, ry: 7, fill: palette.nearBlackBlue, opacity: 0.32 }), _jsx("ellipse", { cx: 325, cy: 76, rx: 10, ry: 6, fill: palette.nearBlackBlue, opacity: 0.32 }), range(17).map((windowIndex) => (_jsx("circle", { cx: 107 + windowIndex * 13, cy: 33, r: 2.15, fill: palette.mediumBlue }, windowIndex))), _jsx("path", { d: "M 227 101 L 227 126 M 322 88 L 322 116", stroke: palette.nearBlackBlue, strokeWidth: 4 }), _jsx("circle", { cx: 227, cy: 128, r: 5.5, fill: palette.nearBlackBlue }), _jsx("circle", { cx: 322, cy: 118, r: 5.5, fill: palette.nearBlackBlue }), animate ? (_jsx("path", { d: "M -54 48 C -10 44, 18 44, 46 48", stroke: palette.sky, strokeWidth: 12, opacity: 0.18, fill: "none", children: _jsx("animate", { attributeName: "opacity", values: "0.1;0.26;0.1", dur: "3.6s", repeatCount: "indefinite" }) })) : null] }));
}
function Ferry({ x, y, idPrefix, animate = false, }) {
    const hullId = `${idPrefix}-ferry-hull`;
    const deckId = `${idPrefix}-ferry-deck`;
    return (_jsxs("g", { children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: hullId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#153754" }), _jsx("stop", { offset: "100%", stopColor: "#0E2A43" })] }), _jsxs("linearGradient", { id: deckId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#F4F8FB" }), _jsx("stop", { offset: "100%", stopColor: "#DCE6EE" })] })] }), _jsx("path", { d: `M ${x} ${y + 24} H ${x + 246} C ${x + 264} ${y + 25}, ${x + 274} ${y + 34}, ${x + 286} ${y + 49} H ${x + 26} Z`, fill: `url(#${hullId})` }), _jsx("rect", { x: x + 42, y: y - 18, width: 210, height: 55, rx: 6, fill: `url(#${deckId})`, stroke: palette.steelBlue, strokeWidth: 3 }), _jsx("rect", { x: x + 58, y: y - 1, width: 172, height: 21, rx: 4, fill: palette.deepBlue }), _jsx("rect", { x: x + 178, y: y - 40, width: 74, height: 48, rx: 4, fill: `url(#${deckId})`, stroke: palette.steelBlue, strokeWidth: 2.5 }), _jsx("path", { d: `M ${x + 224} ${y - 61} V ${y - 15} M ${x + 236} ${y - 48} L ${x + 224} ${y - 42}`, stroke: palette.deepBlue, strokeWidth: 4, fill: "none" }), range(9).map((windowIndex) => (_jsx("rect", { x: x + 60 + windowIndex * 18, y: y + 3, width: 11, height: 8, rx: 2, fill: palette.vehicleWhite, opacity: 0.82 }, windowIndex))), range(4).map((windowIndex) => (_jsx("rect", { x: x + 187 + windowIndex * 14, y: y - 28, width: 9, height: 7, rx: 1.8, fill: palette.deepBlue, opacity: 0.82 }, `top-${windowIndex}`))), animate ? (_jsx("path", { d: `M ${x - 40} ${y + 49} C ${x - 10} ${y + 40}, ${x + 18} ${y + 40}, ${x + 54} ${y + 49}`, stroke: palette.sky, strokeWidth: 8, fill: "none", opacity: 0.72, children: _jsx("animate", { attributeName: "d", values: `M ${x - 40} ${y + 49} C ${x - 10} ${y + 40}, ${x + 18} ${y + 40}, ${x + 54} ${y + 49};M ${x - 44} ${y + 48} C ${x - 12} ${y + 37}, ${x + 20} ${y + 37}, ${x + 58} ${y + 48};M ${x - 40} ${y + 49} C ${x - 10} ${y + 40}, ${x + 18} ${y + 40}, ${x + 54} ${y + 49}`, dur: "3.8s", repeatCount: "indefinite" }) })) : null] }));
}
function TrainRouteIcon({ x, y, color }) {
    return (_jsxs("g", { transform: `translate(${x} ${y})`, stroke: color, fill: "none", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: -16, y: -16, width: 32, height: 34, rx: 10 }), _jsx("line", { x1: -7, y1: -3, x2: 7, y2: -3 }), _jsx("line", { x1: -10, y1: 4, x2: 10, y2: 4 }), _jsx("line", { x1: -8, y1: 18, x2: -2, y2: 26 }), _jsx("line", { x1: 8, y1: 18, x2: 2, y2: 26 })] }));
}
function BusRouteIcon({ x, y, color }) {
    return (_jsxs("g", { transform: `translate(${x} ${y})`, stroke: color, fill: "none", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: -18, y: -13, width: 36, height: 22, rx: 6 }), _jsx("line", { x1: -8, y1: -13, x2: -8, y2: 9 }), _jsx("line", { x1: 8, y1: -13, x2: 8, y2: 9 }), _jsx("circle", { cx: -9, cy: 13, r: 3, fill: color }), _jsx("circle", { cx: 9, cy: 13, r: 3, fill: color })] }));
}
function TramRouteIcon({ x, y, color }) {
    return (_jsxs("g", { transform: `translate(${x} ${y})`, stroke: color, fill: "none", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: -17, y: -10, width: 34, height: 18, rx: 5 }), _jsx("line", { x1: -7, y1: -15, x2: 0, y2: -24 }), _jsx("line", { x1: 0, y1: -24, x2: 7, y2: -15 }), _jsx("circle", { cx: -9, cy: 12, r: 3, fill: color }), _jsx("circle", { cx: 9, cy: 12, r: 3, fill: color })] }));
}
function TruckRouteIcon({ x, y, color }) {
    return (_jsxs("g", { transform: `translate(${x} ${y})`, stroke: color, fill: "none", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: -20, y: -10, width: 24, height: 18, rx: 2 }), _jsx("path", { d: "M 4 -10 H 13 L 18 -4 V 8 H 4 Z" }), _jsx("circle", { cx: -8, cy: 12, r: 3.5, fill: color }), _jsx("circle", { cx: 10, cy: 12, r: 3.5, fill: color })] }));
}
function AirplaneRouteIcon({ x, y, color }) {
    return (_jsxs("g", { transform: `translate(${x} ${y}) rotate(-18)`, stroke: color, fill: "none", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: -20, y1: 0, x2: 20, y2: 0 }), _jsx("line", { x1: -5, y1: 0, x2: -16, y2: 12 }), _jsx("line", { x1: -5, y1: 0, x2: -16, y2: -12 }), _jsx("line", { x1: 6, y1: 0, x2: 18, y2: 10 }), _jsx("line", { x1: 6, y1: 0, x2: 18, y2: -10 })] }));
}
function FerryRouteIcon({ x, y, color }) {
    return (_jsxs("g", { transform: `translate(${x} ${y})`, stroke: color, fill: "none", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M -18 8 H 18 L 10 18 H -12 Z" }), _jsx("rect", { x: -10, y: -4, width: 20, height: 9, rx: 2 }), _jsx("rect", { x: 0, y: -12, width: 9, height: 8, rx: 2 }), _jsx("path", { d: "M -18 23 C -12 19, -6 19, 0 23 C 6 19, 12 19, 18 23" })] }));
}
function IconBubble({ cx, cy, r, icon, }) {
    const color = palette.mediumBlue;
    return (_jsxs("g", { children: [_jsx("circle", { cx: cx, cy: cy, r: r, fill: palette.sky, stroke: palette.paleBlue, strokeWidth: 3 }), icon === "train" ? _jsx(TrainRouteIcon, { x: cx, y: cy, color: color }) : null, icon === "bus" ? _jsx(BusRouteIcon, { x: cx, y: cy, color: color }) : null, icon === "tram" ? _jsx(TramRouteIcon, { x: cx, y: cy, color: color }) : null, icon === "truck" ? _jsx(TruckRouteIcon, { x: cx, y: cy, color: color }) : null, icon === "airplane" ? _jsx(AirplaneRouteIcon, { x: cx, y: cy, color: color }) : null, icon === "ferry" ? _jsx(FerryRouteIcon, { x: cx, y: cy, color: color }) : null] }));
}
function RouteLine({ points, stroke, strokeWidth = 2, }) {
    return _jsx("polyline", { points: points.map(([x, y]) => `${x},${y}`).join(" "), fill: "none", stroke: stroke, strokeWidth: strokeWidth });
}
function WaterLines({ animate = false }) {
    return (_jsx("g", { opacity: 0.5, stroke: palette.paleBlue, strokeWidth: 2, children: range(6).map((line) => (_jsx("line", { x1: 80 + line * 140, y1: 205 + (line % 2) * 5, x2: 180 + line * 140, y2: 205 + (line % 2) * 5, children: animate ? (_jsx("animate", { attributeName: "opacity", values: `${0.2 + (line % 2) * 0.1};${0.65 - line * 0.05};${0.2 + (line % 2) * 0.1}`, dur: `${3.2 + line * 0.25}s`, repeatCount: "indefinite" })) : null }, line))) }));
}
function GenericBackdrop({ gradientId, from, to, animate = false, }) {
    const mistId = `${gradientId}-mist`;
    return (_jsxs(_Fragment, { children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: from }), _jsx("stop", { offset: "100%", stopColor: to })] }), _jsxs("radialGradient", { id: mistId, cx: "50%", cy: "50%", r: "50%", children: [_jsx("stop", { offset: "0%", stopColor: palette.sky, stopOpacity: "0.75" }), _jsx("stop", { offset: "100%", stopColor: palette.sky, stopOpacity: "0" })] })] }), _jsx("rect", { x: 0, y: 0, width: 1000, height: 250, fill: `url(#${gradientId})` }), _jsx("rect", { x: 0, y: 152, width: 1000, height: 98, fill: palette.mist, opacity: 0.28 }), _jsx("ellipse", { cx: 210, cy: 56, rx: 220, ry: 42, fill: `url(#${mistId})`, opacity: 0.28, children: animate ? _jsx("animate", { attributeName: "cx", values: "210;238;210", dur: "11s", repeatCount: "indefinite" }) : null }), _jsx("ellipse", { cx: 714, cy: 78, rx: 260, ry: 58, fill: `url(#${mistId})`, opacity: 0.2, children: animate ? _jsx("animate", { attributeName: "cx", values: "714;680;714", dur: "13s", repeatCount: "indefinite" }) : null })] }));
}
function RailPlatformEmptyScene({ ids, transforms, animate }) {
    return (_jsxs(_Fragment, { children: [_jsx(GenericBackdrop, { gradientId: ids.gradient, from: palette.sky, to: "#E1EAF1", animate: animate }), _jsxs("g", { transform: `translate(${transforms.background} 0)`, children: [_jsx(SoftMountains, { x: 360, y: 115, w: 360, h: 55, fill: palette.paleBlue, opacity: 0.3 }), _jsx(Tree, { x: 590, y: 98, scale: 0.92, opacity: 0.45, animate: animate }), _jsx(Tree, { x: 680, y: 103, scale: 0.76, opacity: 0.38, animate: animate })] }), _jsx("g", { transform: `translate(${transforms.mid} 0)`, children: _jsx(StationCanopy, { x: 0, y: 35, width: 735, height: 34, posts: [
                        { x: 420, h: 128 },
                        { x: 645, h: 128 },
                    ], sign: { x: 505, y: 82, width: 78, height: 18, opacity: 0.7 } }) }), _jsxs("g", { transform: `translate(${transforms.vehicle} 0)`, children: [_jsx(MotionBlur, { x: 0, y: 102, width: 162, height: 78, animate: animate }), _jsx(HighSpeedTrain, { x: -80, y: 99, width: 505, height: 88, idPrefix: ids.gradient, animate: animate })] }), _jsxs("g", { transform: `translate(${transforms.foreground} 0)`, children: [_jsx(Bench, { x: 550, y: 180, width: 68 }), _jsx(Planter, { x: 635, y: 176, size: 28 }), _jsx(StreetLamp, { x: 780, y: 62, height: 134 })] }), _jsx("line", { x1: 0, y1: 199, x2: 1000, y2: 199, stroke: palette.platformGround, strokeWidth: 3 }), _jsx("line", { x1: 0, y1: 196, x2: 1000, y2: 196, stroke: palette.platformLine, strokeWidth: 3 }), _jsx("line", { x1: 0, y1: 193, x2: 1000, y2: 193, stroke: palette.sky, strokeWidth: 1.5, opacity: 0.34 })] }));
}
function RailPlatformPassengersScene({ ids, transforms, animate }) {
    return (_jsxs(_Fragment, { children: [_jsx(GenericBackdrop, { gradientId: ids.gradient, from: palette.sky, to: "#E1EAF1", animate: animate }), _jsx("g", { transform: `translate(${transforms.background} 0)`, children: _jsx(Tree, { x: 745, y: 111, scale: 0.85, opacity: 0.5, animate: animate }) }), _jsx("g", { transform: `translate(${transforms.mid} 0)`, children: _jsx(StationCanopy, { x: 0, y: 36, width: 760, height: 35, posts: [
                        { x: 430, h: 124 },
                        { x: 655, h: 124 },
                    ], sign: { x: 505, y: 88, width: 88, height: 18, opacity: 0.65 } }) }), _jsxs("g", { transform: `translate(${transforms.vehicle} 0)`, children: [_jsx(MotionBlur, { x: 0, y: 106, width: 120, height: 70, animate: animate }), _jsx(PassengerTrain, { x: -35, y: 105, width: 685, height: 84, idPrefix: ids.gradient, animate: animate })] }), _jsxs("g", { transform: `translate(${transforms.foreground} 0)`, children: [_jsx(HumanFigure, { x: 55, y: 151, pose: "walking_left" }), _jsx(HumanFigure, { x: 110, y: 149, pose: "walking_right", bag: true }), _jsx(HumanFigure, { x: 170, y: 150, pose: "walking_right" }), _jsx(HumanFigure, { x: 225, y: 151, pose: "walking_right" }), _jsx(HumanFigure, { x: 275, y: 150, pose: "standing" }), _jsx(HumanFigure, { x: 360, y: 151, pose: "walking_right", luggage: true }), _jsx(HumanFigure, { x: 420, y: 151, pose: "walking_left" }), _jsx(HumanFigure, { x: 470, y: 151, pose: "walking_right" }), _jsx(HumanFigure, { x: 520, y: 151, pose: "standing" }), _jsx(Bench, { x: 735, y: 181, width: 70 }), _jsx(Planter, { x: 670, y: 177, size: 32 }), _jsx(StreetLamp, { x: 825, y: 68, height: 130 })] }), _jsx("line", { x1: 0, y1: 197, x2: 1000, y2: 197, stroke: palette.platformLine, strokeWidth: 3 }), _jsx("line", { x1: 0, y1: 200, x2: 1000, y2: 200, stroke: palette.platformGround, strokeWidth: 3, opacity: 0.75 })] }));
}
function TramStopScene({ ids, transforms, animate }) {
    return (_jsxs(_Fragment, { children: [_jsx(GenericBackdrop, { gradientId: ids.gradient, from: palette.sky, to: "#E5EDF3", animate: animate }), _jsxs("g", { transform: `translate(${transforms.background} 0)`, children: [_jsx(DistantCity, { x: 490, y: 40, w: 310, h: 130, opacity: 0.22 }), _jsx(Tree, { x: 850, y: 85, scale: 1.2, opacity: 0.55, animate: animate })] }), _jsxs("g", { transform: `translate(${transforms.vehicle} 0)`, children: [_jsx(MotionBlur, { x: 0, y: 100, width: 160, height: 80, animate: animate }), _jsx(Tram, { x: 70, y: 102, width: 585, height: 86, idPrefix: ids.gradient, animate: animate })] }), _jsxs("g", { transform: `translate(${transforms.foreground} 0)`, children: [_jsx(Shelter, { x: 690, y: 135, width: 160, height: 58 }), _jsx(RouteBoard, { x: 865, y: 105, width: 35, height: 90 }), _jsx(HumanFigure, { x: 675, y: 155, pose: "standing" }), _jsx(HumanFigure, { x: 720, y: 155, pose: "standing" }), _jsx(HumanFigure, { x: 770, y: 155, pose: "standing" }), _jsx(HumanFigure, { x: 820, y: 155, pose: "standing" })] }), _jsx("line", { x1: 0, y1: 199, x2: 1000, y2: 199, stroke: palette.platformGround, strokeWidth: 2.5, opacity: 0.55 })] }));
}
function BusStopScene({ ids, transforms, animate }) {
    return (_jsxs(_Fragment, { children: [_jsx(GenericBackdrop, { gradientId: ids.gradient, from: palette.sky, to: "#E5EDF3", animate: animate }), _jsxs("g", { transform: `translate(${transforms.background} 0)`, children: [_jsx(DistantCity, { x: 535, y: 50, w: 275, h: 132, opacity: 0.2 }), _jsx(Tree, { x: 840, y: 83, scale: 1.15, opacity: 0.58, animate: animate })] }), _jsxs("g", { transform: `translate(${transforms.vehicle} 0)`, children: [_jsx(MotionBlur, { x: 0, y: 98, width: 85, height: 82, animate: animate }), _jsx(Bus, { x: 75, y: 94, width: 465, height: 98, idPrefix: ids.gradient, animate: animate })] }), _jsxs("g", { transform: `translate(${transforms.foreground} 0)`, children: [_jsx(Shelter, { x: 630, y: 128, width: 165, height: 68, fill: "rgba(196,214,227,0.18)" }), _jsx(Bench, { x: 670, y: 172, width: 78 }), _jsx(RouteBoard, { x: 810, y: 120, width: 35, height: 78 }), _jsx(StreetLamp, { x: 875, y: 75, height: 123 }), _jsx(HumanFigure, { x: 430, y: 157, pose: "walking_right" }), _jsx(HumanFigure, { x: 545, y: 154, pose: "walking_right" }), _jsx(HumanFigure, { x: 590, y: 154, pose: "walking_right" }), _jsx(HumanFigure, { x: 635, y: 154, pose: "walking_right" })] }), _jsx("line", { x1: 0, y1: 198, x2: 1000, y2: 198, stroke: palette.platformGround, strokeWidth: 2.5, opacity: 0.52 })] }));
}
function WarehouseTruckScene({ ids, transforms, animate }) {
    return (_jsxs(_Fragment, { children: [_jsx(GenericBackdrop, { gradientId: ids.gradient, from: palette.sky, to: "#E4ECF3", animate: animate }), _jsxs("g", { transform: `translate(${transforms.background} 0)`, children: [_jsx(SoftMountains, { x: 80, y: 78, w: 420, h: 80, fill: palette.paleBlue, opacity: 0.28 }), _jsx(Tree, { x: 925, y: 115, scale: 0.82, opacity: 0.5, animate: animate })] }), _jsxs("g", { transform: `translate(${transforms.vehicle} 0)`, children: [_jsx(MotionBlur, { x: 0, y: 103, width: 150, height: 80, animate: animate }), _jsx(TruckWarehouse, { x: 95, y: 99, idPrefix: ids.gradient, animate: animate })] }), _jsxs("g", { transform: `translate(${transforms.foreground} 0)`, children: [_jsx("rect", { x: 395, y: 72, width: 500, height: 122, fill: palette.platformGround, stroke: palette.steelBlue, strokeWidth: 3 }), [
                        { x: 455, light: 96 },
                        { x: 605, light: 116 },
                        { x: 755, light: 136 },
                    ].map((door) => (_jsxs("g", { children: [_jsx("rect", { x: door.x, y: 96, width: 80, height: 98, fill: palette.deepBlue }), _jsx("rect", { x: door.x + 24, y: 102, width: 32, height: 6, rx: 3, fill: palette.warmLight, opacity: 0.7 }), _jsx("rect", { x: door.x + 8, y: 88, width: 64, height: 4, rx: 2, fill: palette.sky, opacity: 0.18 })] }, door.x))), _jsxs("g", { fill: palette.pallet, children: [_jsx("rect", { x: 425, y: 156, width: 70, height: 38 }), _jsx("rect", { x: 705, y: 153, width: 90, height: 42 }), range(3).map((column) => (_jsx("rect", { x: 430 + column * 18, y: 146 - (column % 2) * 10, width: 16, height: 10 }, `left-${column}`))), range(4).map((column) => (_jsx("rect", { x: 714 + column * 18, y: 142 - (column % 2) * 9, width: 16, height: 10 }, `right-${column}`)))] }), _jsxs("g", { transform: "translate(525 150)", children: [_jsx("rect", { x: 0, y: 10, width: 34, height: 18, rx: 3, fill: palette.doorAmber }), _jsx("rect", { x: 32, y: 2, width: 15, height: 26, rx: 3, fill: palette.doorAmber }), _jsx("rect", { x: 7, y: 0, width: 18, height: 12, rx: 2, fill: palette.windowDark }), _jsx("circle", { cx: 8, cy: 30, r: 7, fill: palette.nearBlackBlue }), _jsx("circle", { cx: 30, cy: 30, r: 7, fill: palette.nearBlackBlue }), _jsx("rect", { x: 46, y: 18, width: 18, height: 4, fill: palette.doorAmber }), _jsx("rect", { x: 46, y: 12, width: 4, height: 22, fill: palette.doorAmber }), _jsx("rect", { x: 60, y: 12, width: 4, height: 22, fill: palette.doorAmber })] }), _jsx(HumanFigure, { x: 655, y: 145, pose: "walking_left" })] }), _jsx("line", { x1: 0, y1: 196, x2: 1000, y2: 196, stroke: palette.platformGround, strokeWidth: 3, opacity: 0.55 })] }));
}
function AirplaneTakeoffScene({ ids, transforms, animate }) {
    return (_jsxs(_Fragment, { children: [_jsx(GenericBackdrop, { gradientId: ids.gradient, from: palette.sky, to: "#E5EDF3", animate: animate }), _jsxs("g", { transform: `translate(${transforms.background} 0)`, children: [_jsx("rect", { x: 40, y: 115, width: 190, height: 70, fill: palette.platformGround, opacity: 0.62 }), _jsx("rect", { x: 92, y: 64, width: 52, height: 118, fill: palette.warehouseBlue, opacity: 0.7 }), _jsx("rect", { x: 100, y: 54, width: 36, height: 18, rx: 4, fill: palette.deepBlue, opacity: 0.3 }), _jsx(SoftMountains, { x: 535, y: 120, w: 340, h: 54, fill: palette.paleBlue, opacity: 0.3 }), _jsx("path", { d: "M 885 86 L 914 79 L 944 88 M 907 83 L 925 69 M 907 83 L 925 96", stroke: palette.city, strokeWidth: 3, fill: "none", opacity: 0.7 })] }), _jsxs("g", { transform: `translate(${transforms.vehicle} 0)`, children: [_jsx(MotionBlur, { x: 324, y: 100, width: 120, height: 34, animate: animate }), _jsx(Airplane, { x: 365, y: 66, idPrefix: ids.gradient, animate: animate })] }), _jsxs("g", { transform: `translate(${transforms.foreground} 0)`, children: [_jsx("line", { x1: 0, y1: 188, x2: 1000, y2: 188, stroke: palette.platformGround, strokeWidth: 4 }), range(10).map((light) => (_jsx("circle", { cx: 54 + light * 98, cy: 185, r: 2.8, fill: palette.warmLight, opacity: 0.85, children: animate ? (_jsx("animate", { attributeName: "opacity", values: `${0.3 + (light % 2) * 0.15};1;${0.3 + (light % 2) * 0.15}`, dur: `${2.3 + light * 0.08}s`, repeatCount: "indefinite" })) : null }, light)))] })] }));
}
function FerryPortScene({ ids, transforms, animate }) {
    return (_jsxs(_Fragment, { children: [_jsx(GenericBackdrop, { gradientId: ids.gradient, from: palette.sky, to: "#E1EAF1", animate: animate }), _jsxs("g", { transform: `translate(${transforms.background} 0)`, children: [_jsx(SoftMountains, { x: 140, y: 65, w: 720, h: 95, fill: palette.paleBlue, opacity: 0.3 }), _jsx("path", { d: "M 530 92 C 536 88, 542 88, 548 92 M 560 88 C 565 84, 571 84, 576 88", stroke: palette.steelBlue, strokeWidth: 2.5, fill: "none", opacity: 0.5 })] }), _jsxs("g", { transform: `translate(${transforms.mid} 0)`, children: [_jsx("rect", { x: 0, y: 170, width: 380, height: 30, fill: palette.platformGround }), _jsxs("g", { fill: palette.pallet, children: [_jsx("rect", { x: 155, y: 130, width: 170, height: 40 }), range(4).map((column) => (_jsx("rect", { x: 165 + column * 35, y: 118 + (column % 2) * 8, width: 28, height: 12 }, `cargo-${column}`)))] }), _jsx("path", { d: "M 80 170 L 80 100 L 150 70 L 150 170 M 122 92 L 142 170", stroke: palette.mediumBlue, strokeWidth: 4, fill: "none" })] }), _jsxs("g", { transform: `translate(${transforms.foreground} 0)`, children: [_jsx("rect", { x: 0, y: 195, width: 1000, height: 55, fill: "#DDE8F1" }), _jsx(WaterLines, { animate: animate })] }), _jsxs("g", { transform: `translate(${transforms.vehicle} 0)`, children: [_jsx(Ferry, { x: 470, y: 145, idPrefix: ids.gradient, animate: animate }), _jsx("path", { d: "M 430 192 C 450 180, 490 182, 540 192", stroke: palette.sky, strokeWidth: 8, fill: "none", opacity: 0.8, children: animate ? _jsx("animate", { attributeName: "opacity", values: "0.52;0.9;0.52", dur: "3.4s", repeatCount: "indefinite" }) : null })] })] }));
}
function RouteNetworkScene({ ids, selected, animate }) {
    const accent = selected ? palette.platformLine : palette.routeTeal;
    return (_jsxs(_Fragment, { children: [_jsx(GenericBackdrop, { gradientId: ids.gradient, from: palette.sky, to: "#E7EEF4", animate: animate }), _jsx("g", { opacity: 0.22, children: _jsx(SoftMountains, { x: 420, y: 155, w: 340, h: 40, fill: palette.paleBlue, opacity: 0.22 }) }), _jsx(RouteLine, { points: [
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
                ], stroke: accent, strokeWidth: 3 }), _jsx(RouteLine, { points: [
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
                ], stroke: palette.sky, strokeWidth: 1.25 }), _jsx(RouteLine, { points: [
                    [110, 145],
                    [175, 90],
                    [250, 90],
                    [350, 145],
                ], stroke: palette.paleBlue, strokeWidth: 2 }), _jsx(RouteLine, { points: [
                    [535, 145],
                    [630, 95],
                    [725, 95],
                    [760, 145],
                ], stroke: palette.paleBlue, strokeWidth: 2 }), _jsx(RouteLine, { points: [
                    [760, 145],
                    [810, 72],
                    [900, 72],
                ], stroke: palette.routeTeal, strokeWidth: 2 }), animate ? (_jsx("g", { stroke: palette.routeTeal, strokeWidth: 3, fill: "none", strokeDasharray: "1 18", strokeLinecap: "round", opacity: 0.65, children: _jsx("path", { d: "M 0 145 H 1000", children: _jsx("animate", { attributeName: "stroke-dashoffset", values: "0;-120", dur: "7s", repeatCount: "indefinite" }) }) })) : null, [75, 230, 535, 760, 850].map((cx, index) => (_jsx("circle", { cx: cx, cy: 145, r: 8, fill: palette.routeTeal, children: animate ? (_jsx("animate", { attributeName: "r", values: "7.2;8.8;7.2", dur: `${2.2 + index * 0.3}s`, repeatCount: "indefinite" })) : null }, cx))), _jsx("circle", { cx: 350, cy: 145, r: 8, fill: palette.platformLine, children: animate ? _jsx("animate", { attributeName: "r", values: "7;10;7", dur: "2.6s", repeatCount: "indefinite" }) : null }), _jsx(IconBubble, { cx: 75, cy: 145, r: 42, icon: "train" }), _jsx(IconBubble, { cx: 205, cy: 92, r: 38, icon: "bus" }), _jsx(IconBubble, { cx: 225, cy: 190, r: 38, icon: "tram" }), _jsx(IconBubble, { cx: 535, cy: 145, r: 42, icon: "truck" }), _jsx(IconBubble, { cx: 690, cy: 75, r: 42, icon: "airplane" }), _jsx(IconBubble, { cx: 915, cy: 145, r: 42, icon: "ferry" })] }));
}
function SceneIllustration({ sceneId, decorative, interactive, label, transforms, selected, animate, }) {
    const gradientId = useId().replace(/:/g, "");
    return (_jsxs("svg", { className: "transport-card__svg", viewBox: transportTokens.viewBox, preserveAspectRatio: "xMidYMid slice", role: !decorative && !interactive ? "img" : undefined, "aria-label": !decorative && !interactive ? label : undefined, "aria-hidden": decorative || interactive ? true : undefined, children: [sceneId === "rail_platform_empty" ? (_jsx(RailPlatformEmptyScene, { ids: { gradient: gradientId }, transforms: transforms, selected: selected, animate: animate })) : null, sceneId === "rail_platform_passengers" ? (_jsx(RailPlatformPassengersScene, { ids: { gradient: gradientId }, transforms: transforms, selected: selected, animate: animate })) : null, sceneId === "tram_stop" ? (_jsx(TramStopScene, { ids: { gradient: gradientId }, transforms: transforms, selected: selected, animate: animate })) : null, sceneId === "bus_stop" ? (_jsx(BusStopScene, { ids: { gradient: gradientId }, transforms: transforms, selected: selected, animate: animate })) : null, sceneId === "warehouse_truck" ? (_jsx(WarehouseTruckScene, { ids: { gradient: gradientId }, transforms: transforms, selected: selected, animate: animate })) : null, sceneId === "airplane_takeoff" ? (_jsx(AirplaneTakeoffScene, { ids: { gradient: gradientId }, transforms: transforms, selected: selected, animate: animate })) : null, sceneId === "ferry_port" ? (_jsx(FerryPortScene, { ids: { gradient: gradientId }, transforms: transforms, selected: selected, animate: animate })) : null, sceneId === "route_network" ? (_jsx(RouteNetworkScene, { ids: { gradient: gradientId }, transforms: transforms, selected: selected, animate: animate })) : null] }));
}
function SceneFrame({ scene, state, decorative, interactive, captions, selected, onSelect, }) {
    const [parallaxRatio, setParallaxRatio] = useState(0);
    const prefersReducedMotion = useMediaFlag("(prefers-reduced-motion: reduce)");
    const canHover = useMediaFlag("(hover: hover) and (pointer: fine)");
    const animateScene = !prefersReducedMotion;
    const transforms = useMemo(() => {
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
        },
    };
    const media = (_jsx("div", { className: "transport-card__media", children: _jsx(SceneIllustration, { sceneId: scene.id, decorative: decorative, interactive: interactive, label: scene.ariaLabel, transforms: transforms, selected: selected, animate: animateScene }) }));
    const content = (_jsxs(_Fragment, { children: [media, captions ? (_jsxs("div", { className: "transport-card__caption", children: [_jsx("p", { className: "transport-card__title", children: scene.title }), _jsx("p", { className: "transport-card__description", children: scene.description })] })) : null] }));
    if (interactive && !decorative) {
        return (_jsx("button", { type: "button", ...sharedProps, "aria-label": scene.ariaLabel, "aria-pressed": selected, onClick: () => onSelect?.(scene.id), onPointerMove: (event) => {
                if (!canHover || prefersReducedMotion)
                    return;
                const bounds = event.currentTarget.getBoundingClientRect();
                const ratio = (event.clientX - bounds.left) / bounds.width;
                setParallaxRatio((ratio - 0.5) * 2);
            }, onPointerLeave: () => setParallaxRatio(0), children: content }));
    }
    return _jsx("div", { ...sharedProps, children: content });
}
export function TransportBannerSet({ layout = "auto", scenes = sceneOrder, decorative = false, interactive = !decorative, captions = true, className, selectedSceneId, defaultSelectedSceneId, onSceneSelect, sceneStates, }) {
    const initialScene = defaultSelectedSceneId ?? (interactive && !decorative ? scenes[0] ?? "rail_platform_empty" : undefined);
    const [internalSelection, setInternalSelection] = useState(initialScene);
    const resolvedSelection = selectedSceneId ?? internalSelection;
    const resolvedScenes = scenes.map((sceneId) => transportSceneMap[sceneId]).filter(Boolean);
    const wrapperClassName = [
        "transport-banner-set",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const resolveState = (sceneId) => {
        if (sceneStates?.[sceneId])
            return sceneStates[sceneId];
        if (resolvedSelection === sceneId)
            return "active";
        if (resolvedSelection)
            return interactive ? "muted" : "default";
        return "default";
    };
    const handleSelect = (sceneId) => {
        if (!interactive || decorative)
            return;
        setInternalSelection(sceneId);
        onSceneSelect?.(sceneId);
    };
    return (_jsx("div", { className: wrapperClassName, "data-layout": layout, children: resolvedScenes.map((scene) => (_jsx(SceneFrame, { scene: scene, state: resolveState(scene.id), decorative: decorative, interactive: interactive, captions: captions, selected: resolvedSelection === scene.id, onSelect: handleSelect }, scene.id))) }));
}
export { SceneFrame, SoftMountains, DistantCity, Tree, HumanFigure, StationCanopy, Shelter, RouteBoard, HighSpeedTrain, PassengerTrain, Tram, Bus, TruckWarehouse, Airplane, Ferry, RouteLine, IconBubble as RouteNetworkIcon, };
