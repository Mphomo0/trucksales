// Detecting a sales lead inside a free-text chat message.
//
// History worth keeping: this used to require the message to contain one of a
// handful of exact phrases ("call me", "i am interested in", ...) BEFORE it
// would even look for contact details. Across 58 real visitor messages that
// gate matched zero times while discarding two people who had typed out their
// name and phone number. Contact details are the signal — not the phrasing.

export interface DetectedLead {
  name: string | null
  phone: string
  email: string | null
  message: string
}

// Needs ~9+ digits, so prices ("100k") and years ("2018") don't match.
const PHONE_PATTERN =
  /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3}[-.\s]?\d{4}/

const NAME_PATTERN = /name\s+(?:is\s+)?(\w+(?:\s+\w+)?)/i

const EMAIL_PATTERN = /[\w.-]+@[\w.-]+\.\w+/

export function extractLeadInfo(message: string) {
  return {
    name: message.match(NAME_PATTERN)?.[1]?.trim() || null,
    phone: message.match(PHONE_PATTERN)?.[0]?.trim() || null,
    email: message.match(EMAIL_PATTERN)?.[0]?.trim() || null,
  }
}

/**
 * A lead is any message that gives us a way to phone the person back.
 *
 * The name is optional on purpose: a bare phone number from someone browsing
 * trucks is actionable, and demanding a name lost real enquiries. Callers
 * supply a placeholder when it is missing.
 */
export function detectLead(message: string): DetectedLead | null {
  const { name, phone, email } = extractLeadInfo(message)
  if (!phone) return null

  return { name, phone, email, message: message.trim() }
}
