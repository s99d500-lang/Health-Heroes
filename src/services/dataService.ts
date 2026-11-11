import type {
  Student,
  Question,
  Attempt,
  StudentMessage,
  SiteSettings,
  GradeNumber,
  TeacherAnalytics,
} from '../types/index.ts';

// Default initial settings
export const DEFAULT_SETTINGS: SiteSettings = {
  welcomeTitle: 'صحتكِ كنز.. فاحفظيها بالوعي',
  welcomeSubtitle: 'كل اختيار صحي اليوم، يصنع حياة أجمل غدًا',
  welcomeQuotes: [
    'صحتكِ كنز.. فاحفظيها بالوعي',
    'كل اختيار صحي اليوم، يصنع حياة أجمل غدًا',
    'كوني بطلة الوعي الصحي، وانشري المعرفة والوقاية بين أسرتكِ ومجتمعكِ',
    'أهلًا بكِ يا بطلة الصحة!',
  ],
  videoPath: '/assets/aistudio/VID-20261110-WA0092_76b55817.mp4',
  videoTitle: 'المقطع التوعوي الرسمي: اليوم العالمي للسكري ١٤ نوفمبر',
  videoDescription:
    'رسالة توعوية ملهمة وشاملة لطالبات المرحلة الابتدائية وأولياء الأمور والمعلمين، توضح أعراض السكري وأهمية الحركة والغذاء الصحي والفحص المبكر.',
  videoThumbnail: '',
  videoRequired: false,
  logoUrl: '',
  mascotVisible: true,
  schoolName: 'المدرسة الابتدائية ٣١١',
  teacherName: 'أ. خلود الحريصي',
};

