// Trading Rules & Warranty Regulations for each country (China, Thailand, Vietnam)
// Extracted from official PUBG SIAM posters (Thai & English versions)

export const countryRulesData = {
  th: {
    countryName: {
      th: '🇹🇭 บัญชีไทย (Thailand Account)',
      en: '🇹🇭 Thailand Account'
    },
    shortName: {
      th: 'ไทย',
      en: 'Thailand'
    },
    flag: '🇹🇭',
    badge: {
      th: 'ไอดีไทย • รับประกันมือ 1 แท้',
      en: 'Thailand Account • Hand 1 Guaranteed'
    },
    posterImg: {
      th: '/images/rules/rules-th-th.jpg',
      en: '/images/rules/rules-th-en.jpg'
    },
    bannerNotice: {
      th: 'มีใบรับประกันสำหรับมือ 1 ไปด้วย หรือมีคนรับประกันแทน',
      en: 'Warranty for original (hand 1) accounts or with a guarantor'
    },
    bannerType: 'info',
    rules: [
      {
        id: 1,
        icon: '👥🚫',
        title: {
          th: 'กรุณาอย่าให้ผู้อื่นยืมบัญชีของคุณ',
          en: 'Do not lend your account to others.'
        },
        desc: {
          th: 'ห้ามแชร์ไอดีหรือให้บุคคลอื่นล็อกอินเข้าใช้งานเด็ดขาด เพื่อป้องกันปัญหาการโจรกรรมหรือการถูกแบน',
          en: 'Strictly prohibited from sharing or letting others log into your account to prevent theft or unauthorized access.'
        }
      },
      {
        id: 2,
        icon: '🔄🤝',
        highlight: true,
        title: {
          th: 'การขายต่อบัญชี',
          en: 'Account Resale Policy'
        },
        desc: {
          th: 'ขายต่อได้ แต่ต้องแจ้งให้ทางร้านทราบถึงผู้ถือไอดีคนใหม่ และต้องมีการเก็บค่าบริการเพิ่ม 10% ถ้าจะให้อยู่ในประกันดังเดิม',
          en: 'Resale is allowed, but you must inform us about the new owner, and pay an additional 10% service fee to keep the warranty.'
        }
      },
      {
        id: 3,
        icon: '🎮🚫',
        title: {
          th: 'ห้ามใช้โปรแกรมช่วยเล่น หรือโปรแกรมเสริมทุกชนิด',
          en: 'Do not use any cheat programs or third-party tools.'
        },
        desc: {
          th: 'การใช้โปรแกรมโกง สคริปต์ หรือโปรแกรมแทรกแซงตัวเกมทุกรูปแบบจะทำให้สิ้นสุดการรับประกันทันที',
          en: 'Using hacks, cheats, scripts, or any unauthorized game modifications voids all warranty immediately.'
        }
      },
      {
        id: 4,
        icon: '🔒🛡️',
        title: {
          th: 'รักษาความปลอดภัยของบัญชี อย่ากดลิงก์ที่ไม่รู้จัก',
          en: 'Keep your account secure. Do not click unknown links.'
        },
        desc: {
          th: 'ระวังฟิชชิ่ง (Phishing) และอย่ากรอกข้อมูลล็อกอิน Steam ในเว็บไซต์ที่ไม่น่าเชื่อถือ',
          en: 'Beware of phishing scams and never enter your Steam credentials on suspicious or unverified websites.'
        }
      },
      {
        id: 5,
        icon: '🐧🚫',
        title: {
          th: 'ห้ามรับไฟล์หรือโปรแกรมที่ผู้อื่นส่งผ่าน QQ หรือ YY',
          en: 'Do not receive files or programs from others via QQ or YY.'
        },
        desc: {
          th: 'ห้ามดาวน์โหลดหรือเปิดไฟล์ที่ส่งมาจากบุคคลแปลกหน้าผ่านโปรแกรมแชทจีนเด็ดขาด',
          en: 'Never download, receive, or execute unknown files sent via communication apps like QQ or YY.'
        }
      },
      {
        id: 6,
        icon: '📱🔐',
        title: {
          th: 'ต้องผูกบัญชีกับหมายเลขโทรศัพท์ และเปิดใช้งาน Steam Mobile Authenticator',
          en: 'Bind your account with a phone number and enable Steam Mobile Authenticator.'
        },
        desc: {
          th: 'เปิดระบบความปลอดภัยสองชั้นผ่านแอป Steam บนมือถือทันทีเพื่อป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต',
          en: 'Activate Two-Factor Authentication via Steam Mobile App to ensure robust defense against unauthorized logins.'
        }
      },
      {
        id: 7,
        icon: '📋⚡',
        highlight: true,
        title: {
          th: 'สิ่งที่ต้องรีบทำทันทีหลังได้รับบัญชีและรหัสผ่าน:',
          en: 'Immediately after receiving account credentials, perform the following:'
        },
        checklist: [
          { th: 'ผูกเบอร์โทรศัพท์ของคุณ', en: 'Bind your phone number' },
          { th: 'เปิดใช้งาน Steam Mobile Authenticator', en: 'Enable Steam Mobile Authenticator' },
          { th: 'เปลี่ยนรหัสผ่าน Steam ทันที', en: 'Change your Steam password' }
        ]
      },
      {
        id: 8,
        icon: '💰🛡️',
        title: {
          th: 'หากบัญชีถูกเจ้าของเดิมกู้คืน ทางร้านชดเชยให้เต็มจำนวน',
          en: 'If your account is recovered by the original owner, we will compensate you in full.'
        },
        desc: {
          th: 'รับประกันความปลอดภัย 100% หากเกิดการดึงคืนจากเจ้าของเดิม ทางร้านคืนเงินตามจริงเต็มจำนวน',
          en: 'We guarantee 100% financial protection. Full actual purchase amount refund if pulled back by previous owner.'
        }
      },
      {
        id: 9,
        icon: '⚠️🚫',
        title: {
          th: 'กรุณาดูแลบัญชีให้ดี ไม่มีบริการหลังการขายในกรณีละเมิด',
          en: 'Please take good care of your account. No after-sales service in breach cases.'
        },
        desc: {
          th: 'หากบัญชีถูกขโมย, ถูกแบน, ถูกปล่อยเช่า หรือถูกนำไปหาผลประโยชน์เชิงพาณิชย์ จะสิ้นสุดบริการหลังการขายทันที',
          en: 'If the account is stolen, banned, rented, or used for commercial purposes, there will be no after-sales service.'
        }
      },
      {
        id: 10,
        icon: '🚩📱',
        title: {
          th: 'บัญชีที่มี "สัญญาณสีแดง" จำเป็นต้องผูกหมายเลขโทรศัพท์',
          en: 'Accounts with a "red flag" must be linked with a phone number.'
        },
        desc: {
          th: 'หากไม่ผูกเบอร์โทรศัพท์ตามเงื่อนไขแล้วเกิดปัญหาขึ้นภายหลัง ทางร้านจะไม่สามารถดูแลหลังการขายให้ได้',
          en: 'If phone number is not bound as instructed and issues arise, after-sales service will not be available.'
        }
      },
      {
        id: 11,
        icon: '🔍🚫',
        title: {
          th: 'ห้ามติดต่อเจ้าของบัญชีก่อนหน้าเด็ดขาด',
          en: 'Do not contact the previous owner under any circumstances.'
        },
        desc: {
          th: 'หากตรวจพบว่ามีการติดต่อเจ้าของบัญชีก่อนหน้า จะยุติการรับประกันและบริการหลังการขายทั้งหมดทันที',
          en: 'If we find any contact with the previous owner, all warranty and after-sales service will be terminated immediately.'
        }
      },
      {
        id: 12,
        icon: '🗑️👥',
        title: {
          th: 'หลังเข้าเกมแล้ว กรุณาลบเพื่อนทั้งหมด รวมถึงเพื่อนใน Steam',
          en: 'After entering the game, please remove all friends, including friends on Steam.'
        },
        desc: {
          th: 'ล้างรายชื่อเพื่อนในเกมและในบัญชี Steam ออกทั้งหมด เพื่อความเป็นส่วนตัวและป้องกันการติดตาม',
          en: 'Clear out all in-game friends and Steam friends list to secure account privacy and eliminate traceability.'
        }
      },
      {
        id: 13,
        icon: '🚷❌',
        title: {
          th: 'ข้อห้ามเกี่ยวกับการขายต่อส่วนตัวโดยไม่ได้รับอนุญาต',
          en: 'Strict prohibition on unauthorized private resale.'
        },
        desc: {
          th: 'บัญชีที่ขายไปแล้ว ห้ามขายต่อให้บุคคลอื่นโดยไม่ได้รับอนุญาต หากขายต่อเองจะไม่ได้รับการคุ้มครอง ห้ามเปลี่ยนอีเมลหรือเบอร์โทรศัพท์เอง มิฉะนั้นจะถือว่าเป็นการขายต่อส่วนตัวโดยอัตโนมัติ',
          en: 'Accounts that have been sold are strictly prohibited from reselling to others without permission. If resold privately, all protection is void. Do not change email/phone yourself or it counts as private resale.'
        }
      }
    ],
    itemVerification: {
      title: {
        th: 'หากตรวจพบว่าสินค้าในคลังบัญชีไม่ตรงกับตอนที่ขาย เช่น:',
        en: 'If items in your account do not match what was sold, such as:'
      },
      items: [
        { th: 'รองเท้าสีแดง (Red Shoes)', en: 'Red Shoes' },
        { th: 'กระโปรงสีขาว (White Skirt)', en: 'White Skirt' },
        { th: 'ผ้าคลุมหน้าสีแดง (Red Hood)', en: 'Red Hood' },
        { th: 'กางเกงเบอร์ลิน (Berlin Pants)', en: 'Berlin Pants' },
        { th: 'หน้ากากเบอร์ลิน (Berlin Mask)', en: 'Berlin Mask' },
        { th: 'และไอเทมอื่น ๆ ที่มีมูลค่าซื้อขาย', en: 'and other tradable valuable items' }
      ],
      warning: {
        th: 'หากไอเทมที่สามารถซื้อขายในตลาดถูกขายหรือถูกย่อย (แยกชิ้นส่วน) จะถูกหักมูลค่าตามราคาตลาดปัจจุบันจากราคารับซื้อคืน และไม่รับประกันความปลอดภัยของบัญชีในอนาคต',
        en: 'If tradable items are sold or dismantled, the value will be deducted based on the current market price, and no future account protection will be provided.'
      }
    },
    buybackPolicy: {
      percent: '60%',
      title: {
        th: 'รับซื้อคืนในราคา 60% ของราคาซื้อ',
        en: 'Receive 60% of the purchase price.'
      },
      period: {
        th: 'ระยะเวลาพักเงิน 7-15 วัน (ยกเว้นกรณีราคาตลาดมีความผันผวน)',
        en: 'Waiting period: 7-15 days (except in case of market fluctuations).'
      }
    },
    recoveryCompensation: {
      title: {
        th: 'หากบัญชีถูกกู้คืนโดยเจ้าของเดิม',
        en: 'If the account is recovered by original owner'
      },
      amount: {
        th: 'ชดเชยเงินจำนวนตามจำนวนจริงที่ซื้อไป (100%)',
        en: 'Compensate the actual purchase amount in full.'
      },
      deadline: {
        th: 'ต้องติดต่อ PUBG SIAM ภายใน 72 ชั่วโมง หลังเกิดเหตุ',
        en: 'Contact PUBG SIAM within 72 hours after the incident. Otherwise, no after-sales service.'
      }
    },
    footerNotes: [
      {
        icon: '🛡️',
        th: 'หากไม่ต้องการเล่นแล้ว สามารถติดต่อเราเพื่อรับซื้อคืนได้ รับประกันว่าข้อมูลอีเมลและเบอร์โทรศัพท์จะไม่ถูกเปลี่ยนแปลง และมีบริการหลังการขายตลอด',
        en: 'If you no longer wish to play, please contact us for a buyback option. We guarantee that your email and phone number will remain unchanged, and provide lifetime after-sales service.'
      },
      {
        icon: '⚠️',
        th: 'หากมีการขายต่อ เปลี่ยนแปลงข้อมูลบัญชี หรือปล่อยเช่า จะสิ้นสุดการรับประกันทันที',
        en: 'If the account is resold, modified without permission, or rented out, all warranty ends immediately.'
      }
    ]
  },

  cn: {
    countryName: {
      th: '🇨🇳 บัญชีจีน (China Account)',
      en: '🇨🇳 China Account'
    },
    shortName: {
      th: 'จีน',
      en: 'China'
    },
    flag: '🇨🇳',
    badge: {
      th: 'ไอดีจีน • สต็อกแท้จากสตูดิโอจีน',
      en: 'China Account • Official Studio Stock'
    },
    posterImg: {
      th: '/images/rules/rules-cn-th.jpg',
      en: '/images/rules/rules-cn-en.jpg'
    },
    bannerNotice: {
      th: 'กฎระเบียบ อ่านให้เข้าใจก่อนซื้อขาย ✅ บัญชีจีนสต็อกตรงจาก XueGaokk Studio',
      en: 'China Account Terms & Conditions — Please read and understand before buying or selling'
    },
    bannerType: 'warning',
    rules: [
      {
        id: 1,
        icon: '👥🚫',
        title: {
          th: 'กรุณาอย่าให้ผู้อื่นยืมบัญชีของคุณ',
          en: 'Do not lend your account to others.'
        },
        desc: {
          th: 'ห้ามแชร์ไอดีหรือให้คนอื่นเข้าใช้งานเด็ดขาด เพื่อป้องกันการถูกสแปมหรือนำไอดีไปใช้งานผิดกฎ',
          en: 'Strictly forbidden to share credentials or lend account to third parties.'
        }
      },
      {
        id: 2,
        icon: '🛒🚫',
        highlight: true,
        title: {
          th: 'กรุณาอย่าขายต่อบัญชี (ห้ามขายต่อเด็ดขาด)',
          en: 'Do not resell your account.'
        },
        desc: {
          th: 'บัญชีจีนมีระบบตรวจจับเจ้าของ ห้ามนำไปขายต่อให้ผู้อื่นเด็ดขาด หากขายต่อจะหลุดประกันทันที',
          en: 'China accounts have strict owner verification. Reselling will void all protection immediately.'
        }
      },
      {
        id: 3,
        icon: '🎮🚫',
        title: {
          th: 'ห้ามใช้โปรแกรมช่วยเล่น หรือโปรแกรมเสริมทุกชนิด',
          en: 'Do not use any cheat programs or third-party tools.'
        },
        desc: {
          th: 'ห้ามใช้โปรโกง สคริปต์มาโคร หรือม็อดที่อาจทำให้บัญชีโดน VAC หรือ Game Ban',
          en: 'Never use hacks, cheats, scripts, macros, or mods that could trigger VAC or Game Ban.'
        }
      },
      {
        id: 4,
        icon: '🔒🛡️',
        title: {
          th: 'รักษาความปลอดภัยของบัญชี อย่ากดลิงก์ที่ไม่รู้จัก',
          en: 'Keep your account secure. Do not click unknown links.'
        },
        desc: {
          th: 'ระวังเว็บไซต์ฟิชชิ่งปลอมแปลง อย่าล็อกอินผ่านลิงก์ที่มีคนส่งมาให้',
          en: 'Watch out for phishing links and never sign in through unsolicited external web links.'
        }
      },
      {
        id: 5,
        icon: '🐧🚫',
        title: {
          th: 'ห้ามรับไฟล์หรือโปรแกรมที่ผู้อื่นส่งผ่าน QQ หรือ YY',
          en: 'Do not receive files or programs from others via QQ or YY.'
        },
        desc: {
          th: 'ระวังมัลแวร์ขโมยไอดี ห้ามรับไฟล์หรือรันโปรแกรมจากชาวจีนผ่านแพลตฟอร์มแชท QQ หรือ YY',
          en: 'Prevent trojans & credential theft. Never accept files or execute programs from QQ or YY.'
        }
      },
      {
        id: 6,
        icon: '📱🔐',
        title: {
          th: 'ต้องผูกบัญชีกับหมายเลขโทรศัพท์ และเปิดใช้งาน Steam Mobile Authenticator',
          en: 'Bind your account with a phone number and enable Steam Mobile Authenticator.'
        },
        desc: {
          th: 'ผูกเบอร์โทรศัพท์ของคุณและเปิด 2FA ผ่านแอป Steam ทันทีเพื่อความปลอดภัยสูงสุด',
          en: 'Bind your personal mobile phone and activate Steam Mobile Authenticator immediately.'
        }
      },
      {
        id: 7,
        icon: '📋⚡',
        highlight: true,
        title: {
          th: 'หลังได้รับบัญชีและรหัสผ่านแล้ว ให้รีบ:',
          en: 'After receiving your account and password, please do the following:'
        },
        checklist: [
          { th: 'ผูกเบอร์โทรศัพท์ของคุณทันที', en: 'Bind your phone number' },
          { th: 'เปิดใช้งาน Steam Mobile Authenticator', en: 'Enable Steam Mobile Authenticator' },
          { th: 'เปลี่ยนรหัสผ่าน Steam ทันที', en: 'Change your Steam password' }
        ]
      },
      {
        id: 8,
        icon: '💰🛡️',
        title: {
          th: 'หากบัญชีถูกเจ้าของเดิมกู้คืน ทางร้านชดเชยให้เต็มจำนวน',
          en: 'If your account is recovered by the original owner, we will compensate you in full.'
        },
        desc: {
          th: 'หากเกิดเหตุเจ้าของเดิมดึงบัญชีคืน ทางร้านและสตูดิโอชดเชยเงินคืนตามจริงเต็มจำนวน',
          en: 'If the previous Chinese owner recovers the account, we provide full compensation of the actual amount paid.'
        }
      },
      {
        id: 9,
        icon: '⚠️🚫',
        title: {
          th: 'กรุณาดูแลบัญชีให้ดี ไม่มีบริการหลังการขายในกรณีละเมิด',
          en: 'Please take good care of your account. No after-sales service in breach cases.'
        },
        desc: {
          th: 'หากบัญชีถูกขโมย, ถูกแบน, ถูกปล่อยเช่า หรือถูกนำไปหาผลประโยชน์ จะไม่มีบริการหลังการขาย',
          en: 'If stolen, banned, rented out, or exploited commercially, there will be no after-sales service.'
        }
      },
      {
        id: 10,
        icon: '🇨🇳🚩',
        title: {
          th: 'บัญชีที่มี "สัญญาณสีแดง" จำเป็นต้องผูกหมายเลขโทรศัพท์',
          en: 'Accounts with a "red flag" must be linked with a phone number.'
        },
        desc: {
          th: 'หากไม่ผูกเบอร์โทรศัพท์แล้วเกิดปัญหา ทางร้านจะไม่สามารถเคลมหรือให้บริการหลังการขายได้',
          en: 'Red-flag tagged accounts require phone linking. If neglected and issues arise, no support is provided.'
        }
      },
      {
        id: 11,
        icon: '🔍🚫',
        title: {
          th: 'ห้ามติดต่อเจ้าของบัญชีก่อนหน้าเด็ดขาด',
          en: 'If we find any contact with the previous owner, warranty is terminated.'
        },
        desc: {
          th: 'หากตรวจพบว่ามีการแอบติดต่อเจ้าของบัญชีก่อนหน้า จะยุติการรับประกันและบริการหลังการขายทั้งหมดทันที',
          en: 'Any direct or indirect contact with former owners will terminate all warranty and customer service instantly.'
        }
      },
      {
        id: 12,
        icon: '🗑️👥',
        title: {
          th: 'หลังเข้าเกมแล้ว กรุณาลบเพื่อนทั้งหมด รวมถึงเพื่อนใน Steam',
          en: 'After entering the game, please remove all friends, including friends on Steam.'
        },
        desc: {
          th: 'ลบรายชื่อเพื่อนในเกม PUBG และในแอป Steam ออกทั้งหมดเพื่อตัดการติดตามโดยสมบูรณ์',
          en: 'Delete all contacts and friend lists on both PUBG and Steam platform.'
        }
      },
      {
        id: 13,
        icon: '🚷❌',
        title: {
          th: 'บัญชีที่ขายไปแล้ว ห้ามขายต่อให้บุคคลอื่นโดยไม่ได้รับอนุญาต',
          en: 'Sold accounts are strictly prohibited from reselling to others.'
        },
        desc: {
          th: 'หากขายต่อเอง จะไม่ได้รับการคุ้มครองกรณีถูกกู้คืนบัญชี ห้ามเปลี่ยนอีเมลหรือเบอร์โทรศัพท์เองเด็ดขาด',
          en: 'If you resell on your own, you lose all recovery protection. Do not modify email or phone number independently.'
        }
      }
    ],
    itemVerification: {
      title: {
        th: 'หากตรวจพบว่าสินค้าในคลังบัญชีไม่ตรงกับตอนที่ขาย เช่น:',
        en: 'If items in your account do not match what was sold, such as:'
      },
      items: [
        { th: 'รองเท้าสีแดง (Red Shoes)', en: 'Red Shoes' },
        { th: 'กระโปรงสีขาว (White Skirt)', en: 'White Skirt' },
        { th: 'ผ้าคลุมหน้าสีแดง (Red Hood)', en: 'Red Hood' },
        { th: 'กางเกงเบอร์ลิน (Berlin Pants)', en: 'Berlin Pants' },
        { th: 'หน้ากากเบอร์ลิน (Berlin Mask)', en: 'Berlin Mask' },
        { th: 'และไอเทมอื่น ๆ ที่สามารถซื้อขายได้', en: 'and other tradable items' }
      ],
      warning: {
        th: 'หากไอเทมที่สามารถซื้อขายในตลาดถูกขาย หรือถูกย่อย (แยกชิ้นส่วน) จะถูกหักมูลค่าตามราคาตลาดปัจจุบันจากราคารับซื้อคืน และไม่รับประกันความปลอดภัยของบัญชีในอนาคต',
        en: 'If tradable items are sold or dismantled, the value will be deducted based on the current market price, and no future account protection will be provided.'
      }
    },
    buybackPolicy: {
      percent: '60%',
      title: {
        th: 'รับซื้อคืนในราคา 60% ของราคาซื้อ',
        en: 'Receive 60% of the purchase price.'
      },
      period: {
        th: 'ระยะเวลาพักเงิน 7-15 วัน (ยกเว้นกรณีราคาตลาดผันผวน)',
        en: 'Waiting period: 7-15 days (except in case of market fluctuations).'
      }
    },
    recoveryCompensation: {
      title: {
        th: 'หากบัญชีถูกกู้คืน โดยเจ้าของเดิม',
        en: 'If the account is recovered by the original owner'
      },
      amount: {
        th: 'จะชดเชยเงินจำนวนตามจำนวนจริงที่ซื้อไป (100%)',
        en: 'We will compensate the actual purchase amount in full.'
      },
      deadline: {
        th: 'ต้องติดต่อ XueGaokk Studio ภายใน 72 ชั่วโมง หลังเกิดเหตุ',
        en: 'Contact XueGaokk Studio within 72 hours after the incident. Otherwise, no after-sales service.'
      }
    },
    footerNotes: [
      {
        icon: '🛡️',
        th: 'หากไม่ต้องการเล่นแล้ว สามารถติดต่อเราเพื่อรับซื้อคืนได้ รับประกันข้อมูลอีเมลและเบอร์โทรศัพท์ และมีบริการหลังการขายตลอด',
        en: 'Do not resell or rent the account. If you no longer wish to play, please contact us for a buyback option. We guarantee that your email and phone number will remain unchanged, and provide lifetime after-sales service.'
      },
      {
        icon: '🔫',
        th: 'ระหว่างเล่น พยายามอย่าแยกชิ้นส่วน (ย่อย) อาวุธ แม้จะเป็นอาวุธเลเวล 1 และเลิกเล่นแล้วไม่ควรแยกชิ้นส่วน เพราะอาวุธจากการสุ่มหาได้ยาก บางชิ้นเป็นไอเทมหายากหรือเลิกแจกแล้ว',
        en: 'During gameplay, avoid dismantling weapons even if Lv.1. Once disassembled, valuable legacy skins cannot be recovered and reduce buyback valuation.'
      }
    ]
  },

  vn: {
    countryName: {
      th: '🇻🇳 บัญชีเวียดนาม (Vietnam Account)',
      en: '🇻🇳 Vietnam Account'
    },
    shortName: {
      th: 'เวียดนาม',
      en: 'Vietnam'
    },
    flag: '🇻🇳',
    badge: {
      th: 'ไอดีเวียดนาม • ปลอดภัย มีประกันมือ 1',
      en: 'Vietnam Account • 1st Hand Owner Warranty'
    },
    posterImg: {
      th: '/images/rules/rules-vn-th.jpg',
      en: '/images/rules/rules-vn-en.jpg'
    },
    bannerNotice: {
      th: 'ลูกค้าสามารถขอเมลแรกที่สมัครไอดีได้ แต่ประกันทั้งหมดจะถูกยกเลิกทันที',
      en: 'You can request the first registered email, but all warranty will be void immediately.'
    },
    bannerType: 'danger',
    rules: [
      {
        id: 1,
        icon: '👥🚫',
        title: {
          th: 'กรุณาอย่าให้ผู้อื่นยืมบัญชีของคุณ',
          en: 'Do not lend your account to others.'
        },
        desc: {
          th: 'ห้ามให้คนอื่นยืมบัญชีไปเล่นเด็ดขาด เพื่อป้องกันการทำผิดกฎเกมหรือการถูกสแปม',
          en: 'Lending or sharing credentials with others is strictly forbidden.'
        }
      },
      {
        id: 2,
        icon: '🔄🤝',
        highlight: true,
        title: {
          th: 'การขายต่อบัญชี',
          en: 'Account Resale Policy'
        },
        desc: {
          th: 'ขายต่อได้ แต่ต้องแจ้งให้ทางร้านทราบถึงผู้ถือไอดีคนใหม่ และต้องมีการเก็บค่าบริการเพิ่ม 10% ถ้าจะให้อยู่ในประกันดังเดิม',
          en: 'Resale is allowed, but you must inform us about the new owner, and pay an additional 10% service fee to keep the warranty.'
        }
      },
      {
        id: 3,
        icon: '🎮🚫',
        title: {
          th: 'ห้ามใช้โปรแกรมช่วยเล่น หรือโปรแกรมเสริมทุกชนิด',
          en: 'Do not use any cheat programs or third-party tools.'
        },
        desc: {
          th: 'ห้ามใช้ซอฟต์แวร์ช่วยเล่น โปรแกรมโกง หรือปลั๊กอินไม่ได้รับอนุญาตทุกประเภท',
          en: 'Strict prohibition on cheat engines, botting tools, aimbots, or third-party modifications.'
        }
      },
      {
        id: 4,
        icon: '🔒🛡️',
        title: {
          th: 'รักษาความปลอดภัยของบัญชี อย่ากดลิงก์ที่ไม่รู้จัก',
          en: 'Keep your account secure. Do not click unknown links.'
        },
        desc: {
          th: 'อย่าคลิกลิงก์แปลกปลอม หรือเว็บหลอกเอาข้อมูล Steam Guard',
          en: 'Maintain high security awareness; never open unverified hyperlinks or untrusted webpages.'
        }
      },
      {
        id: 5,
        icon: '🐧🚫',
        title: {
          th: 'ห้ามรับไฟล์หรือโปรแกรมที่ผู้อื่นส่งผ่าน QQ หรือ YY',
          en: 'Do not receive files or programs from others via QQ or YY.'
        },
        desc: {
          th: 'ห้ามรับไฟล์หรือโปรแกรมจากผู้อื่นผ่านแอปพลิเคชันภายนอกเพื่อป้องกันไวรัสและสปายแวร์',
          en: 'Reject any executable packages or compressed files transferred via third-party chat software.'
        }
      },
      {
        id: 6,
        icon: '📱🔐',
        title: {
          th: 'ต้องผูกบัญชีกับหมายเลขโทรศัพท์ และเปิดใช้งาน Steam Mobile Authenticator',
          en: 'Bind your account with a phone number and enable Steam Mobile Authenticator.'
        },
        desc: {
          th: 'ผูกเบอร์มือถือและตั้งค่า Steam Guard บนสมาร์ตโฟนทันทีหลังได้รับมอบไอดี',
          en: 'Tie your mobile device and turn on Steam Mobile Authenticator right after account transfer.'
        }
      },
      {
        id: 7,
        icon: '📋⚡',
        highlight: true,
        title: {
          th: 'หลังได้รับบัญชีและรหัสผ่านแล้ว ให้รีบ:',
          en: 'After receiving your account and password, please do the following:'
        },
        checklist: [
          { th: 'ผูกเบอร์โทรศัพท์ของคุณ', en: 'Bind your phone number' },
          { th: 'เปิดใช้งาน Steam Mobile Authenticator', en: 'Enable Steam Mobile Authenticator' },
          { th: 'เปลี่ยนรหัสผ่าน Steam ทันที', en: 'Change your Steam password' }
        ]
      },
      {
        id: 8,
        icon: '💰🛡️',
        title: {
          th: 'หากบัญชีถูกเจ้าของเดิมกู้คืน ทางร้านชดเชยให้เต็มจำนวน',
          en: 'If your account is recovered by the original owner, we will compensate you in full.'
        },
        desc: {
          th: 'คุ้มครองเต็ม 100% หากเกิดการดึงคืนโดยเจ้าของเดิม ทางร้านคืนเงินตามจริงเต็มจำนวน',
          en: 'Guaranteed 100% reimbursement of actual purchase payment if retrieved by the original owner.'
        }
      },
      {
        id: 9,
        icon: '⚠️🚫',
        title: {
          th: 'กรุณาดูแลบัญชีให้ดี ไม่มีบริการหลังการขายในกรณีละเมิด',
          en: 'Please take good care of your account. No after-sales service in breach cases.'
        },
        desc: {
          th: 'หากบัญชีถูกขโมย, ถูกแบน, ถูกปล่อยเช่า หรือถูกนำไปหาผลประโยชน์ จะไม่มีบริการหลังการขาย',
          en: 'If the account is compromised, banned, rented out, or exploited, after-sales service is forfeited.'
        }
      },
      {
        id: 10,
        icon: '🇻🇳🚩',
        title: {
          th: 'บัญชีที่มี "สัญญาณสีแดง" จำเป็นต้องผูกหมายเลขโทรศัพท์',
          en: 'Accounts with a "red flag" must be linked with a phone number.'
        },
        desc: {
          th: 'หากไม่ผูกเบอร์โทรศัพท์แล้วเกิดปัญหาขึ้นภายหลัง จะไม่มีบริการหลังการขาย',
          en: 'Accounts marked with red flag require active phone binding. Failure to comply voids post-sale support.'
        }
      },
      {
        id: 11,
        icon: '🔍🚫',
        title: {
          th: 'ห้ามติดต่อเจ้าของบัญชีก่อนหน้าเด็ดขาด',
          en: 'If we find any contact with the previous owner, warranty is terminated.'
        },
        desc: {
          th: 'หากตรวจพบว่ามีการติดต่อเจ้าของบัญชีก่อนหน้า จะยุติการรับประกันและบริการหลังการขายทั้งหมด',
          en: 'Connecting with the previous account holder leads to instant termination of warranty and support.'
        }
      },
      {
        id: 12,
        icon: '🗑️👥',
        title: {
          th: 'หลังเข้าเกมแล้ว กรุณาลบเพื่อนทั้งหมด รวมถึงเพื่อนใน Steam',
          en: 'After entering the game, please remove all friends, including friends on Steam.'
        },
        desc: {
          th: 'ล้างเพื่อนเดิมในเกมและเพื่อนใน Steam ออกทั้งหมดเพื่อตัดความเกี่ยวพันกับประวัติเดิม',
          en: 'Purge all pre-existing friends both on PUBG client and Steam friends roster.'
        }
      },
      {
        id: 13,
        icon: '🚷❌',
        title: {
          th: 'บัญชีที่ขายไปแล้ว ห้ามขายต่อให้บุคคลอื่นโดยไม่ได้รับอนุญาต',
          en: 'Accounts that have been sold are strictly prohibited from reselling to others.'
        },
        desc: {
          th: 'หากขายต่อเอง จะไม่ได้รับการคุ้มครองกรณีถูกกู้คืนบัญชี ห้ามเปลี่ยนอีเมลหรือเบอร์โทรศัพท์เอง มิฉะนั้นจะถือว่าเป็นการขายต่อส่วนตัวโดยอัตโนมัติ',
          en: 'Reselling without notification strips all protections. Changing email or phone without guidance will be classified as private resale.'
        }
      }
    ],
    itemVerification: {
      title: {
        th: 'หากตรวจพบว่าสินค้าในคลังบัญชีไม่ตรงกับตอนที่ขาย เช่น:',
        en: 'If items in your account do not match what was sold, such as:'
      },
      items: [
        { th: 'รองเท้าสีแดง (Red Shoes)', en: 'Red Shoes' },
        { th: 'กระโปรงสีขาว (White Skirt)', en: 'White Skirt' },
        { th: 'ผ้าคลุมหน้าสีแดง (Red Hood)', en: 'Red Hood' },
        { th: 'กางเกงเบอร์ลิน (Berlin Pants)', en: 'Berlin Pants' },
        { th: 'หน้ากากเบอร์ลิน (Berlin Mask)', en: 'Berlin Mask' },
        { th: 'และไอเทมอื่น ๆ ในคลัง', en: 'and other tradable items' }
      ],
      warning: {
        th: 'หากไอเทมที่สามารถซื้อขายในตลาดถูกขายหรือถูกย่อย (แยกชิ้นส่วน) จะถูกหักมูลค่าตามราคาตลาดปัจจุบันจากราคารับซื้อคืน และไม่รับประกันความปลอดภัยของบัญชีในอนาคต',
        en: 'If tradable items are sold or dismantled, the value will be deducted based on the current market price, and no future warranty will be provided.'
      }
    },
    buybackPolicy: {
      percent: '60%',
      title: {
        th: 'รับซื้อคืนในราคา 60% ของราคาซื้อ',
        en: 'Receive 60% of the purchase price.'
      },
      period: {
        th: 'ระยะเวลาพักเงิน 7-15 วัน (ยกเว้นกรณีราคาตลาดมีความผันผวน)',
        en: 'Waiting period: 7-15 days (except in case of market fluctuations).'
      }
    },
    recoveryCompensation: {
      title: {
        th: 'หากบัญชีถูกกู้คืน โดยเจ้าของเดิม',
        en: 'If the account is recovered by the original owner'
      },
      amount: {
        th: 'จะชดเชยเงินจำนวนตามจำนวนจริงที่ซื้อไป (100%)',
        en: 'We will compensate the actual purchase amount in full.'
      },
      deadline: {
        th: 'ต้องติดต่อ PUBG SIAM ภายใน 72 ชั่วโมง หลังเกิดเหตุ',
        en: 'Contact PUBG SIAM within 72 hours after the incident. Otherwise, no after-sales service.'
      }
    },
    footerNotes: [
      {
        icon: '🛡️',
        th: 'หากไม่ต้องการเล่นแล้ว สามารถติดต่อเราเพื่อรับซื้อคืนได้ รับประกันข้อมูลอีเมลและเบอร์โทรศัพท์ และมีบริการหลังการขายตลอด',
        en: 'If you no longer play, feel free to contact us for a buyback option. We guarantee that your email and phone number will remain unchanged, and provide lifetime after-sales service.'
      },
      {
        icon: '⚠️',
        th: 'หากมีการขายต่อ เปลี่ยนแปลงข้อมูลบัญชี หรือปล่อยเช่า จะสิ้นสุดการรับประกันทันที ระหว่างเล่น พยายามอย่าแยกชิ้นส่วน (ย่อย) อาวุธ เพื่อรักษามูลค่าของบัญชีในอนาคต',
        en: 'Reselling, changing credentials or renting terminates warranty immediately. Please avoid dismantling weapons to preserve account valuation for future buyback.'
      }
    ]
  }
};
