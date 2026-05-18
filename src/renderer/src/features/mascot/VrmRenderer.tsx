import { useEffect, useRef, useState } from 'react'

import {
  AmbientLight,
  Box3,
  Clock,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { VRMLoaderPlugin, VRMUtils, type VRM } from '@pixiv/three-vrm'
import type { RendererBranchState } from './CharacterRenderer'
import { applyDefaultIdlePose } from './vrmPoseUtils'

interface VrmRendererProps {
  modelRelativePath: string
  variant: 'mascot' | 'preview'
  loadingLabel: string
  errorTitle: string
  errorHint: string
  renderingLabel: string
  selectedModelLabel: string
  selectedModelName: string
  modelFormatLabel: string
  modelFormatName: string
  modelPathLabel: string
  showMeta: boolean
  onRendererLoadStateChange?: (state: 'idle' | 'loading' | 'ready' | 'error') => void
  onRendererBranchStateChange?: (state: RendererBranchState) => void
  onRendererModelUrlChange?: (url?: string) => void
  onInteract?: (event: React.MouseEvent<HTMLElement>) => void
  vrmMotionSettings?: {
    idleMotionEnabled: boolean
    springBoneEnabled: boolean
    blinkEnabled: boolean
    mouthMotionEnabled: boolean
    isSpeaking?: boolean
  }
}

type VrmLoadStatus = 'loading' | 'ready' | 'error'

function fitCameraToModel(camera: PerspectiveCamera, modelRoot: Group): { targetY: number; bobAmplitude: number } {
  const bounds = new Box3().setFromObject(modelRoot)
  const size = new Vector3()
  const center = new Vector3()
  bounds.getSize(size)
  bounds.getCenter(center)

  modelRoot.position.x -= center.x
  modelRoot.position.y -= bounds.min.y
  modelRoot.position.z -= center.z

  const fovRad = (camera.fov * Math.PI) / 180
  const maxDim = Math.max(size.x, size.y, size.z, 0.01)
  const distance = (maxDim / (2 * Math.tan(fovRad / 2))) * 1.45
  const targetY = size.y * 0.5
  const cameraHeight = size.y * 0.62

  camera.position.set(0, cameraHeight, distance)
  camera.near = Math.max(distance / 200, 0.01)
  camera.far = Math.max(distance * 20, 100)
  camera.lookAt(0, targetY, 0)
  camera.updateProjectionMatrix()

  return {
    targetY,
    bobAmplitude: Math.min(Math.max(size.y * 0.012, 0.008), 0.05)
  }
}

export function VrmRenderer({
  modelRelativePath,
  variant,
  loadingLabel,
  errorTitle,
  errorHint,
  renderingLabel,
  selectedModelLabel,
  selectedModelName,
  modelFormatLabel,
  modelFormatName,
  modelPathLabel,
  showMeta,
  onRendererLoadStateChange,
  onRendererBranchStateChange,
  onRendererModelUrlChange,
  onInteract,
  vrmMotionSettings
}: VrmRendererProps): React.JSX.Element {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const onRendererLoadStateChangeRef = useRef(onRendererLoadStateChange)
  const onRendererBranchStateChangeRef = useRef(onRendererBranchStateChange)
  const onRendererModelUrlChangeRef = useRef(onRendererModelUrlChange)
  const vrmMotionSettingsRef = useRef(vrmMotionSettings)
  const [status, setStatus] = useState<VrmLoadStatus>('loading')

  useEffect(() => {
    onRendererLoadStateChangeRef.current = onRendererLoadStateChange
  }, [onRendererLoadStateChange])

  useEffect(() => {
    onRendererBranchStateChangeRef.current = onRendererBranchStateChange
  }, [onRendererBranchStateChange])

  useEffect(() => {
    onRendererModelUrlChangeRef.current = onRendererModelUrlChange
  }, [onRendererModelUrlChange])

  useEffect(() => {
    vrmMotionSettingsRef.current = vrmMotionSettings
  }, [vrmMotionSettings])

  useEffect(() => {
    const hostElement = hostRef.current
    if (!hostElement) {
      return
    }

    let isDisposed = false
    let animationFrameId = 0
    let resizeObserver: ResizeObserver | null = null
    let webglRenderer: WebGLRenderer | null = null
    let loadedVrm: VRM | null = null
    let loadedRoot: Group | null = null
    let blobUrl: string | null = null
    const clock = new Clock()
    const scene = new Scene()
    const camera = new PerspectiveCamera(28, 1, 0.01, 1000)
    const ambientLight = new AmbientLight(0xffffff, 1.0)
    const keyLight = new DirectionalLight(0xffffff, 1.6)
    const fillLight = new DirectionalLight(0xbfd8ff, 0.7)
    let idleTargetY = 1
    let idleBobAmplitude = 0.01

    scene.add(ambientLight)
    keyLight.position.set(1.8, 3, 2.4)
    fillLight.position.set(-2, 1.8, -1.8)
    scene.add(keyLight)
    scene.add(fillLight)

    const updateRendererSize = (): void => {
      if (!webglRenderer) {
        return
      }

      const rect = hostElement.getBoundingClientRect()
      const width = Math.max(Math.floor(rect.width), 1)
      const minHeight = variant === 'mascot' ? 180 : 260
      const height = Math.max(Math.floor(rect.height), minHeight)

      webglRenderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const renderFrame = (): void => {
      if (isDisposed || !webglRenderer) {
        return
      }

      const delta = clock.getDelta()
      const elapsed = clock.elapsedTime
        if (loadedVrm) {
          const currentMotionSettings = vrmMotionSettingsRef.current
          loadedVrm.update(delta)
          const springBoneManager = (loadedVrm as unknown as { springBoneManager?: { enabled?: boolean } }).springBoneManager
          if (springBoneManager && typeof springBoneManager.enabled === 'boolean') {
            springBoneManager.enabled = currentMotionSettings?.springBoneEnabled !== false
          }
          const expressionManager = (loadedVrm as unknown as { expressionManager?: { setValue?: (name: string, value: number) => void } }).expressionManager
        const setExpressionValue = (name: string, value: number): void => {
          expressionManager?.setValue?.(name, value)
        }
          if (currentMotionSettings?.blinkEnabled === false) {
            setExpressionValue('blink', 0)
          }
          if (currentMotionSettings?.mouthMotionEnabled !== true || currentMotionSettings?.isSpeaking !== true) {
          setExpressionValue('aa', 0)
          setExpressionValue('ih', 0)
          setExpressionValue('ou', 0)
          setExpressionValue('ee', 0)
          setExpressionValue('oh', 0)
        }
      }

      if (loadedRoot) {
        loadedRoot.position.y =
          vrmMotionSettingsRef.current?.idleMotionEnabled === false ? 0 : Math.sin(elapsed * 0.7) * idleBobAmplitude
      }

      camera.lookAt(0, idleTargetY, 0)
      webglRenderer.render(scene, camera)
      animationFrameId = window.requestAnimationFrame(renderFrame)
    }

    const initialize = async (): Promise<void> => {
      try {
        setStatus('loading')
        onRendererLoadStateChangeRef.current?.('loading')
        onRendererBranchStateChangeRef.current?.('3d-vrm-loading')

        const modelBinary = await window.chararium.models.readModelBinary({
          relativePath: modelRelativePath
        })

        if (isDisposed) {
          return
        }

        const modelArrayBuffer = new ArrayBuffer(modelBinary.byteLength)
        new Uint8Array(modelArrayBuffer).set(modelBinary)
        blobUrl = URL.createObjectURL(new Blob([modelArrayBuffer], { type: 'model/gltf-binary' }))
        onRendererModelUrlChangeRef.current?.(blobUrl)

        const renderer = new WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        })

        renderer.setClearAlpha(0)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.outputColorSpace = 'srgb'
        hostElement.replaceChildren(renderer.domElement)
        webglRenderer = renderer

        updateRendererSize()

        resizeObserver = new ResizeObserver(() => updateRendererSize())
        resizeObserver.observe(hostElement)

        const loader = new GLTFLoader()
        loader.register((parser) => new VRMLoaderPlugin(parser))

        loader.load(
          blobUrl,
          (gltf) => {
            if (isDisposed) {
              return
            }

            const vrm = gltf.userData.vrm as VRM | undefined
            if (!vrm) {
              setStatus('error')
              onRendererLoadStateChangeRef.current?.('error')
              onRendererBranchStateChangeRef.current?.('3d-vrm-error')
              return
            }

            VRMUtils.rotateVRM0(vrm)
            applyDefaultIdlePose(vrm)

            const modelRoot = new Group()
            modelRoot.add(vrm.scene)
            scene.add(modelRoot)

            const framing = fitCameraToModel(camera, modelRoot)
            idleTargetY = framing.targetY
            idleBobAmplitude = framing.bobAmplitude
            loadedRoot = modelRoot
            loadedVrm = vrm

            setStatus('ready')
            onRendererLoadStateChangeRef.current?.('ready')
            onRendererBranchStateChangeRef.current?.('3d-vrm-ready')
            clock.start()
            renderFrame()
          },
          undefined,
          (error) => {
            console.error('Failed to load VRM model', error)
            if (!isDisposed) {
              setStatus('error')
              onRendererLoadStateChangeRef.current?.('error')
              onRendererBranchStateChangeRef.current?.('3d-vrm-error')
            }
          }
        )
      } catch (error) {
        console.error('Failed to initialize VRM renderer', error)
        if (!isDisposed) {
          setStatus('error')
          onRendererLoadStateChangeRef.current?.('error')
          onRendererBranchStateChangeRef.current?.('3d-vrm-error')
        }
      }
    }

    void initialize()

    return () => {
      isDisposed = true
      onRendererLoadStateChangeRef.current?.('idle')
      onRendererModelUrlChangeRef.current?.(undefined)
      window.cancelAnimationFrame(animationFrameId)
      resizeObserver?.disconnect()

      if (loadedVrm) {
        VRMUtils.deepDispose(loadedVrm.scene)
      }

      if (webglRenderer) {
        webglRenderer.dispose()
        webglRenderer.forceContextLoss()
      }

      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [modelRelativePath, variant])

  const showLoading = status === 'loading'
  const showError = status === 'error'

  return (
    <div className="vrm-renderer-shell">
      <button
        type="button"
        className="vrm-renderer-stage mascot-interaction-target mascot-no-drag"
        onClick={onInteract}
      >
        <div ref={hostRef} className="vrm-renderer-canvas-host" />
        {showLoading ? <div className="vrm-overlay">{loadingLabel}</div> : null}
        {showError ? (
          <div className="vrm-overlay error">
            <strong>{errorTitle}</strong>
            <p>{errorHint}</p>
          </div>
        ) : null}
      </button>
      {showMeta ? (
        <div className="vrm-renderer-meta">
          <p>{renderingLabel}</p>
          <p>
            {selectedModelLabel}: {selectedModelName}
          </p>
          <p>
            {modelFormatLabel}: {modelFormatName}
          </p>
          <p className="renderer-model-path">
            {modelPathLabel}: {modelRelativePath}
          </p>
        </div>
      ) : null}
    </div>
  )
}