// Default question bank (ensures 100% offline and fallback capability)
export const DEFAULT_QUESTIONS: Question[] = [
  // Station 1: محققة الصحة
  {
    id: 'q1-1',
    stationId: 1,
    questionText: 'ما العضو الذي ينتج الإنسولين في جسم الإنسان؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'القلب' },
      { id: 'b', text: 'البنكرياس' },
      { id: 'c', text: 'الرئة' },
      { id: 'd', text: 'المعدة' },
    ],
    correctAnswer: 'b',
    explanation: 'البنكرياس هو العضو المسؤول عن إنتاج هرمون الإنسولين في الجسم.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'q1-2',
    stationId: 1,
    questionText: 'ما الوظيفة الأساسية لهرمون الإنسولين؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'يساعد خلايا الجسم على استخدام الجلوكوز (السكر) لإنتاج الطاقة' },
      { id: 'b', text: 'يقوم بهضم الطعام مباشرة في المعدة' },
      { id: 'c', text: 'يقوي العظام بشكل فوري' },
      { id: 'd', text: 'ينظم حركة التنفس' },
    ],
    correctAnswer: 'a',
    explanation: 'يساعد الإنسولين خلايا الجسم على امتصاص واستخدام الجلوكوز للحصول على الطاقة.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'medium',
    version: 1,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'q1-3',
    stationId: 1,
    questionText: 'هل يوجد نوع واحد فقط من مرض السكري؟',
    questionType: 'true_false',
    options: [
      { id: 'a', text: 'نعم' },
      { id: 'b', text: 'لا' },
    ],
    correctAnswer: 'b',
    explanation: 'يوجد أكثر من نوع، وأشهرهما النوع الأول والنوع الثاني، ولكل منهما أسبابه.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'q1-4',
    stationId: 1,
    questionText: 'هل الإصابة بالنوع الأول تحدث بسبب تناول الحلويات؟',
    questionType: 'true_false',
    options: [
      { id: 'a', text: 'نعم' },
      { id: 'b', text: 'لا' },
    ],
    correctAnswer: 'b',
    explanation: 'النوع الأول حالة مناعية ولا ينتج عن تناول الحلويات.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'medium',
    version: 1,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'q1-5',
    stationId: 1,
    questionText: 'هل يمكن أن يساعد النشاط البدني في تقليل عوامل خطر النوع الثاني؟',
    questionType: 'true_false',
    options: [
      { id: 'a', text: 'نعم' },
      { id: 'b', text: 'لا' },
    ],
    correctAnswer: 'a',
    explanation: 'النشاط البدني ونمط الحياة الصحي يقللان من عوامل الخطر للنوع الثاني.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 'q1-6',
    stationId: 1,
    questionText: 'ماذا نفعل عند الشعور بأعراض صحية مقلقة؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'نتجاهلها' },
      { id: 'b', text: 'نشخص أنفسنا' },
      { id: 'c', text: 'نخبر ولي الأمر ونراجع المختص الصحي' },
      { id: 'd', text: 'نستخدم دواء شخص آخر' },
    ],
    correctAnswer: 'c',
    explanation: 'المختص الصحي هو المسؤول عن التقييم والتشخيص المناسب.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 6,
  },

  // Station 2: مصممة الطبق الصحي
  {
    id: 'q2-1',
    stationId: 2,
    questionText: 'أي الأطعمة التالية من الخضراوات؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'الخيار' },
      { id: 'b', text: 'البيض' },
      { id: 'c', text: 'الحليب' },
      { id: 'd', text: 'الخبز' },
    ],
    correctAnswer: 'a',
    explanation: 'الخيار من الخضراوات الغنية بالماء والألياف.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'q2-2',
    stationId: 2,
    questionText: 'أي مما يلي مصدر للبروتين؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'التفاح' },
      { id: 'b', text: 'البيض' },
      { id: 'c', text: 'الماء' },
      { id: 'd', text: 'الخيار' },
    ],
    correctAnswer: 'b',
    explanation: 'البيض من المصادر الممتازة للبروتين الصحي الذي يبني الأنسجة.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'q2-3',
    stationId: 2,
    questionText: 'ما المشروب المناسب للاهتمام بترطيب الجسم؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'الماء' },
      { id: 'b', text: 'المشروب الغازي' },
      { id: 'c', text: 'مشروب الطاقة' },
      { id: 'd', text: 'الشراب المحلى' },
    ],
    correctAnswer: 'a',
    explanation: 'الماء النقي هو المشروب الأساسي والأفضل لترطيب الجسم دائماً.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'q2-4',
    stationId: 2,
    questionText: 'لماذا ننوع الأطعمة التي نتناولها؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'للحصول على عناصر غذائية متنوعة' },
      { id: 'b', text: 'لتناول صنف واحد فقط' },
      { id: 'c', text: 'لإلغاء الخضراوات' },
      { id: 'd', text: 'لتجنب شرب الماء' },
    ],
    correctAnswer: 'a',
    explanation: 'التنوع يمنح الجسم الفيتامينات والمعادن الضرورية للنمو السليم.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'q2-5',
    stationId: 2,
    questionText: 'أي وجبة تبدو أكثر تنوعًا؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'أرز فقط' },
      { id: 'b', text: 'حلوى فقط' },
      { id: 'c', text: 'خضراوات وبروتين وحبوب وماء' },
      { id: 'd', text: 'مشروب محلى فقط' },
    ],
    correctAnswer: 'c',
    explanation: 'الوجبة المتوازنة تجمع بين الخضار والبروتين والحبوب والماء.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'medium',
    version: 1,
    isActive: true,
    sortOrder: 5,
  },

  // Station 3: سفيرة الكشف المبكر
  {
    id: 'q3-1',
    stationId: 3,
    questionText: 'شعرت زميلتك بعطش شديد ومتكرر، ماذا تفعل؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'تتجاهل الأمر' },
      { id: 'b', text: 'تخبر ولي أمرها وتراجع المختص' },
      { id: 'c', text: 'تأخذ دواء من صديقتها' },
    ],
    correctAnswer: 'b',
    explanation: 'إبلاغ ولي الأمر واستشارة الطبيب هو التصرف الآمن والسليم.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'q3-2',
    stationId: 3,
    questionText: 'هل يمكن تشخيص السكري بمجرد النظر إلى الشخص؟',
    questionType: 'true_false',
    options: [
      { id: 'a', text: 'نعم' },
      { id: 'b', text: 'لا' },
    ],
    correctAnswer: 'b',
    explanation: 'التشخيص يتطلب فحوصات مخبرية معتمدة من الفريق الطبي.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'q3-3',
    stationId: 3,
    questionText: 'من يفسر نتائج الفحوصات الطبية؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'الطبيب أو المختص' },
      { id: 'b', text: 'الصديقة' },
      { id: 'c', text: 'الطالبة وحدها' },
    ],
    correctAnswer: 'a',
    explanation: 'الطبيب أو المختص الصحي هو المؤهل علمياً لتفسير النتائج.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'q3-4',
    stationId: 3,
    questionText: 'لماذا نهتم بالفحوصات المناسبة؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'للاطمئنان وتقييم الصحة' },
      { id: 'b', text: 'للحصول على درجات' },
      { id: 'c', text: 'لمجرد التسلية' },
    ],
    correctAnswer: 'a',
    explanation: 'الفحوصات تتيح الاطمئنان والكشف المبكر وتقديم الرعاية في الوقت المناسب.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'q3-5',
    stationId: 3,
    questionText: 'ماذا نفعل إذا سمعنا معلومة صحية غير موثوقة؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'ننشرها' },
      { id: 'b', text: 'نتحقق من مصدر رسمي موثوق' },
      { id: 'c', text: 'نصدقها مباشرة' },
    ],
    correctAnswer: 'b',
    explanation: 'التحقق من وزارة الصحة والمصادر الرسمية هو النهج الواعي.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 'q3-6',
    stationId: 3,
    questionText: 'هل يحتاج المصاب بالسكري إلى متابعة حالته مع الفريق الطبي؟',
    questionType: 'true_false',
    options: [
      { id: 'a', text: 'نعم' },
      { id: 'b', text: 'لا' },
    ],
    correctAnswer: 'a',
    explanation: 'المتابعة الطبية المنتظمة تمكن المصاب من عيش حياة طبيعية ونشطة ومطمئنة.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 6,
  },

  // Station 4: بطلة النشاط
  {
    id: 'q4-1',
    stationId: 4,
    questionText: 'أي مما يلي نشاط بدني؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'المشي' },
      { id: 'b', text: 'مشاهدة التلفاز' },
      { id: 'c', text: 'الجلوس' },
      { id: 'd', text: 'النوم' },
    ],
    correctAnswer: 'a',
    explanation: 'المشي واللعب الحركي ينشطان الدورة الدموية ويقويان الجسم.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'q4-2',
    stationId: 4,
    questionText: 'ما التصرف المناسب قبل اللعب؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'اختيار مكان آمن' },
      { id: 'b', text: 'اللعب في الطريق' },
      { id: 'c', text: 'تجاهل السلامة' },
    ],
    correctAnswer: 'a',
    explanation: 'المكان الآمن والحذاء المناسب يضمنان ممارسة النشاط بلا إصابات.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'q4-3',
    stationId: 4,
    questionText: 'أيهما يساعد على تقليل الخمول؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'الحركة' },
      { id: 'b', text: 'الجلوس طوال اليوم' },
      { id: 'c', text: 'ترك اللعب' },
    ],
    correctAnswer: 'a',
    explanation: 'الحركة والقيام بتمارين خفيفة يقللان الخمول والكسل.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'q4-4',
    stationId: 4,
    questionText: 'ماذا تفعلين إذا شعرت بالتعب أثناء النشاط؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'تستمرين رغم التعب' },
      { id: 'b', text: 'تتوقفين وتخبرين المسؤول عنك' },
      { id: 'c', text: 'تتجاهلين التعب' },
    ],
    correctAnswer: 'b',
    explanation: 'أخذ قسط من الراحة عند التعب يحمي سلامتكِ.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'q4-5',
    stationId: 4,
    questionText: 'أي نشاط يمكن ممارسته مع الأسرة؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'المشي' },
      { id: 'b', text: 'الجلوس دون حركة طوال الوقت' },
      { id: 'c', text: 'عدم ممارسة أي نشاط' },
    ],
    correctAnswer: 'a',
    explanation: 'المشي في الحديقة أو الممشى نشاط رائع يجمع الأسرة على الصحة.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 5,
  },

  // Station 5: سفيرة الصحة في منزلي
  {
    id: 'q5-1',
    stationId: 5,
    questionText: 'أسرتك تريد اختيار مشروب للوجبة، ماذا تقترحين؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'الماء' },
      { id: 'b', text: 'مشروب محلى دائمًا' },
      { id: 'c', text: 'مشروب طاقة' },
    ],
    correctAnswer: 'a',
    explanation: 'الماء المنعش هو الاختيار الذكي لسفيرة الصحة دائماً.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'q5-2',
    stationId: 5,
    questionText: 'كيف تشجعين أسرتك على الحركة؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'اقتراح المشي معًا' },
      { id: 'b', text: 'الجلوس طوال اليوم' },
      { id: 'c', text: 'منع اللعب' },
    ],
    correctAnswer: 'a',
    explanation: 'المبادرة باقتراح المشي أو الألعاب الحركية الممتعة تنشر النشاط في البيت.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'q5-3',
    stationId: 5,
    questionText: 'صديقتك مصابة بالسكري، كيف تتعاملين معها؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'أتنمر عليها' },
      { id: 'b', text: 'أدعمها وأحترمها' },
      { id: 'c', text: 'ألومها' },
    ],
    correctAnswer: 'b',
    explanation: 'الاحترام والمساندة والتعاطف قيم نبيلة؛ فالمصاب بالسكري بطل يعيش حياة طبيعية.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'q5-4',
    stationId: 5,
    questionText: 'وصلتك رسالة صحية مجهولة المصدر، ماذا تفعلين؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'أنشرها فورًا' },
      { id: 'b', text: 'أتحقق من مصدر موثوق' },
      { id: 'c', text: 'أضيف معلومات من عندي' },
    ],
    correctAnswer: 'b',
    explanation: 'التحقق قبل النشر يحمي الأسرة والمجتمع من الشائعات.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'q5-5',
    stationId: 5,
    questionText: 'ما التصرف الذي يعبر عن سفيرة الصحة؟',
    questionType: 'multiple_choice',
    options: [
      { id: 'a', text: 'نشر الوعي بلطف' },
      { id: 'b', text: 'تخويف الآخرين' },
      { id: 'c', text: 'إعطاء علاج دون اختصاص' },
    ],
    correctAnswer: 'a',
    explanation: 'القدوة الحسنة ونشر الوعي بلطف هما سر سفيرة الصحة الحقيقية.',
    points: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 5,
  },

  // Station 6: صحتي بالأرقام (للصفوف ٥ و ٦ - الأسئلة الخمسة المحددة بدقة)
  {
    id: 'q6-math-1',
    stationId: 6,
    questionText: 'سعة عبوة تعليمية افتراضية ٢ لتر، كم تساوي بالملليلتر؟',
    questionType: 'math',
    options: [
      { id: 'a', text: '٢٠٠' },
      { id: 'b', text: '٥٠٠' },
      { id: 'c', text: '٢٠٠٠' },
      { id: 'd', text: '٢٠٠٠٠' },
    ],
    correctAnswer: 'c',
    explanation: 'اللتر الواحد يساوي ١٠٠٠ ملليلتر، إذن ٢ لتر = ٢٠٠٠ ملليلتر.',
    points: 5,
    gradeLevels: [5, 6],
    difficulty: 'medium',
    version: 1,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'q6-math-2',
    stationId: 6,
    questionText: 'طبق تعليمي مقسم إلى أربعة أجزاء متساوية، جزآن منها خضراوات. ما الكسر العشري الذي يمثل الجزأين؟',
    questionType: 'math',
    options: [
      { id: 'a', text: '٠٫٢٥' },
      { id: 'b', text: '٠٫٥' },
      { id: 'c', text: '٠٫٧٥' },
      { id: 'd', text: '١٫٠' },
    ],
    correctAnswer: 'b',
    explanation: '٢ ⁄ ٤ = ١ ⁄ ٢ = ٠٫٥ (نصف الطبق الصحي).',
    points: 5,
    gradeLevels: [5, 6],
    difficulty: 'medium',
    version: 1,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'q6-math-3',
    stationId: 6,
    questionText: '١٥ من ٢٠ طالبة أكملن نشاطًا صحيًا. ما الكسر في أبسط صورة؟',
    questionType: 'math',
    options: [
      { id: 'a', text: '١ ⁄ ٢' },
      { id: 'b', text: '٢ ⁄ ٣' },
      { id: 'c', text: '٣ ⁄ ٤' },
      { id: 'd', text: '٤ ⁄ ٥' },
    ],
    correctAnswer: 'c',
    explanation: '١٥ ⁄ ٢٠ = ٣ ⁄ ٤ بعد قسمة البسط والمقام على ٥.',
    points: 5,
    gradeLevels: [5, 6],
    difficulty: 'hard',
    version: 1,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'q6-math-4',
    stationId: 6,
    questionText: 'أجابت طالبة عن ٣٠ سؤالًا صحيحًا من أصل ٤٠. ما النسبة المئوية؟',
    questionType: 'math',
    options: [
      { id: 'a', text: '٢٥٪' },
      { id: 'b', text: '٥٠٪' },
      { id: 'c', text: '٧٥٪' },
      { id: 'd', text: '٨٠٪' },
    ],
    correctAnswer: 'c',
    explanation: '٣٠ ÷ ٤٠ = ٠٫٧٥ = ٧٥٪.',
    points: 5,
    gradeLevels: [5, 6],
    difficulty: 'hard',
    version: 1,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'q6-math-5',
    stationId: 6,
    questionText: 'ما المتوسط الحسابي للأعداد الافتراضية ٨٠، ١٠٠، ١٢٠؟ (قيم افتراضية للتدريب الرياضي فقط)',
    questionType: 'math',
    options: [
      { id: 'a', text: '٨٠' },
      { id: 'b', text: '٩٠' },
      { id: 'c', text: '١٠٠' },
      { id: 'd', text: '١٢٠' },
    ],
    correctAnswer: 'c',
    explanation: '(٨٠ + ١٠٠ + ١٢٠) ÷ ٣ = ٣٠٠ ÷ ٣ = ١٠٠.',
    points: 5,
    gradeLevels: [5, 6],
    difficulty: 'medium',
    version: 1,
    isActive: true,
    sortOrder: 5,
  },

  // Station 6 للصفين ٣ و ٤ (كسور وضرب بسيط)
  {
    id: 'q6-g34-1',
    stationId: 6,
    questionText: 'تمشي سارة ٤ أيام في الأسبوع، وفي كل يوم تمشي مسافة ٢ كيلومتر. كم إجمالي الكيلومترات في الأسبوع؟',
    questionType: 'math',
    options: [
      { id: 'a', text: '٦ كيلومترات' },
      { id: 'b', text: '٨ كيلومترات' },
      { id: 'c', text: '١٠ كيلومترات' },
      { id: 'd', text: '١٢ كيلومترًا' },
    ],
    correctAnswer: 'b',
    explanation: '٤ أيام × ٢ كم = ٨ كيلومترات أسبوعيًا.',
    points: 5,
    gradeLevels: [3, 4],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'q6-g34-2',
    stationId: 6,
    questionText: 'قسمت نورة تفاحة إلى ٤ قطع متساوية، وأكلت قطعتين. ما الكسر الذي يمثل ما أكلته؟',
    questionType: 'math',
    options: [
      { id: 'a', text: '١ ⁄ ٤' },
      { id: 'b', text: '٢ ⁄ ٤ (أي النصف ١ ⁄ ٢)' },
      { id: 'c', text: '٣ ⁄ ٤' },
      { id: 'd', text: '٤ ⁄ ٤' },
    ],
    correctAnswer: 'b',
    explanation: 'قطعتان من ٤ تساوي النصف (١ ⁄ ٢).',
    points: 5,
    gradeLevels: [3, 4],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'q6-g34-3',
    stationId: 6,
    questionText: 'تحتاج الطالبة لشرب ٦ أكواب ماء يوميًا، فشربت ٤ أكواب. كم كوبًا متبقيًا؟',
    questionType: 'math',
    options: [
      { id: 'a', text: 'كوب واحد' },
      { id: 'b', text: 'كوبان (٢)' },
      { id: 'c', text: '٣ أكواب' },
      { id: 'd', text: '٤ أكواب' },
    ],
    correctAnswer: 'b',
    explanation: '٦ - ٤ = كوبان متبقيان للمحافظة على ترطيب الجسم.',
    points: 5,
    gradeLevels: [3, 4],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 3,
  },

  // Station 6 للصفين ١ و ٢ (عد ومقارنة كميات)
  {
    id: 'q6-g12-1',
    stationId: 6,
    questionText: 'في سلة الفواكه ٣ تفاحات حمراء وتفاحتان خضراوان. كم عدد التفاحات في السلة جميعها؟',
    questionType: 'math',
    options: [
      { id: 'a', text: '٣ تفاحات' },
      { id: 'b', text: '٤ تفاحات' },
      { id: 'c', text: '٥ تفاحات' },
      { id: 'd', text: '٦ تفاحات' },
    ],
    correctAnswer: 'c',
    explanation: '٣ + ٢ = ٥ تفاحات لذيذة ومغذية!',
    points: 5,
    gradeLevels: [1, 2],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'q6-g12-2',
    stationId: 6,
    questionText: 'أيهما أكثر صحة وترطيبًا للجسم: شرب كوب واحد من الماء أم ٥ أكواب موزعة بانتظام؟',
    questionType: 'math',
    options: [
      { id: 'a', text: '٥ أكواب موزعة بانتظام' },
      { id: 'b', text: 'كوب واحد فقط' },
    ],
    correctAnswer: 'a',
    explanation: 'العدد ٥ أكبر من ١، والماء يحفظ نشاط الجسم.',
    points: 5,
    gradeLevels: [1, 2],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'q6-g12-3',
    stationId: 6,
    questionText: 'مارست ريم رياضة القفز ٤ مرات صباحًا و ٤ مرات مساءً. كم مجموع قفزاتها؟',
    questionType: 'math',
    options: [
      { id: 'a', text: '٦' },
      { id: 'b', text: '٧' },
      { id: 'c', text: '٨' },
      { id: 'd', text: '٩' },
    ],
    correctAnswer: 'c',
    explanation: '٤ + ٤ = ٨ قفزات نشيطة!',
    points: 5,
    gradeLevels: [1, 2],
    difficulty: 'easy',
    version: 1,
    isActive: true,
    sortOrder: 3,
  },
];

