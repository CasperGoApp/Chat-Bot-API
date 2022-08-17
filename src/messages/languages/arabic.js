module.exports = {
  // export module
  keywords: {
    // keywords
    wallet: [
      // wallet identified by keywords
      'محفظة',
      'محافظ',
      'رصيد',
      'أرصدة',
      'حساب',
      'حسابات',
      'المحفظة',
      'المحافظ',
      'الرصيد',
      'الأرصدة',
      'الحساب',
      'الحسابات',
    ],
    deposit: [
      // deposit identified by keywords
      'الإيداع',
      'الاستلام',
      'العنوان',
      'العناوين',
      'إيداع',
      'تلقي',
      'عنوان',
      'عناوين',
    ],
    send: ['إرسال', 'أرسل'], // send identified by keywords
    settings: [
      // settings identified by keywords
      'الإعدادات',
      'الإعداد',
      'الحساب',
      'الحسابات',
      'النظام',
      'إعدادات',
      'إعدادات',
      'حساب',
      'حسابات',
      'نظام',
    ],
    menu: [
      // menu identified by keywords
      'القائمة',
      'المساعدة',
      'الخيارات',
      'كيف',
      'الأوامر',
      'قائمة',
      'مساعدة',
      'خيارات',
      'كيف',
      'أوامر',
    ],
    support: [
      // support identified by keywords
      'دعم',
      'زبون',
      'خدمة',
      'مساعدة',
      'الدعم',
      'العملاء',
      'الخدمة',
      'المساعدة',
    ],
    block: ['حظر', 'إنهاء', 'إزالة', 'إيقاف', 'منع', 'إنهاء', 'إزالة', 'إيقاف'], // block identified by keywords
    stay: ['البقاء', 'بقي'], // stay identified by keywords
    price: ['السعر', 'الأسعار', 'الصرف', 'الأسعار', 'سعر'], // price identified by keywords
    staking: ['ماسك', 'المساومة'], // staking identified by keywords
    lottery: ['اليانصيب', 'يانصيب'], // lottery identified by keywords
    share: ['مشاركة', 'رابط', 'إحالة'], // share identified by keywords
    vault: ['قبو', 'خزائن'], // vault identified by keywords
    history: ['تاريخ', 'تقرير'], // history identified by keywords
    nft: ['nft', 'nfts', 'مقتنيات', 'مقتنيات'], // nft identified by keywords
    //  earning: ['earning']
  },
  all: 'all', // all
  onboard: {
    // onboard
    type: 'template', // type
    name: 'go_onboard', // name
    content: '✋ تم تسجيلك. لتهيئة الإعدادات المتقدمة ، انقر هنا: {{1}}', // content
  },
  block: {
    // block
    // content message
    content:
      '❌ حظر الحساب \n يسعدنا حظر رقم هاتفك ولن نرسل لك أي رسائل أخرى وسنقوم *خلال الدقائق الخمس التالية *. \n إذا أرسلت هذا عن طريق الخطأ أو كنت ترغب في إعادة تمكين الخدمة على في أي وقت ، الرجاء الرد البقاء.', // content message
  },
  deposit: {
    // deposit
    // content message
    content:
      '💸 كيفية الإيداع في DiviGo \n ```{{1}}``` \n الخيارات: \n قم بالرد بالعملة المعدنية للحصول على عنوان الإيداع ورمز الاستجابة السريعة.', // content message
  },
  daily: {
    // daily
    type: 'template', // type
    name: 'go_transxer', // name
    content:
      '🤑 لقد تلقيت تحويلاً من {{1}} بمبلغ {{2}}. الرصيد الجديد هو {{3}}', // content message
  },
  deposited: {
    // deposited
    type: 'template', // type
    name: 'go_deposit', // name
    content: '🤑 لقد تلقيت إيداعًا بمبلغ {{1}}. \n الرصيد الجديد هو {{2}}', // content message
  },
  balanceChange: {
    // balance change
    content: '🤑 تم تحديث رصيدك في {{1}} للتو من blockchain.', // content message
  },
  prices: { content: '💱 *أسعار الصرف (أسعار السوق) *\n```{{1}}```' }, // prices
  settings: {
    // settings
    // content message
    content:
      '✋ لتهيئة الإعدادات المتقدمة ، انقر هنا: https://comm.v2.divigo.tech/start/{{1}}', // content message
  },
  history: {
    // history
    // content message
    content:
      '📊 محفوظات الحساب \n تم حفظ جميع تفاصيل معاملاتك على سلاسل الكتل وقمنا بعمل نسخة احتياطية لك لتنزيلها بتنسيق Excel بما في ذلك سعر الصرف في الوقت الذي تلقيت فيه الأموال أو أرسلتها. \n الرجاء النقر هنا لفتح حسابك السجل: https://comm.v2.divigo.tech/history/{{1}}', // content message
  },
  menu: {
    // menu
    // content message
    content:
      '❓ أوامر المساعدة \n ستمنحك هذه الأوامر المكونة من كلمة واحدة وصولاً سريعًا إلى الأصول الخاصة بك! \n ```❓ التعليمات: سرد قائمة الأوامر هذه \n🤷‍♂️ الدعم: الإبلاغ عن مشكلة \n\n👝 المحفظة: قم بإدراج كل ما لدي عملات \n💸 إيداع: الحصول على معلومات الإيداع \n💰 إرسال: بدء إرسال العملية \n📱 شحن الرصيد: شحن الهواتف المحمولة \n📁 الأصول: سرد جميع NFTs \n📊 المحفوظات: تفاصيل سجل المعاملات \n📈 الأرباح: أداء الحساب \n💱 السعر: أسعار الصرف الحالية \n☁️ الخزانة: إدارة مخزن (قبو) التخزين المؤقت \n\n🪙 ماسك: كيف يعمل ماسك \n💵 قبو: كيف يعمل اليانصيب \n🎁 شارك: شارك DiviGo واكسب \n❌ حظر: حظر حسابي``` \n\n ستسمح لك هذه الأوامر السريعة بتنفيذ إجراءات معقدة. \n أرسل 5 divi إلى divigo \n أرسل 5 usd إلى DiviGo', // content message
  },
  support: {
    // support
    // content message
    content:
      '🤷‍♂️ طلب الدعم  n نتطلع إلى تلقي رد منك ، وعادة ما نرد على جميع الطلبات في غضون 24 ساعة. الرجاء النقر هنا للإبلاغ عن مشكلتك بمزيد من التفاصيل: https://comm.v2.divigo.tech/help/{{1}}', // content message
  },
  staking: {
    // staking
    // content message
    content:
      '🪙 DiviGo هي محفظة حصة مُدارة. هذا يعني أن جميع الأموال الموجودة في المجمع يتم تخزينها على مدار الساعة طوال أيام الأسبوع. \n لا يتعين على المستخدمين التحقق من محفظتهم أو التأكد من إمكانية وصولهم إلى إنترنت مستقر. \n عندما يربح العنوان حصة في المجموعة ، فإن هذه المكاسب يتم تقسيمها بين جميع المستخدمين في التجمع ، بما يتناسب مع مقدار DIVI الذي يمتلكونه. \n لمزيد من المعلومات حول الحصة على DiviGo ، قم بزيارة www.divigo.tech/#faq \n', // content message
  },
  lottery: {
    // lottery
    // content message
    content:
      '💵 يتم إجراء يانصيب Divi مرة واحدة في الأسبوع ، حيث تفوز 10 عناوين بـ 25.200DIVI لكل منها ، وفاز عنوان واحد بالجائزة الكبرى البالغة 252.000DIVI. \n تعد مجموعة الأسهم طريقة رائعة للمحفظة الصغيرة للمشاركة بفعالية في اليانصيب. \n إذا كان المجمع المكاسب ، يتم تقسيم هذه الأموال بين جميع المستخدمين في التجمع. \n لمزيد من المعلومات حول اليانصيب والحصة ، قم بزيارة www.divigo.tech#faq.', // content message
  },
  share: {
    // share
    // content message
    content:
      '🎁 شارك DiviGo واكسب! \n من فضلك انسخ والصق الرابط التالي ، أو انقر على زر المشاركة', // content message
  },
  shareMessage: {
    // share message
    // content message
    content:
      'مرحبًا بك في DiviGo - مدير محفظة الجوال\n*{{1}}*يود أن يوصي DiviGo ، مدير محفظة الهاتف المحمول. إذا كنت مهتمًا بتجربة DiviGo ، فيرجى التأكيد عن طريق فتح الرابط التالي والبدء اليوم! https: //comm.v2.divigo.tech/{{2}}', // content message
  },
  nft: {
    // nft
    // content message
    content:
      '🎁 التجميع والإنشاء والتنظيم \n الرد باستخدام التصفح أو الإنشاء أو التملك', // content message
  },
  published: {
    // published
    // content message
    content:
      '💰 لقد أرسلت للتو *{{1}} *مع معرف المعاملة: {{2}} \n قد تستغرق معاملات Blockchain وقتًا أطول لتظهر في عنوان الوجهة.', // content message
  },
  noSendYourself: { content: '⚠️ نحن آسفون ، لا يمكنك الإرسال إلى *نفسك *.' }, // no send yourself
  noSendSystem: {
    // no send system
    content: '⚠️ معذرةً ، لا يمكنك الإرسال إلى *عناوين النظام *.', // content message
  },
  sendFromAccount: {
    // send from account
    content: '❓ من فضلك قل لنا أي عملة تريد أن ترسل من؟', // content message
  },
  sendFromAmount: {
    // send from amount
    content: '❓ من فضلك قل لنا كم تريد أن ترسل؟', // content message
  },
  sendFromDestination: {
    // send from destination
    content: '❓ من فضلك قل لنا لمن تريد أن ترسل؟', // content message
  },
  sendFromHelp: {
    // send from help
    // content message
    content:
      '❓ للإرسال ، يرجى تضمين المبلغ والعملة والوجهة في رسالة واحدة. \n على سبيل المثال ، أرسل 10 DIVI encke \n أو \n أرسل encke 10 USD DIVI \n أو \n أرسل encke ALL DIVI', // content message
  },
  errorSend: { content: '❓ يبدو أن هناك مشكلة في إرسال: {{1}}.' }, // error send
  sendConfirm: { content: 'الرجاء التأكيد لإرسال {{1}}' }, // send confirm
  sendFromErrorDestination: {
    // send from error destination
    // content message
    content:
      '❓ يبدو أن *{{1}} *غير مسجل في نظامنا ولا يمكننا العثور على مكان الإرسال.', // content message
  },
  sendFromErrorBalance: {
    // send from error balance
    content: '⚠️ ليس لديك رصيد كافٍ لإرسال *{{1}} *.', // content message
  },
  sendMoneyConfirmed: {
    // send money confirmed
    // content message
    content:
      '🤑 *مرحبًا {{1}} ، *لقد أرسلت للتو تحويلاً إلى {{2}} بمبلغ {{3}}. رصيدك الجديد هو {{4}}.', // content message
  },
  sendMoneyReceived: {
    // send money received
    type: 'template', // type
    name: 'go_transfer', // name
    content:
      '🤑 *مرحبًا {{1}} ، *لقد تلقيت للتو تحويل {{2}}. رصيدك الجديد هو {{3}}.', // content message
  },
  sendFailed: { content: '⚠️ فشل الإرسال.' }, // send failed
  stay: {
    // stay
    // content message
    content:
      'تم إلغاء حظر حسابك ويمكنك استخدامه كالمعتاد! \n مرحبًا بك مرة أخرى في DiviGo!', // content message
  },
  update: {
    // update
    type: 'template', // type
    name: 'go_onboard', // name
    content:
      '✋ تم تحديث إعداداتك. لتهيئة الإعدادات المتقدمة ، انقر هنا: {{1}}', // content message
  },
  vaultAmount: {
    // vault amount
    content: '❓ من فضلك أخبرنا كم ترغب في إضافته إلى مخزن التخزين المؤقت؟', // content message
  },
  vaultNotAvailable: {
    // vault not available
    content: '⚠️ هذه الميزة غير متوفرة في حسابك.', // content message
  },
  vaultError: {
    // vault error
    content: '❓ يبدو أن هناك مشكلة في قبو: {{1}}.', // content message
  },
  vaultConfirm: {
    // vault confirm
    // content message
    content:
      'الرجاء تأكيد قبو {{1}} ودفع رسوم التخزين لهذا الشهر {{2}} بالنقر على هذا الرابط: {{3}}', // content message
  },
  vaultNoFunds: {
    // vault no funds
    content: '⚠️ ليس لديك رصيد كافي لتخزين *{{1}} *.', // content message
  },
  wallets: { content: '👝 المحفظة {{1}} لـ {{2}}\n  ```{{3}}```' }, // wallets
}
