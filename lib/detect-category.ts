type CategoryRule = {
  keywords: string[]
  category: string
}

const RULES: CategoryRule[] = [
  {
    keywords: [
      'software', 'developer', 'engineer', 'it ', ' it', 'devops', 'frontend', 'backend',
      'fullstack', 'full-stack', 'full stack', 'data', 'cloud', 'security', 'python',
      'javascript', 'java', 'architect', 'tech', 'infrastructure', 'platform', 'sre',
      'machine learning', 'ai ', ' ai', 'mobile', 'android', 'ios', 'qa', 'testing',
      'database', 'network', 'systems', 'cyber', 'product manager', 'scrum', 'agile',
    ],
    category: 'Πληροφορική & Τεχνολογία',
  },
  {
    keywords: [
      'sales', 'marketing', 'growth', 'crm', 'brand', 'digital marketing', 'seo', 'sem',
      'social media', 'content', 'copywriter', 'account manager', 'business development',
      'commercial', 'ecommerce', 'e-commerce', 'campaign', 'communications', 'pr ',
    ],
    category: 'Πωλήσεις & Marketing',
  },
  {
    keywords: [
      'finance', 'financial', 'accounting', 'accountant', 'cfo', 'controller', 'audit',
      'tax', 'treasury', 'budget', 'payroll', 'bookkeeping', 'reporting', 'analyst',
      'credit', 'risk', 'compliance', 'aml', 'investment', 'banking', 'actuar',
    ],
    category: 'Λογιστική & Οικονομικά',
  },
  {
    keywords: [
      'hotel', 'tourism', 'hospitality', 'reception', 'front desk', 'concierge',
      'housekeeping', 'travel', 'tour', 'resort', 'spa', 'guest', 'f&b', 'bartender',
      'beach', 'cruise',
    ],
    category: 'Τουρισμός & Φιλοξενία',
  },
  {
    keywords: [
      'teacher', 'education', 'tutor', 'instructor', 'trainer', 'professor', 'school',
      'university', 'curriculum', 'e-learning', 'elearning', 'pedagogy', 'academic',
    ],
    category: 'Εκπαίδευση',
  },
  {
    keywords: [
      'doctor', 'nurse', 'pharma', 'health', 'medical', 'clinical', 'physician',
      'dentist', 'veterinar', 'laboratory', 'radiol', 'surgeon', 'therapy', 'physio',
      'healthcare', 'hospital', 'pharmacist',
    ],
    category: 'Υγεία & Φαρμακευτική',
  },
  {
    keywords: [
      'construction', 'civil', 'mechanical engineer', 'electrical engineer',
      'structural', 'building', 'real estate', 'property', 'surveyor', 'autocad',
      'maintenance', 'facility', 'hvac', 'plumbing', 'welding', 'technical',
    ],
    category: 'Κατασκευές & Τεχνικά',
  },
  {
    keywords: [
      'legal', 'lawyer', 'attorney', 'counsel', 'paralegal', 'law ', ' law',
      'litigation', 'contract', 'gdpr', 'intellectual property', 'ip ',
    ],
    category: 'Νομικά',
  },
  {
    keywords: [
      'admin', 'secretary', 'assistant', 'hr ', ' hr', 'human resources', 'recruiter',
      'talent', 'office manager', 'coordinator', 'executive assistant', 'operations',
      'back office', 'customer service', 'customer support', 'helpdesk', 'support',
    ],
    category: 'Διοίκηση & Γραμματεία',
  },
  {
    keywords: [
      'chef', 'cook', 'waiter', 'waitress', 'restaurant', 'kitchen', 'barista',
      'food', 'beverage', 'catering', 'pastry', 'baker', 'sommelier',
    ],
    category: 'Εστίαση',
  },
  {
    keywords: [
      'retail', 'store', 'shop', 'cashier', 'sales associate', 'merchandis',
      'visual', 'buyer', 'purchasing', 'category manager',
    ],
    category: 'Λιανεμπόριο',
  },
  {
    keywords: [
      'logistics', 'warehouse', 'driver', 'delivery', 'supply chain', 'procurement',
      'import', 'export', 'customs', 'freight', 'transport', 'distribution',
      'inventory', 'fleet',
    ],
    category: 'Logistics & Αποθήκη',
  },
  {
    keywords: [
      'maritime', 'shipping', 'naval', 'marine', 'vessel', 'captain', 'officer',
      'seafarer', 'port', 'fleet', 'nautical',
    ],
    category: 'Ναυτιλία',
  },
]

export function detectCategory(title: string, department?: string): string {
  const haystack = `${title} ${department ?? ''}`.toLowerCase()

  for (const rule of RULES) {
    for (const kw of rule.keywords) {
      if (haystack.includes(kw)) {
        return rule.category
      }
    }
  }

  return 'Άλλο'
}
