import React, { useMemo } from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

export type FighterId = 'kai' | 'raka' | 'naya' | 'zara';
export type FighterPose = 'idle' | 'attack' | 'hit' | 'win';

interface Props {
  characterId: string;
  size?: number;
  facing?: 'left' | 'right';
  pose?: FighterPose;
}

const PALETTE: Record<
  FighterId,
  { body: string; bodyDark: string; tip: string; eraser: string; accent: string }
> = {
  kai: {
    body: '#3B7BC8',
    bodyDark: '#1E4D8C',
    tip: '#F5C518',
    eraser: '#F7B4A8',
    accent: '#8EC5FF',
  },
  raka: {
    body: '#E6392B',
    bodyDark: '#A81F16',
    tip: '#FFD166',
    eraser: '#F7C6C0',
    accent: '#FF8A7A',
  },
  naya: {
    body: '#E08900',
    bodyDark: '#A86300',
    tip: '#FFE08A',
    eraser: '#FFD6A8',
    accent: '#FFC857',
  },
  zara: {
    body: '#2B9B8A',
    bodyDark: '#1A6B5E',
    tip: '#A8F0E0',
    eraser: '#C8EDE6',
    accent: '#6FD9C7',
  },
};

function resolveId(id: string): FighterId {
  if (id === 'raka' || id === 'naya' || id === 'zara') return id;
  return 'kai';
}

/**
 * Original 2D pencil-fighter sprites (logo-inspired, no emoji).
 * Swapable later with bitmap sheets without changing battle engine.
 */
export function FighterSprite({
  characterId,
  size = 120,
  facing = 'right',
  pose = 'idle',
}: Props) {
  const id = resolveId(characterId);
  const p = PALETTE[id];
  const flip = facing === 'left' ? -1 : 1;

  const poseTransform = useMemo(() => {
    switch (pose) {
      case 'attack':
        return { rotate: facing === 'right' ? -18 : 18, lean: 8 };
      case 'hit':
        return { rotate: facing === 'right' ? 12 : -12, lean: -6 };
      case 'win':
        return { rotate: facing === 'right' ? -8 : 8, lean: 0 };
      default:
        return { rotate: facing === 'right' ? -4 : 4, lean: 0 };
    }
  }, [pose, facing]);

  const gradId = `body-${id}-${facing}-${pose}`;
  const shineId = `shine-${id}-${facing}`;

  return (
    <Svg width={size} height={size * 1.15} viewBox="0 0 120 140">
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={p.accent} />
          <Stop offset="0.45" stopColor={p.body} />
          <Stop offset="1" stopColor={p.bodyDark} />
        </LinearGradient>
        <LinearGradient id={shineId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* ground shadow */}
      <Ellipse cx="60" cy="128" rx="34" ry="7" fill="#061428" opacity={0.35} />

      <G
        transform={`translate(60 70) scale(${flip} 1) rotate(${poseTransform.rotate}) translate(${poseTransform.lean} 0) translate(-60 -70)`}
      >
        {/* pencil shaft */}
        <Path
          d="M48 28 L72 28 L78 98 L42 98 Z"
          fill={`url(#${gradId})`}
        />
        <Path d="M50 30 L58 30 L62 96 L46 96 Z" fill={`url(#${shineId})`} />

        {/* wood tip */}
        <Path d="M42 98 L78 98 L60 128 Z" fill={p.tip} />
        <Path d="M54 112 L66 112 L60 128 Z" fill="#2A1A0A" />

        {/* metal band */}
        <Rect x="42" y="90" width="36" height="8" rx="2" fill="#D8DEE8" />
        <Rect x="42" y="92" width="36" height="2" fill="#FFFFFF" opacity={0.5} />

        {/* eraser head */}
        <Rect x="46" y="16" width="28" height="14" rx="4" fill={p.eraser} />
        <Rect x="48" y="18" width="24" height="4" rx="2" fill="#FFFFFF" opacity={0.35} />

        {/* face plate */}
        <Ellipse cx="60" cy="58" rx="16" ry="18" fill="#FFF8F0" />
        <Ellipse cx="60" cy="58" rx="16" ry="18" fill="#FFECD9" opacity={0.35} />

        {/* eyes */}
        {pose === 'hit' ? (
          <>
            <Path d="M50 56 L56 60 L50 64" stroke="#1A1A1A" strokeWidth="2.2" fill="none" />
            <Path d="M70 56 L64 60 L70 64" stroke="#1A1A1A" strokeWidth="2.2" fill="none" />
          </>
        ) : (
          <>
            <Circle cx="53" cy="56" r="3.2" fill="#1A1A1A" />
            <Circle cx="67" cy="56" r="3.2" fill="#1A1A1A" />
            <Circle cx="54" cy="55" r="1" fill="#FFFFFF" />
            <Circle cx="68" cy="55" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* brows / mouth by role */}
        {id === 'raka' && (
          <Path d="M48 48 Q60 44 72 48" stroke="#1A1A1A" strokeWidth="2" fill="none" />
        )}
        {id === 'naya' && (
          <Path d="M50 49 Q60 46 70 49" stroke="#1A1A1A" strokeWidth="1.6" fill="none" />
        )}
        {id === 'zara' && (
          <Path d="M52 50 L68 50" stroke="#1A1A1A" strokeWidth="1.8" fill="none" />
        )}
        {pose === 'win' ? (
          <Path d="M52 66 Q60 74 68 66" stroke="#1A1A1A" strokeWidth="2" fill="none" />
        ) : pose === 'attack' ? (
          <Path d="M54 68 L66 68" stroke="#1A1A1A" strokeWidth="2.4" fill="none" />
        ) : (
          <Path d="M54 66 Q60 70 66 66" stroke="#1A1A1A" strokeWidth="1.8" fill="none" />
        )}

        {/* arm / gauntlet accent */}
        <Path
          d="M40 70 Q28 78 34 92"
          stroke={p.bodyDark}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx="34" cy="94" r="6" fill={p.tip} />
        <Path
          d="M80 70 Q92 78 86 92"
          stroke={p.bodyDark}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx="86" cy="94" r="6" fill={p.tip} />

        {/* role badge */}
        {id === 'kai' && <Path d="M56 36 L60 28 L64 36 Z" fill="#F5C518" />}
        {id === 'raka' && <Rect x="55" y="30" width="10" height="8" rx="1" fill="#FFD166" />}
        {id === 'naya' && <Circle cx="60" cy="34" r="5" fill="#FFE08A" />}
        {id === 'zara' && (
          <Path d="M56 32 L64 32 L60 40 Z" fill="#A8F0E0" />
        )}
      </G>

      {pose === 'attack' && (
        <G opacity={0.85}>
          <Path
            d={facing === 'right' ? 'M88 70 L108 62' : 'M32 70 L12 62'}
            stroke="#F5C518"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Path
            d={facing === 'right' ? 'M90 80 L112 80' : 'M30 80 L8 80'}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <Path
            d={facing === 'right' ? 'M88 90 L106 98' : 'M32 90 L14 98'}
            stroke="#F5C518"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </G>
      )}
    </Svg>
  );
}
