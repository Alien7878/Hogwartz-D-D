
import { Character, Spell } from './types';

export const SPELLS: Record<string, Spell> = {
  EXPELLIARMUS: { name: 'اکسپلیارموس', description: 'خلع سلاح کردن حریف. شانس موفقیت بالا.', manaCost: 10, baseDamage: 15, type: 'Attack' },
  EXPECTO_PATRONUM: { name: 'اکسپکتو پاترونوم', description: 'دفع تاریکی و تجدید قوای روحی. بنیه را ترمیم می‌کند.', manaCost: 25, baseDamage: -20, type: 'Defend' },
  STUPEFY: { name: 'استیوپفای', description: 'بیهوش کردن هدف برای یک دور.', manaCost: 15, baseDamage: 10, type: 'Attack' },
  AVADA_KEDAVRA: { name: 'آوادا کداورا', description: 'طلسم مرگبار. صدمه جبران‌ناپذیر.', manaCost: 80, baseDamage: 100, type: 'Curse' },
  CRUCIO: { name: 'کروشیو', description: 'ایجاد درد طاقت‌فرسا.', manaCost: 40, baseDamage: 45, type: 'Curse' },
  ALOHOMORA: { name: 'آلوهومورا', description: 'باز کردن قفل‌های جادویی.', manaCost: 5, baseDamage: 0, type: 'Utility' },
  SECTUMSEMPRA: { name: 'سکتوم سمپرا', description: 'ایجاد جراحات عمیق روی بدن.', manaCost: 30, baseDamage: 40, type: 'Attack' },
  PROTEGO: { name: 'پروتگو', description: 'ایجاد سپر دفاعی جادویی.', manaCost: 10, baseDamage: 0, type: 'Defend' },
  RIDDIKULUS: { name: 'ریدی‌کولوس', description: 'تبدیل ترس به خنده. کاهش قدرت حمله حریف.', manaCost: 12, baseDamage: 5, type: 'Utility' },
  PETRIFICUS_TOTALUS: { name: 'پتریفیکوس توتالوس', description: 'قفل کردن کامل بدن هدف.', manaCost: 20, baseDamage: 10, type: 'Attack' },
  INCENDIO: { name: 'اینسندیو', description: 'ایجاد شعله‌های آتش جادویی.', manaCost: 25, baseDamage: 30, type: 'Attack' },
  MORSMORDRE: { name: 'مورس‌موردره', description: 'احضار علامت شوم در آسمان. ترساندن دشمنان.', manaCost: 50, baseDamage: 20, type: 'Curse' },
  WINGARDIUM_LEVIOSA: { name: 'وینگاردیوم لوی‌اوُسا', description: 'به پرواز درآوردن اشیاء برای دفاع یا حمله.', manaCost: 8, baseDamage: 12, type: 'Utility' },
  DIFFINDO: { name: 'دیفیندو', description: 'طلسم شکافنده برای بریدن اشیاء یا موانع.', manaCost: 15, baseDamage: 18, type: 'Attack' },
  CONFRINGO: { name: 'کانفرینگو', description: 'طلسم انفجاری مهیب.', manaCost: 35, baseDamage: 45, type: 'Attack' },
  LEGILIMENS: { name: 'لگیلیمنس', description: 'نفوذ به ذهن حریف و کشف اسرار.', manaCost: 30, baseDamage: 15, type: 'Utility' },
};

