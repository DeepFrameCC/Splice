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

export interface EquipmentItem {
  name: string;
  detail?: string;
}

export type Equipment = EquipmentItem;
