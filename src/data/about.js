import { site } from './site.js'

// About page copy. TODO: from Ali — confirm the bio, principles and years of experience.
export const about = {
  pullQuote: 'Every frame is a decision.',
  bio: [
    'I work at the intersection of technical craft and raw emotion — composing and cutting shots that don’t just document a moment, but make you feel it.',
    'From intimate weddings and brand campaigns to documentaries and short-form, I bring a director’s eye and a documentarian’s patience to every project. Six years in, the obsession with light, motion and storytelling hasn’t dimmed.',
  ],
  years: '6+',
  facts: [
    { label: 'Based in', value: site.location },
    { label: 'Works', value: site.reach },
    { label: 'Focus', value: 'Editing · Colour · Story' },
    { label: 'Availability', value: site.availability },
  ],
  principles: [
    {
      num: '01',
      title: 'Story first',
      desc: 'The cut starts with what the film needs to say, not with whichever footage there is most of.',
    },
    {
      num: '02',
      title: 'Sound and colour are the edit',
      desc: 'Grade and mix are shaped alongside the story, so the finished film feels like one piece, not layers.',
    },
    {
      num: '03',
      title: 'Made for where it’s watched',
      desc: 'Every delivery is framed and paced for its screen: a cinema wall, a client pitch or a phone in a feed.',
    },
  ],
}
