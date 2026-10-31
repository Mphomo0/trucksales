import { describe, expect, it } from 'vitest'
import { BLACK_FRIDAY_CHAT_LINKS, getWelcomeMessage } from './chat-greeting'

describe('getWelcomeMessage', () => {
  it('returns the original welcome text when the campaign is not live', () => {
    expect(getWelcomeMessage(false)).toEqual({
      role: 'assistant',
      message:
        "Hi, I'm the A-Z Truck Sales assistant.\n\nI can help you find available trucks, answer vehicle questions, and help you contact our sales team.",
    })
  })

  it('returns the Black Friday greeting when live', () => {
    expect(getWelcomeMessage(true)).toEqual({
      role: 'assistant',
      message:
        "Hi, I'm the A-Z Truck Sales assistant.\n\nBlack Friday deals are live until 30 November. What kind of truck are you looking for?",
    })
  })

  it('never mentions units in the campaign message', () => {
    expect(getWelcomeMessage(true).message).not.toMatch(/\bunits?\b/i)
  })
})

describe('BLACK_FRIDAY_CHAT_LINKS', () => {
  it('lists the three links in order', () => {
    expect(BLACK_FRIDAY_CHAT_LINKS).toEqual([
      { label: 'Trucks', href: '/specials?type=trucks' },
      { label: 'Spares', href: '/specials?type=spares' },
      { label: 'Show all deals', href: '/specials' },
    ])
  })
})
