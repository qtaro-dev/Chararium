import type { CharacterRendererType } from './rendererTypes'

export const characterModelFormats = [
  'placeholder',
  'live2d-model3-json',
  'vrm',
  'gltf',
  'glb'
] as const

export type CharacterModelFormat = (typeof characterModelFormats)[number]

export interface CharacterModelDefinition {
  id: string
  displayName: string
  format: CharacterModelFormat
  rendererType: CharacterRendererType
  entryFilePath?: string
  relativePath?: string
  directoryPath?: string
  thumbnailPath?: string
  isBundled: boolean
  isAvailable: boolean
}

export function getRendererTypeFromModelFormat(format: CharacterModelFormat): CharacterRendererType {
  if (format === 'live2d-model3-json') {
    return 'live2d'
  }

  if (format === 'vrm' || format === 'gltf' || format === 'glb') {
    return '3d'
  }

  return 'placeholder'
}
