import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * First 15 moves (30 plies) of "The Immortal Game" — Anderssen vs
 * Kieseritzky, London 1851. A real, well-known game, stopped before
 * the sacrifices/mate so every piece used still matches the standard
 * starting set below (no promotions).
 */
const moves = [
  { color: 'w', piece: 'P', from: 'e2', to: 'e4', san: 'e4' },
  { color: 'b', piece: 'P', from: 'e7', to: 'e5', san: 'e5' },
  { color: 'w', piece: 'P', from: 'f2', to: 'f4', san: 'f4' },
  { color: 'b', piece: 'P', from: 'e5', to: 'f4', san: 'exf4' },
  { color: 'w', piece: 'B', from: 'f1', to: 'c4', san: 'Bc4' },
  { color: 'b', piece: 'Q', from: 'd8', to: 'h4', san: 'Qh4+' },
  { color: 'w', piece: 'K', from: 'e1', to: 'f1', san: 'Kf1' },
  { color: 'b', piece: 'P', from: 'b7', to: 'b5', san: 'b5' },
  { color: 'w', piece: 'B', from: 'c4', to: 'b5', san: 'Bxb5' },
  { color: 'b', piece: 'N', from: 'g8', to: 'f6', san: 'Nf6' },
  { color: 'w', piece: 'N', from: 'g1', to: 'f3', san: 'Nf3' },
  { color: 'b', piece: 'Q', from: 'h4', to: 'h6', san: 'Qh6' },
  { color: 'w', piece: 'P', from: 'd2', to: 'd3', san: 'd3' },
  { color: 'b', piece: 'N', from: 'f6', to: 'h5', san: 'Nh5' },
  { color: 'w', piece: 'N', from: 'f3', to: 'h4', san: 'Nh4' },
  { color: 'b', piece: 'Q', from: 'h6', to: 'g5', san: 'Qg5' },
  { color: 'w', piece: 'N', from: 'h4', to: 'f5', san: 'Nf5' },
  { color: 'b', piece: 'P', from: 'c7', to: 'c6', san: 'c6' },
  { color: 'w', piece: 'P', from: 'g2', to: 'g4', san: 'g4' },
  { color: 'b', piece: 'N', from: 'h5', to: 'f6', san: 'Nf6' },
  { color: 'w', piece: 'R', from: 'h1', to: 'g1', san: 'Rg1' },
  { color: 'b', piece: 'P', from: 'c6', to: 'b5', san: 'cxb5' },
  { color: 'w', piece: 'P', from: 'h2', to: 'h4', san: 'h4' },
  { color: 'b', piece: 'Q', from: 'g5', to: 'g6', san: 'Qg6' },
  { color: 'w', piece: 'P', from: 'h4', to: 'h5', san: 'h5' },
  { color: 'b', piece: 'Q', from: 'g6', to: 'g5', san: 'Qg5' },
  { color: 'w', piece: 'Q', from: 'd1', to: 'f3', san: 'Qf3' },
  { color: 'b', piece: 'N', from: 'f6', to: 'g8', san: 'Ng8' },
  { color: 'w', piece: 'B', from: 'c1', to: 'f4', san: 'Bxf4' },
  { color: 'b', piece: 'Q', from: 'g5', to: 'f6', san: 'Qf6' },
];

const initialPieces = [
  { id: 'w-king', color: 'w', type: 'K', symbol: '♔', square: 'e1' },
  { id: 'w-queen', color: 'w', type: 'Q', symbol: '♕', square: 'd1' },
  { id: 'w-rook1', color: 'w', type: 'R', symbol: '♖', square: 'a1' },
  { id: 'w-rook2', color: 'w', type: 'R', symbol: '♖', square: 'h1' },
  { id: 'w-bishop1', color: 'w', type: 'B', symbol: '♗', square: 'c1' },
  { id: 'w-bishop2', color: 'w', type: 'B', symbol: '♗', square: 'f1' },
  { id: 'w-knight1', color: 'w', type: 'N', symbol: '♘', square: 'b1' },
  { id: 'w-knight2', color: 'w', type: 'N', symbol: '♘', square: 'g1' },
  { id: 'w-pawn1', color: 'w', type: 'P', symbol: '♙', square: 'a2' },
  { id: 'w-pawn2', color: 'w', type: 'P', symbol: '♙', square: 'b2' },
  { id: 'w-pawn3', color: 'w', type: 'P', symbol: '♙', square: 'c2' },
  { id: 'w-pawn4', color: 'w', type: 'P', symbol: '♙', square: 'd2' },
  { id: 'w-pawn5', color: 'w', type: 'P', symbol: '♙', square: 'e2' },
  { id: 'w-pawn6', color: 'w', type: 'P', symbol: '♙', square: 'f2' },
  { id: 'w-pawn7', color: 'w', type: 'P', symbol: '♙', square: 'g2' },
  { id: 'w-pawn8', color: 'w', type: 'P', symbol: '♙', square: 'h2' },
  { id: 'b-king', color: 'b', type: 'K', symbol: '♚', square: 'e8' },
  { id: 'b-queen', color: 'b', type: 'Q', symbol: '♛', square: 'd8' },
  { id: 'b-rook1', color: 'b', type: 'R', symbol: '♜', square: 'a8' },
  { id: 'b-rook2', color: 'b', type: 'R', symbol: '♜', square: 'h8' },
  { id: 'b-bishop1', color: 'b', type: 'B', symbol: '♝', square: 'c8' },
  { id: 'b-bishop2', color: 'b', type: 'B', symbol: '♝', square: 'f8' },
  { id: 'b-knight1', color: 'b', type: 'N', symbol: '♞', square: 'b8' },
  { id: 'b-knight2', color: 'b', type: 'N', symbol: '♞', square: 'g8' },
  { id: 'b-pawn1', color: 'b', type: 'P', symbol: '♟', square: 'a7' },
  { id: 'b-pawn2', color: 'b', type: 'P', symbol: '♟', square: 'b7' },
  { id: 'b-pawn3', color: 'b', type: 'P', symbol: '♟', square: 'c7' },
  { id: 'b-pawn4', color: 'b', type: 'P', symbol: '♟', square: 'd7' },
  { id: 'b-pawn5', color: 'b', type: 'P', symbol: '♟', square: 'e7' },
  { id: 'b-pawn6', color: 'b', type: 'P', symbol: '♟', square: 'f7' },
  { id: 'b-pawn7', color: 'b', type: 'P', symbol: '♟', square: 'g7' },
  { id: 'b-pawn8', color: 'b', type: 'P', symbol: '♟', square: 'h7' },
];

