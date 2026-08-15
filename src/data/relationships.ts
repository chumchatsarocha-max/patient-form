/**
 * Emergency-contact relationship options. Optional on its own, but becomes required once
 * an emergency contact name is filled in (enforced via superRefine).
 */

import type { Option } from './languages';

export const RELATIONSHIPS = [
  { value: 'spouse', label: 'Spouse / Partner', labelTh: 'คู่สมรส / คู่ชีวิต' },
  { value: 'parent', label: 'Parent', labelTh: 'บิดา / มารดา' },
  { value: 'child', label: 'Child', labelTh: 'บุตร' },
  { value: 'sibling', label: 'Sibling', labelTh: 'พี่น้อง' },
  { value: 'grandparent', label: 'Grandparent', labelTh: 'ปู่ ย่า ตา ยาย' },
  { value: 'relative', label: 'Other relative', labelTh: 'ญาติคนอื่น' },
  { value: 'friend', label: 'Friend', labelTh: 'เพื่อน' },
  { value: 'colleague', label: 'Colleague', labelTh: 'เพื่อนร่วมงาน' },
  { value: 'caregiver', label: 'Caregiver', labelTh: 'ผู้ดูแล' },
  { value: 'guardian', label: 'Legal guardian', labelTh: 'ผู้ปกครองตามกฎหมาย' },
  { value: 'other', label: 'Other', labelTh: 'อื่น ๆ' },
] as const satisfies readonly Option[];
