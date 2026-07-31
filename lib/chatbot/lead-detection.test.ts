import { describe, it, expect } from 'vitest'
import { detectLead, extractLeadInfo } from './lead-detection'

// The first two cases are real visitor messages (numbers replaced). Both were
// silently discarded by the old trigger-phrase gate, which required one of nine
// exact substrings before it would look for contact details. Across 58 real
// messages that gate matched zero times. These guard against it coming back.
describe('detectLead', () => {
  it('captures a lead that never uses a trigger phrase', () => {
    const lead = detectLead(
      'My name is Gift, kindly receive my number 0821234567',
    )
    expect(lead).not.toBeNull()
    expect(lead?.name).toBe('Gift')
    expect(lead?.phone).toBe('0821234567')
  })

  it('captures a lead buried in a longer enquiry', () => {
    const lead = detectLead(
      'Good Day! My name is Tshepo. I have a cross border potential buyer who urgently wants to buy a truck, reach me on 0731234567',
    )
    expect(lead?.name).toBe('Tshepo')
    expect(lead?.phone).toBe('0731234567')
  })

  it('captures a bare phone number with no name', () => {
    const lead = detectLead('0821234567')
    expect(lead).not.toBeNull()
    expect(lead?.name).toBeNull()
    expect(lead?.phone).toBe('0821234567')
  })

  it('still captures when a trigger phrase is present', () => {
    expect(detectLead('please call me on 082 123 4567')).not.toBeNull()
  })

  it('picks up an email alongside the phone number', () => {
    const lead = detectLead('Contact me at john@example.com or 0114567890')
    expect(lead?.email).toBe('john@example.com')
  })

  it('ignores intent with no way to reach the person', () => {
    expect(detectLead('Hi, I’m interested in truck is it still available?')).toBeNull()
  })

  it('does not mistake a price for a phone number', () => {
    expect(
      detectLead('I want a truck thats old year model, im hoping maybe 100k'),
    ).toBeNull()
  })

  it('does not mistake a year or model number for a phone number', () => {
    expect(detectLead('Is the 2018 Isuzu NPR400 still available?')).toBeNull()
  })

  it('ignores chatter', () => {
    expect(detectLead('Pizza game')).toBeNull()
  })
})

describe('extractLeadInfo', () => {
  it('returns nulls rather than empty strings when nothing matches', () => {
    expect(extractLeadInfo('hello')).toEqual({
      name: null,
      phone: null,
      email: null,
    })
  })
})