function squareToCoordinates(square) {
  const file = square.charCodeAt(0) - 97;
  const rank = Number(square[1]);
  return { col: file, row: 8 - rank };
}

function buildBoardState(moveIndex) {
  const pieces = initialPieces.map((piece) => ({ ...piece }));
  const appliedMoves = moves.slice(0, moveIndex);
  let movedPieceId = null;

  appliedMoves.forEach((move) => {
    const movingPiece = pieces.find((piece) => piece.square === move.from && piece.color === move.color);
    if (!movingPiece) return;

    const targetIndex = pieces.findIndex((piece) => piece.square === move.to && piece.color !== movingPiece.color);
    if (targetIndex >= 0) pieces.splice(targetIndex, 1);

    movingPiece.square = move.to;
    movedPieceId = movingPiece.id;
  });

  return { pieces, movedPieceId };
}

/**
 * ChessWidget
 * `activeMove` can jump by more than 1 (fast scrolling). Instead of
 * snapping straight to the target, this component steps through every
 * intermediate move on a short interval so a piece never "teleports"
 * more than one square-sequence at a time.
 *
 * Styles are embedded via a single <style> tag below so this file can
 * be dropped in as-is with no separate CSS import. Sized 2x the
 * original widget (480px vs 240px).
 */
export default function ChessWidget({ activeMove, totalMoves = moves.length }) {
  const clampedTarget = Math.max(0, Math.min(activeMove, totalMoves));
  const [displayMove, setDisplayMove] = useState(clampedTarget);
  const [isVisible, setIsVisible] = useState(false);
  const [pulseSquare, setPulseSquare] = useState(null);
  const stepTimeoutRef = useRef(null);

  const { pieces: boardState, movedPieceId } = useMemo(() => buildBoardState(displayMove), [displayMove]);
  const lastMove = moves[displayMove - 1] || null;
  const progress = totalMoves > 0 ? (displayMove / totalMoves) * 100 : 0;

  useEffect(() => {
    let mounted = true;
    const reveal = () => {
      if (mounted) {
        setIsVisible(true);
        mounted = false;
      }
    };
    window.addEventListener('scroll', reveal, { passive: true });
    const t = window.setTimeout(reveal, 450);
    return () => {
      mounted = false;
      window.removeEventListener('scroll', reveal);
      window.clearTimeout(t);
    };
  }, []);

  // Step toward the target move one ply at a time instead of jumping.
  useEffect(() => {
    if (stepTimeoutRef.current) {
      window.clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = null;
    }

    if (displayMove === clampedTarget) return undefined;

    const direction = clampedTarget > displayMove ? 1 : -1;
    const isBigBackwardJump = direction === -1 && Math.abs(clampedTarget - displayMove) > 2;

    if (isBigBackwardJump) {
      setDisplayMove(clampedTarget);
      return undefined;
    }

    stepTimeoutRef.current = window.setTimeout(() => {
      setDisplayMove((prev) => prev + direction);
    }, 420);

    return () => {
      if (stepTimeoutRef.current) window.clearTimeout(stepTimeoutRef.current);
    };
  }, [clampedTarget, displayMove]);

  useEffect(() => {
    if (!lastMove?.to) {
      setPulseSquare(null);
      return undefined;
    }
    setPulseSquare(lastMove.to);
    const t = window.setTimeout(() => setPulseSquare(null), 650);
    return () => window.clearTimeout(t);
  }, [displayMove, lastMove]);

  return (
    <aside
      className={`chess-widget ${isVisible ? 'chess-widget--visible' : ''}`}
      aria-label="A live chess game that advances as you scroll"
    >
      <style>{`
        .chess-widget {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 40;
          width: 480px;
          padding: 32px;
          background: #1e1b16;
          border-radius: 16px;
          box-shadow: 0 28px 60px rgba(0, 0, 0, 0.4);
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 400ms ease, transform 400ms ease;
        }
        .chess-widget--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .chess-widget .widget-heading {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 18px;
        }
        .chess-widget .widget-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #d97757;
          margin: 0;
        }
        .chess-widget .widget-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 16px;
          color: #f4eee2;
        }
        .chess-widget .board {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35);
        }
        .chess-widget .board-grid {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          grid-template-rows: repeat(8, 1fr);
        }
        .chess-widget .board-square {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .chess-widget .board-square--light {
          background: #f4eee2;
        }
        .chess-widget .board-square--dark {
          background: #8a8272;
        }
        .chess-widget .board-square--active {
          outline-offset: -3px;
        }
        .chess-widget .move-marker {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 14px;
          height: 14px;
          border-radius: 50%;
        }
        .chess-widget .board-square--pulse::after {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.45;
          animation: chess-pulse-fade 650ms ease-out forwards;
        }
        @keyframes chess-pulse-fade {
          from { opacity: 0.45; }
          to { opacity: 0; }
        }
        .chess-widget .piece-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .chess-widget .piece {
          position: absolute;
          top: 0;
          left: 0;
          width: 12.5%;
          height: 12.5%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(36px, 8vw, 52px);
          line-height: 1;
          transition: transform 420ms ease-in-out;
          will-change: transform;
        }
        .chess-widget .piece--white {
          color: #f4eee2;
          text-shadow: 0 2px 3px rgba(0, 0, 0, 0.35);
        }
        .chess-widget .piece--black {
          color: #1e1b16;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
        }
        .chess-widget .piece--moving {
          animation: chess-piece-lift 420ms ease-in-out;
        }
        @keyframes chess-piece-lift {
          0% { filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0)); }
          50% { filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.35)); }
          100% { filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0)); }
        }
        .chess-widget .widget-meta {
          margin-top: 20px;
        }
        .chess-widget .move-counter {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 15px;
          color: #f4eee2;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .chess-widget .move-progress {
          margin-top: 10px;
          width: 100%;
          height: 5px;
          background: rgba(244, 238, 226, 0.2);
          border-radius: 3px;
          overflow: hidden;
        }
        .chess-widget .move-progress span {
          display: block;
          height: 100%;
          transition: width 300ms ease;
        }
        .chess-widget .widget-caption {
          margin: 12px 0 0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: #8a8272;
        }
        @media (max-width: 900px) {
          .chess-widget {
            width: 360px;
            padding: 22px;
          }
        }
        @media (max-width: 640px) {
          .chess-widget {
            width: 280px;
            right: 12px;
            bottom: 12px;
            padding: 16px;
          }
          .chess-widget .piece {
            font-size: clamp(22px, 7vw, 32px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .chess-widget,
          .chess-widget .piece,
          .chess-widget .move-progress span,
          .chess-widget .board-square--pulse::after {
            transition: none;
            animation: none;
          }
        }
      `}</style>

      <div className="widget-heading">
        <p className="widget-label">Scroll game</p>
        <span className="widget-title">Immortal game</span>
      </div>

      <div
        className="board"
        role="img"
        aria-label={`Chess board showing move ${Math.min(displayMove, totalMoves)} of ${totalMoves}`}
      >
        <div className="board-grid">
          {Array.from({ length: 64 }, (_, index) => {
            const file = index % 8;
            const rank = Math.floor(index / 8);
            const square = `${String.fromCharCode(97 + file)}${8 - rank}`;
            const isDark = (file + rank) % 2 === 1;
            const isActive = lastMove && square === lastMove.to;
            const isPulsing = pulseSquare === square;

            return (
              <div
                key={square}
                className={[
                  'board-square',
                  isDark ? 'board-square--dark' : 'board-square--light',
                  isActive ? 'board-square--active' : '',
                  isPulsing ? 'board-square--pulse' : '',
                ].join(' ').trim()}
              >
                {isActive ? <span className="move-marker" /> : null}
              </div>
            );
          })}
        </div>

        <div className="piece-layer">
          {boardState.map((piece) => {
            const { col, row } = squareToCoordinates(piece.square);
            return (
              <div
                key={piece.id}
                className={[
                  'piece',
                  piece.color === 'w' ? 'piece--white' : 'piece--black',
                  movedPieceId === piece.id ? 'piece--moving' : '',
                ].join(' ').trim()}
                style={{
                  transform: `translate(${col * 100}%, ${row * 100}%)`,
                }}
              >
                {piece.symbol}
              </div>
            );
          })}
        </div>
      </div>

      <div className="widget-meta">
        <div className="move-counter">
          move {Math.min(displayMove, totalMoves)} of {totalMoves}
        </div>
        <div className="move-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="widget-caption">{lastMove ? `Last move: ${lastMove.san}` : 'Starting position'}</p>
      </div>
    </aside>
  );
}