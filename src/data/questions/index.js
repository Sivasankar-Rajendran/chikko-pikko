import { class1, class2 } from './class1_2'
import { class3, class4 } from './class3_4'
import { class5, class6, class7, class8 } from './class5_8'
import { class9, class10, class11, class12 } from './class9_12'

export const QUESTION_BANK = {
  1: class1, 2: class2, 3: class3, 4: class4,
  5: class5, 6: class6, 7: class7, 8: class8,
  9: class9, 10: class10, 11: class11, 12: class12,
}

export const LESSON_MAP = {
  1: {
    maths: ['Numbers (1–100)', 'Addition', 'Subtraction', 'Shapes', 'Time Basics'],
    english: ['Alphabets', 'Words', 'Sentences', 'Reading', 'Picture Writing'],
  },
  2: {
    maths: ['Numbers (100–1000)', 'Addition & Subtraction', 'Multiplication Basics', 'Money', 'Measurement'],
    english: ['Nouns', 'Verbs', 'Sentences', 'Comprehension', 'Simple Writing'],
  },
  3: {
    maths: ['Place Value', 'Multiplication', 'Division', 'Fractions', 'Geometry Basics'],
    english: ['Parts of Speech', 'Tenses', 'Reading Skills', 'Paragraph Writing', 'Vocabulary'],
  },
  4: {
    maths: ['Large Numbers', 'Factors & Multiples', 'Fractions', 'Perimeter & Area', 'Data Handling'],
    english: ['Grammar Basics', 'Tenses', 'Comprehension', 'Story Writing', 'Synonyms/Antonyms'],
  },
  5: {
    maths: ['Large Numbers', 'Fractions', 'Decimals', 'Percentage Basics', 'Data Handling'],
    english: ['Nouns & Pronouns', 'Adjectives', 'Articles & Prepositions', 'Tenses', 'Writing Skills'],
  },
  6: {
    maths: ['Integers', 'Algebra Basics'],
    english: ['Parts of Speech', 'Active/Passive Voice'],
  },
  7: {
    maths: ['Rational Numbers', 'Simple Equations'],
    english: ['Tenses Advanced', 'Modals'],
  },
  8: {
    maths: ['Linear Equations', 'Exponents'],
    english: ['Reported Speech', 'Voice'],
  },
  9: {
    maths: ['Number Systems', 'Polynomials'],
    english: ['Grammar', 'Writing Skills'],
  },
  10: {
    maths: ['Real Numbers', 'Quadratic Equations'],
    english: ['Advanced Grammar', 'Letter Writing'],
  },
  11: {
    maths:    ['Sets & Functions', 'Trigonometry'],
    english:  ['Advanced Writing', 'Literature Analysis'],
    physics:  ['Physical World', 'Units & Measurements'],
    chemistry: ['Basic Concepts of Chemistry', 'Structure of Atom'],
  },
  12: {
    maths:    ['Relations & Functions', 'Calculus'],
    english:  ['Writing Skills', 'Literature'],
    physics:  ['Electric Charges & Fields', 'Electrostatic Potential'],
    chemistry: ['The Solid State', 'Solutions'],
  },
}

export const DIFFICULTIES = ['easy', 'medium', 'hard']

export function getQuestions(classNum, subject, lesson, difficulty) {
  try {
    return QUESTION_BANK[classNum][subject][lesson][difficulty] || []
  } catch {
    return []
  }
}
