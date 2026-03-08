'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RoomConfig, SpaceType, RoomThermalResult } from '@/lib/room-calculator'
import { calculateRoomThermalLoad } from '@/lib/room-calculator'
import type { ScoredProduct } from '@/lib/room-calculator'

interface RoomVisualizerProps {
  room: RoomConfig
  spaceType: SpaceType
  topProduct?: ScoredProduct | null
}

export function RoomVisualizer({ room, spaceType, topProduct }: RoomVisualizerProps) {
  const thermal = useMemo(
    () => calculateRoomThermalLoad(room, spaceType),
    [room, spaceType],
  )

  // SVG dimensions — room maps to a box within
  const svgW = 480
  const svgH = 400
  const padding = 50
  const maxRoomW = svgW - padding * 2
  const maxRoomH = svgH - padding * 2

  // Scale room to fit SVG while preserving aspect ratio
  const roomAspect = room.length / room.width
  let drawW: number
  let drawH: number
  if (roomAspect > maxRoomW / maxRoomH) {
    drawW = maxRoomW
    drawH = maxRoomW / roomAspect
  } else {
    drawH = maxRoomH
    drawW = maxRoomH * roomAspect
  }

  const roomX = (svgW - drawW) / 2
  const roomY = (svgH - drawH) / 2

  // Window positions (distributed along top wall)
  const windowWidth = drawW * 0.12
  const windowGap = (drawW - room.windows * windowWidth) / (room.windows + 1)

  // Door position (left wall, bottom)
  const doorWidth = Math.min(drawW * 0.08, 20)
  const doorHeight = drawH * 0.15

  // AC unit position (top wall, right side)
  const acUnitW = 60
  const acUnitH = 14

  // Outdoor unit (below room, right side)
  const outdoorW = 36
  const outdoorH = 28

  return (
    <div className="flex flex-col items-center">
      {/* Room info header */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10">
          <svg className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
          <span className="font-display text-sm font-bold text-white">{thermal.area} m²</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10">
          <svg className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          <span className="font-display text-sm font-bold text-white">{thermal.requiredKw} kW</span>
          <span className="text-xs text-gray-500">necesar</span>
        </div>
      </div>

      {/* SVG Visualization */}
      <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background grid */}
          <defs>
            <pattern id="roomGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
            {/* AC airflow gradient */}
            <radialGradient id="airflow" cx="50%" cy="0%" r="80%">
              <stop offset="0%" stopColor="rgba(14,165,233,0.15)" />
              <stop offset="100%" stopColor="rgba(14,165,233,0)" />
            </radialGradient>
            {/* Heat loss gradient */}
            <linearGradient id="heatLoss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(239,68,68,0.2)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0)" />
            </linearGradient>
          </defs>

          <rect width={svgW} height={svgH} fill="url(#roomGrid)" />

          {/* Room walls */}
          <motion.rect
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            x={roomX}
            y={roomY}
            width={drawW}
            height={drawH}
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2.5"
            rx="3"
          />

          {/* Room dimensions labels */}
          {/* Width label (top) */}
          <text
            x={roomX + drawW / 2}
            y={roomY - 12}
            textAnchor="middle"
            className="fill-gray-500 font-display text-[11px]"
          >
            {room.length} m
          </text>
          {/* Height label (right) */}
          <text
            x={roomX + drawW + 16}
            y={roomY + drawH / 2}
            textAnchor="middle"
            className="fill-gray-500 font-display text-[11px]"
            transform={`rotate(90, ${roomX + drawW + 16}, ${roomY + drawH / 2})`}
          >
            {room.width} m
          </text>

          {/* Dimension arrows */}
          {/* Top arrow */}
          <line x1={roomX} y1={roomY - 6} x2={roomX + drawW} y2={roomY - 6} stroke="rgba(255,255,255,0.15)" strokeWidth="1" markerEnd="url(#arrowEnd)" markerStart="url(#arrowStart)" />
          {/* Right arrow */}
          <line x1={roomX + drawW + 8} y1={roomY} x2={roomX + drawW + 8} y2={roomY + drawH} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* Windows (top wall) */}
          <AnimatePresence>
            {Array.from({ length: room.windows }).map((_, i) => {
              const wx = roomX + windowGap * (i + 1) + windowWidth * i
              const wy = roomY - 1
              return (
                <motion.g
                  key={`window-${i}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Window frame */}
                  <rect
                    x={wx}
                    y={wy}
                    width={windowWidth}
                    height={6}
                    fill="rgba(56,189,248,0.2)"
                    stroke="rgba(56,189,248,0.5)"
                    strokeWidth="1.5"
                    rx="1"
                  />
                  {/* Heat loss indicator */}
                  <rect
                    x={wx}
                    y={wy - 18}
                    width={windowWidth}
                    height={18}
                    fill="url(#heatLoss)"
                    opacity="0.6"
                  />
                  {/* Window size indicator */}
                  <text x={wx + windowWidth / 2} y={wy - 6} textAnchor="middle" className="fill-red-400/60 text-[8px]">
                    {room.windowSize === 'mare' ? '▲▲' : room.windowSize === 'medie' ? '▲' : '•'}
                  </text>
                </motion.g>
              )
            })}
          </AnimatePresence>

          {/* Exterior doors (left wall, bottom) */}
          <AnimatePresence>
            {Array.from({ length: room.exteriorDoors }).map((_, i) => {
              const dx = roomX - 1
              const dy = roomY + drawH - doorHeight - 20 - i * (doorHeight + 10)
              return (
                <motion.g
                  key={`door-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {/* Door opening */}
                  <rect
                    x={dx - 2}
                    y={dy}
                    width={6}
                    height={doorHeight}
                    fill="rgba(251,191,36,0.2)"
                    stroke="rgba(251,191,36,0.5)"
                    strokeWidth="1.5"
                    rx="1"
                  />
                  {/* Door swing arc */}
                  <path
                    d={`M ${dx - 2} ${dy + doorHeight} A ${doorHeight} ${doorHeight} 0 0 1 ${dx - 2 - doorHeight * 0.6} ${dy + doorHeight * 0.4}`}
                    fill="none"
                    stroke="rgba(251,191,36,0.3)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  {/* Heat loss */}
                  <rect
                    x={dx - 22}
                    y={dy}
                    width={20}
                    height={doorHeight}
                    fill="url(#heatLoss)"
                    opacity="0.4"
                    transform={`rotate(90, ${dx - 12}, ${dy + doorHeight / 2})`}
                  />
                </motion.g>
              )
            })}
          </AnimatePresence>

          {/* Orientation indicator */}
          <g transform={`translate(${roomX + 20}, ${roomY + 20})`}>
            <circle r="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <text textAnchor="middle" y="4" className="fill-sky-400 font-display text-[10px] font-bold">
              {room.orientation}
            </text>
          </g>

          {/* AC Indoor unit (top wall, right) */}
          {topProduct && (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {/* Airflow zone */}
              <ellipse
                cx={roomX + drawW - 50}
                cy={roomY + drawH * 0.45}
                rx={drawW * 0.35}
                ry={drawH * 0.4}
                fill="url(#airflow)"
              />

              {/* Unit body */}
              <rect
                x={roomX + drawW - 50 - acUnitW / 2}
                y={roomY + 6}
                width={acUnitW}
                height={acUnitH}
                fill="rgba(14,165,233,0.15)"
                stroke="rgba(14,165,233,0.6)"
                strokeWidth="1.5"
                rx="3"
              />
              {/* Airflow lines */}
              {[0.2, 0.35, 0.5].map((offset, i) => (
                <motion.path
                  key={i}
                  d={`M ${roomX + drawW - 55} ${roomY + 22 + i * 12} Q ${roomX + drawW - 50} ${roomY + 40 + i * 18} ${roomX + drawW - 70 + i * 15} ${roomY + drawH * offset + 30}`}
                  fill="none"
                  stroke="rgba(14,165,233,0.2)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
                />
              ))}

              {/* Unit label */}
              <text
                x={roomX + drawW - 50}
                y={roomY + 38}
                textAnchor="middle"
                className="fill-sky-400 font-display text-[9px] font-bold"
              >
                AC
              </text>
            </motion.g>
          )}

          {/* Outdoor unit (below room, right) */}
          {topProduct && (
            <motion.g
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <rect
                x={roomX + drawW - 30}
                y={roomY + drawH + 16}
                width={outdoorW}
                height={outdoorH}
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
                rx="3"
              />
              {/* Fan circle */}
              <circle
                cx={roomX + drawW - 30 + outdoorW / 2}
                cy={roomY + drawH + 16 + outdoorH / 2}
                r="8"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
              {/* Connection line */}
              <line
                x1={roomX + drawW - 12}
                y1={roomY + drawH}
                x2={roomX + drawW - 12}
                y2={roomY + drawH + 16}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={roomX + drawW - 30 + outdoorW / 2}
                y={roomY + drawH + 52}
                textAnchor="middle"
                className="fill-gray-600 text-[8px]"
              >
                Ext.
              </text>
            </motion.g>
          )}

          {/* Center info - area */}
          <text
            x={roomX + drawW / 2}
            y={roomY + drawH / 2 - 8}
            textAnchor="middle"
            className="fill-white/20 font-display text-[28px] font-bold"
          >
            {thermal.area}
          </text>
          <text
            x={roomX + drawW / 2}
            y={roomY + drawH / 2 + 12}
            textAnchor="middle"
            className="fill-white/10 text-[12px]"
          >
            m²
          </text>

          {/* Room name */}
          <text
            x={roomX + drawW / 2}
            y={roomY + drawH - 12}
            textAnchor="middle"
            className="fill-gray-500 font-display text-[11px] uppercase tracking-wider"
          >
            {room.name}
          </text>

          {/* Legend */}
          <g transform={`translate(12, ${svgH - 50})`}>
            <rect x="0" y="0" width="8" height="8" fill="rgba(56,189,248,0.3)" rx="1" />
            <text x="12" y="7" className="fill-gray-600 text-[8px]">Fereastră</text>
            <rect x="0" y="14" width="8" height="8" fill="rgba(251,191,36,0.3)" rx="1" />
            <text x="12" y="21" className="fill-gray-600 text-[8px]">Ușă ext.</text>
            <rect x="0" y="28" width="8" height="8" fill="rgba(239,68,68,0.2)" rx="1" />
            <text x="12" y="35" className="fill-gray-600 text-[8px]">Pierdere termică</text>
          </g>

          {topProduct && (
            <g transform={`translate(${svgW - 100}, ${svgH - 50})`}>
              <rect x="0" y="0" width="8" height="8" fill="rgba(14,165,233,0.3)" rx="1" />
              <text x="12" y="7" className="fill-gray-600 text-[8px]">Unitate int.</text>
              <rect x="0" y="14" width="8" height="8" fill="rgba(255,255,255,0.1)" rx="1" />
              <text x="12" y="21" className="fill-gray-600 text-[8px]">Unitate ext.</text>
              <ellipse cx="4" cy="33" rx="4" ry="4" fill="rgba(14,165,233,0.1)" />
              <text x="12" y="35" className="fill-gray-600 text-[8px]">Flux aer</text>
            </g>
          )}
        </svg>
      </div>

      {/* Thermal summary below viz */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <ThermalBadge
          label="Sarcină termică"
          value={`${Math.round(thermal.thermalLoadW / 100) / 10} kW`}
          color="sky"
        />
        <ThermalBadge
          label="Volum cameră"
          value={`${thermal.volume} m³`}
          color="gray"
        />
        <ThermalBadge
          label={topProduct ? 'Produs recomandat' : 'Necesită'}
          value={topProduct ? `${topProduct.product.capacity || thermal.requiredKw + ' kW'}` : `${thermal.requiredKw} kW`}
          color={topProduct ? 'green' : 'amber'}
        />
      </div>
    </div>
  )
}

function ThermalBadge({ label, value, color }: { label: string; value: string; color: 'sky' | 'green' | 'amber' | 'gray' }) {
  const colors = {
    sky: 'bg-sky-500/10 text-sky-400 ring-sky-500/20',
    green: 'bg-green-500/10 text-green-400 ring-green-500/20',
    amber: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    gray: 'bg-white/5 text-gray-400 ring-white/10',
  }

  return (
    <div className={`rounded-xl p-3 text-center ring-1 ${colors[color]}`}>
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className="mt-1 font-display text-sm font-bold">{value}</div>
    </div>
  )
}