export const CHARACTERS: Character[] = [
  {
    id: 'harry',
    name: 'هری پاتر',
    title: 'پسری که زنده ماند',
    house: 'Gryffindor',
    stats: { stamina: 100, mana: 80, wisdom: 12, luck: 20 },
    spells: [SPELLS.EXPELLIARMUS, SPELLS.EXPECTO_PATRONUM, SPELLS.STUPEFY],
    imageUrl: 'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'hermione',
    name: 'هرماینی گرنجر',
    title: 'باهوش‌ترین ساحره قرن',
    house: 'Gryffindor',
    stats: { stamina: 85, mana: 130, wisdom: 25, luck: 12 },
    spells: [SPELLS.ALOHOMORA, SPELLS.PROTEGO, SPELLS.WINGARDIUM_LEVIOSA],
    imageUrl: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'ron',
    name: 'رون ویزلی',
    title: 'وفادارترین دوست',
    house: 'Gryffindor',
    stats: { stamina: 110, mana: 70, wisdom: 10, luck: 15 },
    spells: [SPELLS.STUPEFY, SPELLS.EXPELLIARMUS, SPELLS.RIDDIKULUS],
    imageUrl: 'https://images.unsplash.com/photo-1590272456521-1bbe160a18ce?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'dumbledore',
    name: 'آلبوس دامبلدور',
    title: 'مدیر بزرگ هاگوارتز',
    house: 'Gryffindor',
    stats: { stamina: 200, mana: 400, wisdom: 40, luck: 25 },
    spells: [SPELLS.EXPECTO_PATRONUM, SPELLS.CONFRINGO, SPELLS.LEGILIMENS],
    imageUrl: 'https://images.unsplash.com/photo-1513375835630-9467f5817f7d?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'voldemort',
    name: 'لرد ولدمورت',
    title: 'او که نامش را نباید برد',
    house: 'Slytherin',
    isBoss: true,
    stats: { stamina: 350, mana: 550, wisdom: 35, luck: 5 },
    spells: [SPELLS.AVADA_KEDAVRA, SPELLS.CRUCIO, SPELLS.MORSMORDRE],
    imageUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'snape',
    name: 'سوروس اسنیپ',
    title: 'شاهزاده دورگه',
    house: 'Slytherin',
    stats: { stamina: 120, mana: 180, wisdom: 30, luck: 8 },
    spells: [SPELLS.SECTUMSEMPRA, SPELLS.LEGILIMENS, SPELLS.PROTEGO],
    imageUrl: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'malfoy',
    name: 'دراکو مالفوی',
    title: 'جانشین خاندان مالفوی',
    house: 'Slytherin',
    stats: { stamina: 95, mana: 100, wisdom: 15, luck: 14 },
    spells: [SPELLS.PETRIFICUS_TOTALUS, SPELLS.EXPELLIARMUS, SPELLS.CRUCIO],
    imageUrl: 'https://images.unsplash.com/photo-1582233479366-6d38bc390a08?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'luna',
    name: 'لونا لاوگود',
    title: 'ساحره‌ای با دید متفاوت',
    house: 'Ravenclaw',
    stats: { stamina: 75, mana: 110, wisdom: 22, luck: 30 },
    spells: [SPELLS.RIDDIKULUS, SPELLS.STUPEFY, SPELLS.PROTEGO],
    imageUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'bellatrix',
    name: 'بلاتریکس لسترنج',
    title: 'وفادارترین مرگ‌خوار',
    house: 'Slytherin',
    stats: { stamina: 140, mana: 220, wisdom: 18, luck: 6 },
    spells: [SPELLS.CRUCIO, SPELLS.AVADA_KEDAVRA, SPELLS.INCENDIO],
    imageUrl: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'sirius',
    name: 'سیریوس بلک',
    title: 'پانقی',
    house: 'Gryffindor',
    stats: { stamina: 130, mana: 140, wisdom: 20, luck: 18 },
    spells: [SPELLS.CONFRINGO, SPELLS.STUPEFY, SPELLS.EXPELLIARMUS],
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'mcgonagall',
    name: 'مینروا مک‌گونگال',
    title: 'معاون ارشد هاگوارتز',
    house: 'Gryffindor',
    stats: { stamina: 150, mana: 280, wisdom: 35, luck: 10 },
    spells: [SPELLS.DIFFINDO, SPELLS.PROTEGO, SPELLS.STUPEFY],
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'hagrid',
    name: 'روبئوس هاگرید',
    title: 'شکاربان و کلیددار هاگوارتز',
    house: 'Neutral',
    stats: { stamina: 300, mana: 40, wisdom: 8, luck: 12 },
    spells: [SPELLS.INCENDIO, SPELLS.DIFFINDO, SPELLS.WINGARDIUM_LEVIOSA],
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'neville',
    name: 'نویل لانگ‌باتم',
    title: 'قهرمان گمنام',
    house: 'Gryffindor',
    stats: { stamina: 120, mana: 90, wisdom: 14, luck: 22 },
    spells: [SPELLS.PETRIFICUS_TOTALUS, SPELLS.STUPEFY, SPELLS.EXPELLIARMUS],
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 'ginny',
    name: 'جینی ویزلی',
    title: 'ساحره‌ای با اراده فولادین',
    house: 'Gryffindor',
    stats: { stamina: 90, mana: 110, wisdom: 16, luck: 18 },
    spells: [SPELLS.CONFRINGO, SPELLS.STUPEFY, SPELLS.EXPELLIARMUS],
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&h=300&auto=format&fit=crop'
  }
];

export const INITIAL_NARRATIVE = "زمزمه‌های پیشگویی از بازگشت کسی خبر می‌دهند که نامش لرزه بر اندام می‌اندازد. سایه‌ها در جنگل ممنوعه به هم می‌پیوندند. شما در مقابل دروازه‌های هاگوارتز ایستاده‌اید. انتخاب‌های امروز شما، سرنوشت دنیای جادوگری را رقم خواهد زد.";
