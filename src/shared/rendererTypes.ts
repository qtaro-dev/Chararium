export const characterRendererTypes = ['placeholder', 'live2d', '3d'] as const

export type CharacterRendererType = (typeof characterRendererTypes)[number]

export interface CharacterRendererInfo {
  type: CharacterRendererType
  labelKey: string
  isAvailable: boolean
  descriptionKey: string
}

export const characterRendererInfos: readonly CharacterRendererInfo[] = [
  {
    type: 'placeholder',
    labelKey: 'characterRendererPlaceholder',
    isAvailable: true,
    descriptionKey: 'characterRendererPlaceholderDescription'
  },
  {
    type: 'live2d',
    labelKey: 'characterRendererLive2D',
    isAvailable: false,
    descriptionKey: 'characterRendererLive2DPreparing'
  },
  {
    type: '3d',
    labelKey: 'characterRenderer3D',
    isAvailable: false,
    descriptionKey: 'characterRenderer3DPreparing'
  }
] as const
