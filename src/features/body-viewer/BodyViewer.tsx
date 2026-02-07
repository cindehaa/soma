import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { BodyModel } from './BodyModel'
import { BioDigitalViewer } from './BioDigitalViewer'
import { useAppStore } from '../../store'
import { BODY_REGION_LABELS, type BodyRegionId } from './bodyRegions'

type ViewerMode = 'biodigital' | 'simple'

/**
 * 3D body viewer with BioDigital Human integration.
 * Features realistic anatomical model with click-to-select body regions.
 * Falls back to simple geometric model if BioDigital fails to load.
 */
export function BodyViewer() {
  const selectedBodyRegion = useAppStore((s) => s.selectedBodyRegion)
  const setSelectedBodyRegion = useAppStore((s) => s.setSelectedBodyRegion)
  const [viewerMode, setViewerMode] = useState<ViewerMode>('biodigital')
  const [selectedAnatomy, setSelectedAnatomy] = useState<string | null>(null)

  const handleClearSelection = () => {
    setSelectedBodyRegion(null)
    setSelectedAnatomy(null)
  }

  const handleBioDigitalSelect = (region: BodyRegionId, anatomyName?: string) => {
    setSelectedBodyRegion(region)
    setSelectedAnatomy(anatomyName || null)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Viewer mode toggle */}
      <div className="flex items-center justify-end gap-2 px-1">
        <span className="text-xs text-slate-500">View:</span>
        <div className="flex rounded-lg bg-slate-100 p-0.5">
          <button
            onClick={() => setViewerMode('biodigital')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewerMode === 'biodigital'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Realistic
          </button>
          <button
            onClick={() => setViewerMode('simple')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewerMode === 'simple'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Simple
          </button>
        </div>
      </div>

      {/* Responsive container */}
      <div className="h-[60vh] min-h-[320px] max-h-[520px] md:h-[480px] rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-200">
        {viewerMode === 'biodigital' ? (
          <BioDigitalViewer
            onSelectRegion={handleBioDigitalSelect}
            highlightedRegion={selectedBodyRegion}
          />
        ) : (
          <div className="w-full h-full touch-none">
            <Canvas
              camera={{ position: [0, 0, 4], fov: 45 }}
              onPointerMissed={handleClearSelection}
            >
              <ambientLight intensity={0.8} />
              <directionalLight position={[4, 4, 4]} intensity={1} />
              <BodyModel
                onSelectRegion={setSelectedBodyRegion}
                highlightedRegion={selectedBodyRegion}
              />
              <OrbitControls
                enablePan={false}
                enableZoom
                enableRotate
                minDistance={2}
                maxDistance={8}
                touches={{ ONE: 1, TWO: 2 }}
              />
            </Canvas>
          </div>
        )}
      </div>

      {/* Selection info & clear button */}
      <div className="flex items-center justify-between px-1">
        <div className="text-sm text-slate-600">
          {selectedBodyRegion ? (
            <div className="flex flex-col">
              <span>
                Region: <span className="font-medium text-indigo-600">{BODY_REGION_LABELS[selectedBodyRegion]}</span>
              </span>
              {selectedAnatomy && viewerMode === 'biodigital' && (
                <span className="text-xs text-slate-400">
                  Structure: {selectedAnatomy}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400">Tap a body region to log a symptom</span>
          )}
        </div>
        {selectedBodyRegion && (
          <button
            onClick={handleClearSelection}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
