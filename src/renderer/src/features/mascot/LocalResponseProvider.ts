import localResponses from '../../../../../assets/responses/local-responses.ja.json'
import type { LocalResponseDictionary, MascotResponse, ResponseProvider } from '@shared/index'

const responseDictionary = localResponses as LocalResponseDictionary
const fallbackResponseText = 'こんにちは。'

export class LocalResponseProvider implements ResponseProvider {
  public readonly mode = 'local' as const

  public async getResponse(input: string): Promise<MascotResponse> {
    const responseGroup = this.resolveResponseGroup(input)
    const text = responseGroup[Date.now() % responseGroup.length] ?? fallbackResponseText

    return {
      text,
      emotion: 'happy'
    }
  }

  private resolveResponseGroup(input: string): string[] {
    if (input === 'morning') {
      return responseDictionary.morning
    }

    if (input === 'night') {
      return responseDictionary.night
    }

    return responseDictionary.click
  }
}
