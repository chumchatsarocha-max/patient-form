/**
 * Nationality options. `value` is ISO 3166-1 alpha-2; `label` is the demonym (Thai uses
 * the nationality name instead). Seed list, not exhaustive.
 */

import type { Option } from './languages';

export const NATIONALITIES = [
  { value: 'TH', label: 'Thai', labelTh: 'ไทย' },
  { value: 'AU', label: 'Australian', labelTh: 'ออสเตรเลีย' },
  { value: 'BD', label: 'Bangladeshi', labelTh: 'บังกลาเทศ' },
  { value: 'BR', label: 'Brazilian', labelTh: 'บราซิล' },
  { value: 'KH', label: 'Cambodian', labelTh: 'กัมพูชา' },
  { value: 'CA', label: 'Canadian', labelTh: 'แคนาดา' },
  { value: 'CN', label: 'Chinese', labelTh: 'จีน' },
  { value: 'FR', label: 'French', labelTh: 'ฝรั่งเศส' },
  { value: 'DE', label: 'German', labelTh: 'เยอรมนี' },
  { value: 'HK', label: 'Hong Konger', labelTh: 'ฮ่องกง' },
  { value: 'IN', label: 'Indian', labelTh: 'อินเดีย' },
  { value: 'ID', label: 'Indonesian', labelTh: 'อินโดนีเซีย' },
  { value: 'IT', label: 'Italian', labelTh: 'อิตาลี' },
  { value: 'JP', label: 'Japanese', labelTh: 'ญี่ปุ่น' },
  { value: 'LA', label: 'Lao', labelTh: 'ลาว' },
  { value: 'MY', label: 'Malaysian', labelTh: 'มาเลเซีย' },
  { value: 'MM', label: 'Myanmar', labelTh: 'เมียนมา' },
  { value: 'NP', label: 'Nepali', labelTh: 'เนปาล' },
  { value: 'NL', label: 'Dutch', labelTh: 'เนเธอร์แลนด์' },
  { value: 'NZ', label: 'New Zealander', labelTh: 'นิวซีแลนด์' },
  { value: 'PK', label: 'Pakistani', labelTh: 'ปากีสถาน' },
  { value: 'PH', label: 'Filipino', labelTh: 'ฟิลิปปินส์' },
  { value: 'RU', label: 'Russian', labelTh: 'รัสเซีย' },
  { value: 'SA', label: 'Saudi', labelTh: 'ซาอุดีอาระเบีย' },
  { value: 'SG', label: 'Singaporean', labelTh: 'สิงคโปร์' },
  { value: 'KR', label: 'South Korean', labelTh: 'เกาหลีใต้' },
  { value: 'ES', label: 'Spanish', labelTh: 'สเปน' },
  { value: 'SE', label: 'Swedish', labelTh: 'สวีเดน' },
  { value: 'CH', label: 'Swiss', labelTh: 'สวิตเซอร์แลนด์' },
  { value: 'TW', label: 'Taiwanese', labelTh: 'ไต้หวัน' },
  { value: 'AE', label: 'Emirati', labelTh: 'สหรัฐอาหรับเอมิเรตส์' },
  { value: 'GB', label: 'British', labelTh: 'สหราชอาณาจักร' },
  { value: 'US', label: 'American', labelTh: 'สหรัฐอเมริกา' },
  { value: 'VN', label: 'Vietnamese', labelTh: 'เวียดนาม' },
  { value: 'other', label: 'Other', labelTh: 'อื่น ๆ' },
] as const satisfies readonly Option[];
