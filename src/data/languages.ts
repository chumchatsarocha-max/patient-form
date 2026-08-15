/**
 * Preferred-language options. `value` is the ISO 639-1 code and is always exported as-is,
 * even though the displayed label follows the page language. Seed list, not exhaustive.
 */

export interface Option {
  value: string;
  label: string;
  labelTh: string;
}

export const LANGUAGES = [
  { value: 'th', label: 'Thai', labelTh: 'ไทย' },
  { value: 'en', label: 'English', labelTh: 'อังกฤษ' },
  { value: 'zh', label: 'Chinese (Mandarin)', labelTh: 'จีนกลาง' },
  { value: 'yue', label: 'Chinese (Cantonese)', labelTh: 'จีนกวางตุ้ง' },
  { value: 'ja', label: 'Japanese', labelTh: 'ญี่ปุ่น' },
  { value: 'ko', label: 'Korean', labelTh: 'เกาหลี' },
  { value: 'ms', label: 'Malay', labelTh: 'มลายู' },
  { value: 'id', label: 'Indonesian', labelTh: 'อินโดนีเซีย' },
  { value: 'vi', label: 'Vietnamese', labelTh: 'เวียดนาม' },
  { value: 'km', label: 'Khmer', labelTh: 'เขมร' },
  { value: 'lo', label: 'Lao', labelTh: 'ลาว' },
  { value: 'my', label: 'Burmese', labelTh: 'พม่า' },
  { value: 'hi', label: 'Hindi', labelTh: 'ฮินดี' },
  { value: 'ar', label: 'Arabic', labelTh: 'อาหรับ' },
  { value: 'fr', label: 'French', labelTh: 'ฝรั่งเศส' },
  { value: 'de', label: 'German', labelTh: 'เยอรมัน' },
  { value: 'es', label: 'Spanish', labelTh: 'สเปน' },
  { value: 'pt', label: 'Portuguese', labelTh: 'โปรตุเกส' },
  { value: 'ru', label: 'Russian', labelTh: 'รัสเซีย' },
  { value: 'other', label: 'Other', labelTh: 'อื่น ๆ' },
] as const satisfies readonly Option[];
