export interface ServiceFeature {
  h3: string;
  content: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceDeliverable {
  label: string;
  detail?: string;
}

export interface Equipment {
  name: string;
  detail?: string;
}
