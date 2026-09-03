export type CaptionSegment =
  | { type: 'text'; value: string }
  | { type: 'mention'; value: string; username: string }
  | { type: 'hashtag'; value: string; tag: string }

// A token starts with @ or #, then a letter/digit/underscore, and may contain
// dots afterwards (e.g. @juan.dela.cruz).
const TOKEN_PATTERN = /[@#][A-Za-z0-9_][A-Za-z0-9_.]*/g

const WORD_CHARACTER = /[A-Za-z0-9_]/
const TRAILING_PUNCTUATION = /[._]+$/

/**
 * Splits a caption into plain text, @mentions and #hashtags so each part can be
 * styled and made tappable. Tokens are only recognised at a word boundary, so
 * `name@example.com` stays plain text.
 */
export function parseCaption(caption: string): CaptionSegment[] {
  const segments: CaptionSegment[] = []
  const pattern = new RegExp(TOKEN_PATTERN)
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(caption)) !== null) {
    const start = match.index
    const previousCharacter = start > 0 ? caption[start - 1] : ''

    if (WORD_CHARACTER.test(previousCharacter)) continue

    const token = match[0].replace(TRAILING_PUNCTUATION, '')

    // Nothing left after the sigil, e.g. a bare "#." — treat it as text.
    if (token.length < 2) continue

    if (start > lastIndex) {
      segments.push({ type: 'text', value: caption.slice(lastIndex, start) })
    }

    const body = token.slice(1)
    segments.push(
      token.startsWith('@')
        ? { type: 'mention', value: token, username: body }
        : { type: 'hashtag', value: token, tag: body }
    )

    lastIndex = start + token.length
    pattern.lastIndex = lastIndex
  }

  if (lastIndex < caption.length) {
    segments.push({ type: 'text', value: caption.slice(lastIndex) })
  }

  return segments
}
