/** en is a literal; th is typed as Dict, so TypeScript errors if a translation key is missing. */

export type Lang = 'en' | 'th';

export const LANGS: readonly Lang[] = ['en', 'th'];

const en = {
  common: {
    /** Always bilingual, so someone who can't read the current language can still find the switcher. */
    languageGroup: 'Language / ภาษา',
    home: 'Home',
    signOut: 'Sign out',
    notProvided: 'Not provided',
  },

  meta: {
    home: 'Realtime patient registration',
    patient: 'Patient intake',
    staff: 'Front desk — live intake',
    login: 'Staff sign-in',
    description:
      'Demo intake form with a realtime staff view. Not a real medical records system — do not enter real patient data.',
  },

  home: {
    place: 'Outpatient clinic',
    desk: 'Reception',
    heading: 'Register',
    lead: 'The Intelligent Patient Registration & Documentation System registers and records patient information the moment it’s entered, syncing instantly with staff in real time.',
    patient: 'I’m a patient',
    staff: 'I’m front desk staff',
    foot: 'Demo only. The patient and front desk screens are synced live. Please don’t enter real patient information.',
    photoAlt: 'A clinician in a white coat and stethoscope writing on a clipboard.',
  },

  patient: {
    banner:
      'Demo only. Please don’t enter real patient information. Everything you type is sent live to whoever holds the front desk link for this session, and there is no sign-in protecting it.',
    session: (id: string) => `session ${id}`,
  },

  form: {
    progressLabel: 'Form progress',
    steps: { personal: 'Personal', contact: 'Contact', review: 'Review' },

    step1Title: 'Personal information',
    step1Lead: 'Tell us who you are. Fields marked * are required.',
    step2Title: 'Contact and preferences',
    step2Lead: 'How we reach you, and how you prefer to be cared for.',
    step3Title: 'Review your details',
    step3Lead: 'Check everything is right. You can’t edit after submitting.',

    emergencyHeading: 'Emergency contact',
    emergencyNote: '— optional, but fill all three if you fill one',

    submitWarning: 'Submitting sends these details to the front desk straight away.',
    edit: 'Edit',
    back: '‹ Back',
    next: 'Next ›',
    submit: 'Submit details',

    doneTitle: 'Details submitted',
    doneLead: 'The front desk can see your information. Please take a seat.',
    startOver: 'Start another intake',

    connected: 'Connected — the front desk sees your answers as you type.',
    connecting: 'Connecting to the front desk…',

    openCalendar: 'Open calendar',
    pickDate: 'Choose a date',
    month: 'Month',
    year: 'Year',

    placeholder: {
      firstName: 'Somchai',
      lastName: 'Prasert',
      optional: 'Optional',
      email: 'your_email@example.com',
      address: 'Street, district, city, postcode',
      phone: '081-234-5678',
      select: 'Select',
    },
  },

  staff: {
    eyebrow: 'Staff view',
    title: 'Front desk — live intake',
    banner:
      'Sessions appear here while a patient has the form open — nothing is stored, so closing their tab removes the session from this list.',
    sessionBanner:
      'Opened from a direct link to one session. Anyone with this link can read what the patient types — there is no sign-in.',

    emptyTitle: 'No one is filling in a form right now',
    emptyLead:
      'Open the patient link on another device and start an intake — the session shows up here within a few seconds.',
    connectingTitle: 'Connecting…',
    connectingLead: 'Waiting for the realtime connection to come up.',

    openSessions: 'Open sessions',
    unnamed: 'Unnamed session',

    stepDone: (total: number) => `Completed all ${total} steps`,
    stepStopped: (step: number, total: number) => `Stopped on step ${step} of ${total}`,
    stepOn: (step: number, total: number) => `On step ${step} of ${total}`,

    requiredProgress: 'Required fields completed',
    requiredCount: (filled: number, total: number) =>
      `${filled} of ${total} required fields`,

    waiting: 'Waiting for input',
    traceIdle: 'No fields touched yet',
    lastUpdate: (elapsed: string) => `Last update ${elapsed}`,
    live: 'Live connection',
    reconnecting: 'Reconnecting…',

    status: {
      submitted: 'Submitted · form locked',
      filling: 'Filling in',
      fillingField: (label: string) => `Filling in · ${label.toLowerCase()}`,
      inactive: (elapsed: string) => `Inactive · no input for ${elapsed}`,
      connected: 'Connected · hasn’t started typing',
      disconnected: 'Disconnected · patient closed the page',
    },

    /** Short form for list cards — narrower than the status pill on the detail page. */
    statusShort: {
      submitted: 'submitted',
      filling: 'filling in',
      inactive: 'inactive',
      connected: 'connected',
      disconnected: 'disconnected',
    },
  },

  login: {
    eyebrow: 'Staff view',
    title: 'Staff sign-in',
    username: 'Username',
    password: 'Password',
    submit: 'Sign in to front desk',
    failed: 'That username or password doesn’t match. Check the demo details below and try again.',
    demo: (user: string, pass: string) => `Demo sign-in — use ${user} / ${pass}`,
    demoNote:
      'This only keeps the staff screen off the front page. It is not real security: the realtime channel itself is still open, so it protects the page, not the data.',
  },

  time: {
    none: '—',
    justNow: 'just now',
    seconds: (n: number) => `${n}s ago`,
    minutes: (n: number) => `${n}m ago`,
    hours: (n: number) => `${n}h ago`,
    /** No trailing "ago" — for sentences that already read as past tense. */
    barePlain: (elapsed: string) => elapsed.replace(' ago', ''),
  },

  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  /** Interpolated mid-sentence in English error messages — keep these lowercase. */
  errorLabel: {
    firstName: 'first name',
    middleName: 'middle name',
    lastName: 'last name',
    religion: 'religion',
    emergencyContactName: 'emergency contact name',
  },

  /** Every message must say how to fix the problem, not just that it's wrong. */
  error: {
    required: (label: string) => `Enter your ${label}.`,
    tooLong: (max: number, label: string) =>
      `Use ${max} characters or fewer for ${label}.`,
    tooLongOwn: (max: number, label: string) =>
      `Use ${max} characters or fewer for your ${label}.`,
    onlyNumbers: (label: string) => `Your ${label} can't be only numbers.`,

    dobFormat: 'Enter your date of birth as YYYY-MM-DD.',
    dobFuture: 'Date of birth must be today or earlier.',
    dobTooOld: (years: number) => `Check the year — this is over ${years} years ago.`,

    gender: 'Choose one of the options, including “Prefer not to say”.',

    phoneRequired: 'Enter a phone number we can reach you on.',
    phoneFormat:
      'Enter a Thai number like 081 234 5678, or an international number starting with + and its country code.',

    emailRequired: 'Enter your email address.',
    emailFormat: 'Include an @ and a domain, like name@example.com.',

    addressShort: 'Enter your full address — at least 5 characters.',
    addressLong: (max: number) => `Use ${max} characters or fewer for your address.`,

    language: 'Choose a language from the list.',
    nationality: 'Choose a nationality from the list.',
    relationship: 'Choose a relationship from the list.',

    needRelationship: 'Tell us how this person is related to you.',
    needContactName: 'Add the name of your emergency contact.',
    needContactPhone: 'Add a phone number we can call in an emergency.',
  },
};

