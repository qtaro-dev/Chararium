import { MathUtils, type Object3D } from 'three'
import { VRMHumanBoneName, type VRM } from '@pixiv/three-vrm'

const ENABLE_DEFAULT_IDLE_POSE = true

function setBoneEulerDegrees(
  bone: Object3D | null,
  eulerDegrees: { x?: number; y?: number; z?: number }
): void {
  if (!bone) {
    return
  }

  if (typeof eulerDegrees.x === 'number') {
    bone.rotation.x = MathUtils.degToRad(eulerDegrees.x)
  }

  if (typeof eulerDegrees.y === 'number') {
    bone.rotation.y = MathUtils.degToRad(eulerDegrees.y)
  }

  if (typeof eulerDegrees.z === 'number') {
    bone.rotation.z = MathUtils.degToRad(eulerDegrees.z)
  }

  bone.updateMatrixWorld(true)
}

export function applyDefaultIdlePose(vrm: VRM): void {
  if (!ENABLE_DEFAULT_IDLE_POSE || !vrm.humanoid) {
    return
  }

  const humanoid = vrm.humanoid
  humanoid.resetNormalizedPose()

  const leftShoulder = humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftShoulder)
  const rightShoulder = humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightShoulder)
  const leftUpperArm = humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperArm)
  const rightUpperArm = humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightUpperArm)
  const leftLowerArm = humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftLowerArm)
  const rightLowerArm = humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightLowerArm)
  const leftHand = humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftHand)
  const rightHand = humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightHand)

  // Keep the adjustment conservative to avoid model-specific pose collapse.
  setBoneEulerDegrees(leftShoulder, { z: -8 })
  setBoneEulerDegrees(rightShoulder, { z: 8 })
  setBoneEulerDegrees(leftUpperArm, { z: -52 })
  setBoneEulerDegrees(rightUpperArm, { z: 52 })
  setBoneEulerDegrees(leftLowerArm, { z: -12 })
  setBoneEulerDegrees(rightLowerArm, { z: 12 })
  setBoneEulerDegrees(leftHand, { z: 4 })
  setBoneEulerDegrees(rightHand, { z: -4 })

  humanoid.update()
}

