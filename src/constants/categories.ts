// Predefined blog categories for tech and personal topics
export const PREDEFINED_CATEGORIES = [
  // Tech Categories
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Mobile Development', label: 'Mobile Development' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Cloud Computing', label: 'Cloud Computing' },
  { value: 'AI & Machine Learning', label: 'AI & Machine Learning' },
  { value: 'Cybersecurity', label: 'Cybersecurity' },
  { value: 'Database', label: 'Database' },
  { value: 'Programming Languages', label: 'Programming Languages' },
  { value: 'Software Architecture', label: 'Software Architecture' },
  { value: 'Open Source', label: 'Open Source' },
  { value: 'Tech News', label: 'Tech News' },
  { value: 'Tools & Productivity', label: 'Tools & Productivity' },

  // Personal Categories
  { value: 'Personal', label: 'Personal' },
  { value: 'Life & Lifestyle', label: 'Life & Lifestyle' },
  { value: 'Career', label: 'Career' },
  { value: 'Learning', label: 'Learning' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Books & Reading', label: 'Books & Reading' },
  { value: 'Productivity', label: 'Productivity' },
  { value: 'Thoughts & Reflections', label: 'Thoughts & Reflections' },
  { value: 'Projects', label: 'Projects' },
  { value: 'Tutorials', label: 'Tutorials' },
] as const

export type CategoryValue = (typeof PREDEFINED_CATEGORIES)[number]['value']