export type Dict = typeof en;

const th: Dict = {
  common: {
    languageGroup: 'Language / ภาษา',
    home: 'หน้าแรก',
    signOut: 'ออกจากระบบ',
    notProvided: 'ไม่ได้กรอก',
  },

  meta: {
    home: 'ลงทะเบียนผู้ป่วยแบบเรียลไทม์',
    patient: 'แบบฟอร์มลงทะเบียนผู้ป่วย',
    staff: 'หน้าเจ้าหน้าที่ — ดูการกรอกสด',
    login: 'เข้าสู่ระบบสำหรับเจ้าหน้าที่',
    description:
      'ตัวอย่างแบบฟอร์มลงทะเบียนผู้ป่วยที่เจ้าหน้าที่เห็นแบบเรียลไทม์ ไม่ใช่ระบบเวชระเบียนจริง กรุณาอย่ากรอกข้อมูลจริง',
  },

  home: {
    place: 'แผนกผู้ป่วยนอก',
    desk: 'จุดลงทะเบียน',
    heading: 'ลงทะเบียน',
    lead: 'ระบบลงทะเบียนและบันทึกประวัติผู้ป่วยอัจฉริยะ บันทึกข้อมูลผู้ป่วยทันทีที่กรอก พร้อมส่งข้อมูลถึงเจ้าหน้าที่แบบเรียลไทม์',
    patient: 'สำหรับผู้ป่วย',
    staff: 'สำหรับเจ้าหน้าที่',
    foot: 'หน้านี้เป็นตัวอย่างสาธิต หน้าผู้ป่วยกับหน้าเจ้าหน้าที่เชื่อมกันแบบเรียลไทม์ กรุณาอย่ากรอกข้อมูลจริง',
    photoAlt: 'เจ้าหน้าที่ทางการแพทย์ในเสื้อกาวน์สีขาว คล้องหูฟังแพทย์ กำลังเขียนบนคลิปบอร์ด',
  },

  patient: {
    banner:
      'หน้านี้เป็นตัวอย่างสาธิต กรุณาอย่ากรอกข้อมูลจริง ทุกอย่างที่คุณพิมพ์จะถูกส่งสดไปยังใครก็ตามที่ถือลิงก์ฝั่งเจ้าหน้าที่ของ session นี้ และไม่มีระบบล็อกอินป้องกันไว้',
    session: (id: string) => `session ${id}`,
  },

  form: {
    progressLabel: 'ความคืบหน้าของแบบฟอร์ม',
    steps: { personal: 'ข้อมูลส่วนตัว', contact: 'ติดต่อ', review: 'ตรวจทาน' },

    step1Title: 'ข้อมูลส่วนตัว',
    step1Lead: 'บอกเราหน่อยว่าคุณคือใคร ช่องที่มี * ต้องกรอก',
    step2Title: 'ข้อมูลติดต่อและความต้องการ',
    step2Lead: 'เราจะติดต่อคุณได้ทางไหน และคุณสะดวกให้ดูแลแบบไหน',
    step3Title: 'ตรวจทานข้อมูล',
    step3Lead: 'ตรวจดูว่าถูกต้องครบถ้วน ส่งแล้วจะแก้ไขไม่ได้',

    emergencyHeading: 'ผู้ติดต่อกรณีฉุกเฉิน',
    emergencyNote: '— ไม่บังคับ แต่ถ้ากรอกช่องหนึ่งแล้วต้องกรอกให้ครบทั้งสามช่อง',

    submitWarning: 'เมื่อกดส่ง ข้อมูลจะไปถึงเจ้าหน้าที่ที่เคาน์เตอร์ทันที',
    edit: 'แก้ไข',
    back: '‹ ย้อนกลับ',
    next: 'ถัดไป ›',
    submit: 'ส่งข้อมูล',

    doneTitle: 'ส่งข้อมูลเรียบร้อย',
    doneLead: 'เจ้าหน้าที่เห็นข้อมูลของคุณแล้ว เชิญนั่งรอเรียกคิวได้เลย',
    startOver: 'กรอกใหม่อีกครั้ง',

    connected: 'เชื่อมต่อแล้ว — เจ้าหน้าที่เห็นคำตอบของคุณทันทีที่พิมพ์',
    connecting: 'กำลังเชื่อมต่อกับเคาน์เตอร์…',

    openCalendar: 'เปิดปฏิทิน',
    pickDate: 'เลือกวันที่',
    month: 'เดือน',
    year: 'ปี',

    placeholder: {
      firstName: 'สมชาย',
      lastName: 'ประเสริฐ',
      optional: 'ไม่บังคับ',
      email: 'your_email@example.com',
      address: 'บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์',
      phone: '081-234-5678',
      select: 'เลือก',
    },
  },

  staff: {
    eyebrow: 'หน้าเจ้าหน้าที่',
    title: 'เคาน์เตอร์ — ดูการกรอกสด',
    banner:
      'session จะขึ้นที่นี่ระหว่างที่ผู้ป่วยเปิดแบบฟอร์มอยู่ ระบบไม่ได้เก็บข้อมูลไว้ ถ้าผู้ป่วยปิดแท็บ session ก็จะหายไปจากรายการ',
    sessionBanner:
      'เปิดจากลิงก์ตรงของ session เดียว ใครก็ตามที่มีลิงก์นี้อ่านสิ่งที่ผู้ป่วยพิมพ์ได้ทั้งหมด และไม่มีระบบล็อกอินกั้นไว้',

    emptyTitle: 'ตอนนี้ยังไม่มีใครกรอกแบบฟอร์มอยู่',
    emptyLead:
      'ลองเปิดลิงก์ฝั่งผู้ป่วยบนอีกเครื่องแล้วเริ่มกรอก — session จะขึ้นที่นี่ภายในไม่กี่วินาที',
    connectingTitle: 'กำลังเชื่อมต่อ…',
    connectingLead: 'รอให้การเชื่อมต่อแบบเรียลไทม์พร้อมใช้งาน',

    openSessions: 'session ที่เปิดอยู่',
    unnamed: 'ยังไม่ระบุชื่อ',

    stepDone: (total: number) => `กรอกครบทั้ง ${total} ขั้นแล้ว`,
    stepStopped: (step: number, total: number) => `หยุดอยู่ที่ขั้นที่ ${step} จาก ${total}`,
    stepOn: (step: number, total: number) => `อยู่ที่ขั้นที่ ${step} จาก ${total}`,

    requiredProgress: 'ความคืบหน้าของช่องที่ต้องกรอก',
    requiredCount: (filled: number, total: number) =>
      `กรอกแล้ว ${filled} จาก ${total} ช่องที่ต้องกรอก`,

    waiting: 'รอการกรอก',
    traceIdle: 'ยังไม่ได้แตะช่องไหนเลย',
    lastUpdate: (elapsed: string) => `อัปเดตล่าสุด ${elapsed}`,
    live: 'เชื่อมต่ออยู่',
    reconnecting: 'กำลังเชื่อมต่อใหม่…',

    status: {
      submitted: 'ส่งแล้ว · ฟอร์มถูกล็อก',
      filling: 'กำลังกรอก',
      fillingField: (label: string) => `กำลังกรอก · ${label}`,
      inactive: (elapsed: string) => `หยุดนิ่ง · ไม่มีการกรอกมา ${elapsed}`,
      connected: 'เชื่อมต่อแล้ว · ยังไม่เริ่มพิมพ์',
      disconnected: 'หลุดการเชื่อมต่อ · ผู้ป่วยปิดหน้าไปแล้ว',
    },

    statusShort: {
      submitted: 'ส่งแล้ว',
      filling: 'กำลังกรอก',
      inactive: 'หยุดนิ่ง',
      connected: 'เชื่อมต่อแล้ว',
      disconnected: 'หลุดการเชื่อมต่อ',
    },
  },

  login: {
    eyebrow: 'หน้าเจ้าหน้าที่',
    title: 'เข้าสู่ระบบสำหรับเจ้าหน้าที่',
    username: 'ชื่อผู้ใช้',
    password: 'รหัสผ่าน',
    submit: 'เข้าสู่ระบบ',
    failed: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง ดูข้อมูลสำหรับทดลองด้านล่างแล้วลองใหม่อีกครั้ง',
    demo: (user: string, pass: string) => `บัญชีสำหรับทดลอง — ใช้ ${user} / ${pass}`,
    demoNote:
      'ตัวนี้แค่กันไม่ให้หน้าเจ้าหน้าที่โผล่อยู่หน้าแรกเท่านั้น ไม่ใช่ระบบความปลอดภัยจริง เพราะช่องทางเรียลไทม์ยังเปิดอยู่ — มันกันที่ตัวหน้าเว็บ ไม่ได้กันที่ตัวข้อมูล',
  },

  time: {
    none: '—',
    justNow: 'เมื่อครู่นี้',
    seconds: (n: number) => `${n} วินาทีที่แล้ว`,
    minutes: (n: number) => `${n} นาทีที่แล้ว`,
    hours: (n: number) => `${n} ชั่วโมงที่แล้ว`,
    barePlain: (elapsed: string) => elapsed.replace('ที่แล้ว', '').trim(),
  },

  months: [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ],

  errorLabel: {
    firstName: 'ชื่อจริง',
    middleName: 'ชื่อกลาง',
    lastName: 'นามสกุล',
    religion: 'ศาสนา',
    emergencyContactName: 'ชื่อผู้ติดต่อฉุกเฉิน',
  },

  error: {
    required: (label: string) => `กรุณากรอก${label}`,
    tooLong: (max: number, label: string) => `${label}ต้องยาวไม่เกิน ${max} ตัวอักษร`,
    tooLongOwn: (max: number, label: string) => `${label}ต้องยาวไม่เกิน ${max} ตัวอักษร`,
    onlyNumbers: (label: string) => `${label}ต้องไม่ใช่ตัวเลขล้วน`,

    dobFormat: 'กรอกวันเกิดในรูปแบบ ปปปป-ดด-วว',
    dobFuture: 'วันเกิดต้องเป็นวันนี้หรือก่อนหน้านี้',
    dobTooOld: (years: number) => `ลองตรวจปีอีกครั้ง — ย้อนไปเกิน ${years} ปีแล้ว`,

    gender: 'เลือกหนึ่งตัวเลือก รวมถึง “ไม่ระบุ” ก็ได้',

    phoneRequired: 'กรอกเบอร์โทรที่ติดต่อคุณได้',
    phoneFormat:
      'กรอกเบอร์ในไทยเช่น 081 234 5678 หรือเบอร์ต่างประเทศที่ขึ้นต้นด้วย + ตามด้วยรหัสประเทศ',

    emailRequired: 'กรอกอีเมลของคุณ',
    emailFormat: 'ต้องมี @ และชื่อโดเมน เช่น name@example.com',

    addressShort: 'กรอกที่อยู่ให้ครบ — อย่างน้อย 5 ตัวอักษร',
    addressLong: (max: number) => `ที่อยู่ต้องยาวไม่เกิน ${max} ตัวอักษร`,

    language: 'เลือกภาษาจากรายการ',
    nationality: 'เลือกสัญชาติจากรายการ',
    relationship: 'เลือกความสัมพันธ์จากรายการ',

    needRelationship: 'ระบุด้วยว่าคนนี้เกี่ยวข้องกับคุณอย่างไร',
    needContactName: 'กรอกชื่อผู้ติดต่อกรณีฉุกเฉินด้วย',
    needContactPhone: 'กรอกเบอร์ที่โทรหาได้ตอนฉุกเฉินด้วย',
  },
};

export const DICT: Record<Lang, Dict> = { en, th };

/** For validating an untrusted value (cookie/header) against the known langs. */
export function toLang(value: string | undefined | null): Lang | null {
  return value === 'en' || value === 'th' ? value : null;
}