// Helper to safely parse JSON from a response, handling <!doctype html or other non-json responses cleanly
async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<{ data: T | null; error?: string }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // Returned HTML or text instead of JSON
      return { data: null, error: `استجابة غير متوقعة من الخادم (${res.status})` };
    }
    const data = await res.json();
    if (!res.ok) {
      return { data: null, error: data.error || `خطأ (${res.status})` };
    }
    return { data };
  } catch (err: any) {
    return { data: null, error: err.message || 'تعذر الاتصال بالخادم' };
  }
}

// Local Storage Keys
const LS_STUDENTS = 'health_heroes_students';
const LS_ATTEMPTS = 'health_heroes_attempts';
const LS_MESSAGES = 'health_heroes_messages';
const LS_SETTINGS = 'health_heroes_settings';
const LS_QUESTIONS = 'health_heroes_questions';

function getLocalStudents(): Student[] {
  try {
    const raw = localStorage.getItem(LS_STUDENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalStudents(students: Student[]) {
  try {
    localStorage.setItem(LS_STUDENTS, JSON.stringify(students));
  } catch {}
}

function getLocalAttempts(): Attempt[] {
  try {
    const raw = localStorage.getItem(LS_ATTEMPTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalAttempts(attempts: Attempt[]) {
  try {
    localStorage.setItem(LS_ATTEMPTS, JSON.stringify(attempts));
  } catch {}
}

function getLocalMessages(): StudentMessage[] {
  try {
    const raw = localStorage.getItem(LS_MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMessages(messages: StudentMessage[]) {
  try {
    localStorage.setItem(LS_MESSAGES, JSON.stringify(messages));
  } catch {}
}

export const DataService = {
  /**
   * Fetch site settings with local fallback
   */
  async getSettings(): Promise<SiteSettings> {
    const { data } = await safeFetchJson<{ settings: SiteSettings }>('/api/settings');
    if (data?.settings) {
      try {
        localStorage.setItem(LS_SETTINGS, JSON.stringify(data.settings));
      } catch {}
      return data.settings;
    }
    try {
      const cached = localStorage.getItem(LS_SETTINGS);
      if (cached) return JSON.parse(cached);
    } catch {}
    return DEFAULT_SETTINGS;
  },

  /**
   * Register student (safe against <!doctype HTML / network drops)
   */
  async registerStudent(fullName: string, grade: GradeNumber, className: string): Promise<Student> {
    const normalizedName = fullName.trim().replace(/\s+/g, ' ');

    // 1. Try server first
    const { data } = await safeFetchJson<{ student: Student }>('/api/students/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: normalizedName, grade, className }),
    });

    if (data?.student) {
      // Sync into local cache
      const local = getLocalStudents();
      const existingIdx = local.findIndex((s) => s.id === data.student.id);
      if (existingIdx >= 0) {
        local[existingIdx] = data.student;
      } else {
        local.push(data.student);
      }
      saveLocalStudents(local);
      return data.student;
    }

    // 2. Fallback to robust local storage
    const local = getLocalStudents();
    let student = local.find(
      (s) =>
        s.fullName.toLowerCase() === normalizedName.toLowerCase() &&
        s.grade === grade &&
        s.className.toLowerCase() === className.trim().toLowerCase()
    );

    if (!student) {
      student = {
        id: 'std_' + Math.random().toString(36).substring(2, 10),
        fullName: normalizedName,
        grade,
        className: className.trim(),
        createdAt: new Date().toISOString(),
        totalPoints: 0,
        completedStations: [],
        badges: [],
      };
      local.push(student);
      saveLocalStudents(local);
    }

    return student;
  },

  /**
   * Fetch questions for station and grade
   */
  async getQuestions(stationId: number, grade: GradeNumber): Promise<Question[]> {
    const { data } = await safeFetchJson<{ questions: Question[] }>(
      `/api/questions?stationId=${stationId}&grade=${grade}`
    );

    if (data?.questions && data.questions.length > 0) {
      return data.questions;
    }

    // Fallback to local default questions bank
    return DEFAULT_QUESTIONS.filter(
      (q) => q.stationId === stationId && q.gradeLevels.includes(grade)
    ).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  },

  /**
   * Submit attempt with scoring, badge awards, and fail-safe local persistence
   */
  async submitAttempt(
    student: Student,
    stationId: number,
    answers: { questionId: string; selectedAnswer: string }[],
    interactiveCompleted: boolean
  ): Promise<{ attempt: Attempt; updatedStudent: Student; newBadge?: string }> {
    const stationTitles: Record<number, string> = {
      1: 'محققة الصحة',
      2: 'مصممة الطبق الصحي',
      3: 'سفيرة الكشف المبكر',
      4: 'بطلة النشاط',
      5: 'سفيرة الصحة في منزلي',
      6: 'صحتي بالأرقام',
    };

    const badgeNames: Record<number, string> = {
      1: 'محققة الصحة',
      2: 'خبيرة الغذاء',
      3: 'سفيرة الوعي',
      4: 'بطلة النشاط',
      5: 'سفيرة الأسرة',
      6: 'عبقرية الرياضيات والصحة',
    };

    // 1. Try server
    const { data } = await safeFetchJson<{
      attempt: Attempt;
      student: Student;
      newBadge?: string;
    }>('/api/attempts/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student.id,
        stationId,
        answers,
        interactiveCompleted,
      }),
    });

    if (data?.attempt && data?.student) {
      // Sync local attempts
      const allAttempts = getLocalAttempts();
      allAttempts.push(data.attempt);
      saveLocalAttempts(allAttempts);

      // Sync local student
      const localStudents = getLocalStudents();
      const idx = localStudents.findIndex((s) => s.id === student.id);
      if (idx >= 0) localStudents[idx] = data.student;
      else localStudents.push(data.student);
      saveLocalStudents(localStudents);

      return {
        attempt: data.attempt,
        updatedStudent: data.student,
        newBadge: data.newBadge,
      };
    }

    // 2. Local fallback calculation
    const allQuestions = DEFAULT_QUESTIONS;
    let score = 0;
    let maxScore = 0;
    const gradedAnswers: Attempt['answers'] = [];

    answers.forEach((ans) => {
      const q = allQuestions.find((item) => item.id === ans.questionId);
      if (q) {
        maxScore += q.points;
        const isCorrect = q.correctAnswer === ans.selectedAnswer;
        const pts = isCorrect ? q.points : 0;
        score += pts;
        gradedAnswers.push({
          questionId: q.id,
          questionText: q.questionText,
          selectedAnswer: ans.selectedAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect,
          pointsAwarded: pts,
          explanation: q.explanation,
        });
      }
    });

    if (interactiveCompleted) {
      score += 10;
      maxScore += 10;
    }

    // Station completion bonus
    score += 10;
    maxScore += 10;

    const attempt: Attempt = {
      id: 'att_' + Math.random().toString(36).substring(2, 10),
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      className: student.className,
      stationId,
      stationTitle: stationTitles[stationId] || `محطة ${stationId}`,
      score,
      maxScore,
      isCompleted: true,
      answers: gradedAnswers,
      startedAt: new Date(Date.now() - 60000).toISOString(),
      completedAt: new Date().toISOString(),
    };

    // Save attempt locally
    const localAttempts = getLocalAttempts();
    localAttempts.push(attempt);
    saveLocalAttempts(localAttempts);

    // Update student
    const updatedStudent: Student = {
      ...student,
      completedStations: student.completedStations.includes(stationId)
        ? student.completedStations
        : [...student.completedStations, stationId],
      badges:
        badgeNames[stationId] && !student.badges.includes(badgeNames[stationId])
          ? [...student.badges, badgeNames[stationId]]
          : student.badges,
    };

    // Recalculate best scores
    const studentAttempts = localAttempts.filter((a) => a.studentId === student.id);
    const bestScores: Record<number, number> = {};
    studentAttempts.forEach((a) => {
      bestScores[a.stationId] = Math.max(bestScores[a.stationId] || 0, a.score);
    });
    updatedStudent.totalPoints = Object.values(bestScores).reduce((sum, s) => sum + s, 0);

    const localStudents = getLocalStudents();
    const sIdx = localStudents.findIndex((s) => s.id === student.id);
    if (sIdx >= 0) localStudents[sIdx] = updatedStudent;
    else localStudents.push(updatedStudent);
    saveLocalStudents(localStudents);

    return {
      attempt,
      updatedStudent,
      newBadge: badgeNames[stationId],
    };
  },

  /**
   * Save student pledge and health message
   */
  async saveMessage(
    student: Student,
    message: string,
    cardTheme: 'turquoise' | 'golden' | 'emerald' | 'royal' = 'turquoise'
  ): Promise<StudentMessage> {
    const pledge =
      'أتعهد أن أكون سفيرة للوعي الصحي في منزلي، وأن أشارك أسرتي العادات الصحية والمعلومات الموثوقة';

    // 1. Try server
    const { data } = await safeFetchJson<{ messageRecord: StudentMessage }>('/api/student-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student.id,
        message,
        pledge,
        cardTheme,
      }),
    });

    if (data?.messageRecord) {
      const local = getLocalMessages();
      const idx = local.findIndex((m) => m.studentId === student.id);
      if (idx >= 0) local[idx] = data.messageRecord;
      else local.push(data.messageRecord);
      saveLocalMessages(local);
      return data.messageRecord;
    }

    // 2. Local fallback
    const local = getLocalMessages();
    let record = local.find((m) => m.studentId === student.id);
    if (record) {
      record.message = message;
      record.cardTheme = cardTheme;
    } else {
      record = {
        id: 'msg_' + Math.random().toString(36).substring(2, 10),
        studentId: student.id,
        studentName: student.fullName,
        grade: student.grade,
        className: student.className,
        message,
        pledge,
        cardTheme,
        createdAt: new Date().toISOString(),
      };
      local.push(record);
    }
    saveLocalMessages(local);
    return record;
  },

  /**
   * Get students for teacher dashboard with local sync
   */
  async getTeacherStudents(authToken: string | null): Promise<any[]> {
    if (authToken) {
      const { data } = await safeFetchJson<{ students: any[] }>('/api/teacher/students', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (data?.students) return data.students;
    }

    // Fallback to local students with attempt counts
    const local = getLocalStudents();
    const attempts = getLocalAttempts();
    return local.map((s) => {
      const sAttempts = attempts.filter((a) => a.studentId === s.id);
      const best = sAttempts.reduce((max, a) => Math.max(max, a.score), 0);
      return {
        ...s,
        attemptsCount: sAttempts.length,
        bestScore: best,
        latestStation: sAttempts[sAttempts.length - 1]?.stationTitle || 'لم تبدأ بعد',
      };
    });
  },

  /**
   * Get student detail report with local sync
   */
  async getStudentDetail(studentId: string, authToken: string | null): Promise<any> {
    if (authToken) {
      const { data } = await safeFetchJson<any>(`/api/teacher/students/${studentId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (data?.student) return data;
    }

    const localStudents = getLocalStudents();
    const localAttempts = getLocalAttempts();
    const localMessages = getLocalMessages();

    const student = localStudents.find((s) => s.id === studentId);
    const attempts = localAttempts.filter((a) => a.studentId === studentId);
    const message = localMessages.find((m) => m.studentId === studentId);

    return { student, attempts, message };
  },

  /**
   * Get aggregated reports
   */
  async getReports(authToken: string | null): Promise<TeacherAnalytics> {
    if (authToken) {
      const { data } = await safeFetchJson<{ analytics: TeacherAnalytics }>('/api/teacher/reports', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (data?.analytics) return data.analytics;
    }

    // Fallback local stats
    const students = getLocalStudents();
    const attempts = getLocalAttempts();
    const totalStudents = students.length;
    const totalAttempts = attempts.length;
    const avgScore = totalStudents > 0
      ? Math.round(students.reduce((acc, s) => acc + s.totalPoints, 0) / totalStudents)
      : 0;

    const gradeDistribution: Record<string, number> = {
      'الصف الأول': 0,
      'الصف الثاني': 0,
      'الصف الثالث': 0,
      'الصف الرابع': 0,
      'الصف الخامس': 0,
      'الصف السادس': 0,
    };
    students.forEach((s) => {
      const key = `الصف ${s.grade}`;
      gradeDistribution[key] = (gradeDistribution[key] || 0) + 1;
    });

    const stationCompletionCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    students.forEach((s) => {
      s.completedStations.forEach((st) => {
        stationCompletionCounts[st] = (stationCompletionCounts[st] || 0) + 1;
      });
    });

    return {
      totalStudents,
      totalAttempts,
      averageScore: avgScore,
      gradeDistribution,
      stationCompletionCounts,
      mostMissedQuestions: [],
    };
  },
};
