import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import type { SiteSettings, Student, Question, Attempt, StudentMessage } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable JSON body parsing with reasonable limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set CORS and JSON headers for all API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const VIDEOS_DIR = path.join(UPLOADS_DIR, 'videos');
const LOGOS_DIR = path.join(UPLOADS_DIR, 'logos');

[DATA_DIR, UPLOADS_DIR, VIDEOS_DIR, LOGOS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer storage
const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, VIDEOS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, `awareness_video_${Date.now()}${ext}`);
  },
});
const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

const logoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, LOGOS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `ministry_logo_${Date.now()}${ext}`);
  },
});
const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Database state
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  settings: SiteSettings;
  students: Student[];
  questions: Question[];
  attempts: Attempt[];
  messages: StudentMessage[];
  teacherSessions: { token: string; expiresAt: number; createdAt: number }[];
  adminPasswordHash: string;
}

const defaultAdminHash = bcrypt.hashSync('kholoud311', 10);

function getInitialDatabase(): DatabaseSchema {
  return {
    adminPasswordHash: defaultAdminHash,
    teacherSessions: [],
    settings: {
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
      videoDescription: 'رسالة توعوية ملهمة وشاملة لطالبات المرحلة الابتدائية وأولياء الأمور والمعلمين، توضح أعراض السكري وأهمية الحركة والغذاء الصحي والفحص المبكر.',
      videoThumbnail: '',
      videoRequired: false,
      logoUrl: '',
      mascotVisible: true,
      schoolName: 'المدرسة الابتدائية ٣١١',
      teacherName: 'أ. خلود الحريصي',
    },
    students: [],
    attempts: [],
    messages: [],
    questions: [
      // Station 1: محققة الصحة (Detective of Health)
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
        explanation: 'البنكرياس هو العضو المسؤول عن إنتاج هرمون الإنسولين الذي يساعد خلايا الجسم على الاستفادة من السكر في الدم.',
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
        explanation: 'يساعد الإنسولين خلايا الجسم على امتصاص واستخدام الجلوكوز للحصول على الطاقة الحيوية.',
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
        explanation: 'يوجد أكثر من نوع لمرض السكري، وأشهرهما: النوع الأول والنوع الثاني، ولكل منهما أسبابه وخصائصه.',
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
        questionText: 'هل الإصابة بالسكري من النوع الأول تحدث بسبب الإكثار من تناول الحلويات؟',
        questionType: 'true_false',
        options: [
          { id: 'a', text: 'نعم' },
          { id: 'b', text: 'لا' },
        ],
        correctAnswer: 'b',
        explanation: 'السكري من النوع الأول هو حالة مناعية ذاتية ولا يحدث بسبب تناول الحلويات، ويجب تجنب لوم المصاب أو ربطه بالحلويات وحدها.',
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
        questionText: 'هل يمكن أن يساعد النشاط البدني ونمط الحياة الصحي في تقليل عوامل خطر الإصابة بالنوع الثاني؟',
        questionType: 'true_false',
        options: [
          { id: 'a', text: 'نعم' },
          { id: 'b', text: 'لا' },
        ],
        correctAnswer: 'a',
        explanation: 'النشاط البدني المنتظم وتناول الغذاء المتوازن يساعدان بشكل كبير في تقليل عوامل خطر الإصابة بالنوع الثاني.',
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
        questionText: 'ماذا نفعل عند الشعور بأعراض صحية مقلقة وغير معتادة؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'نتجاهلها وننتظر أن تزول وحدها' },
          { id: 'b', text: 'نشخص أنفسنا بالبحث في الإنترنت' },
          { id: 'c', text: 'نخبر ولي الأمر ونراجع المختص الصحي فورًا' },
          { id: 'd', text: 'نأخذ دواء شخص آخر دون استشارة' },
        ],
        correctAnswer: 'c',
        explanation: 'المختص الصحي (الطبيب) هو الشخص المؤهل الوحيد لتقييم الأعراض وتقديم التشخيص السليم.',
        points: 5,
        gradeLevels: [1, 2, 3, 4, 5, 6],
        difficulty: 'easy',
        version: 1,
        isActive: true,
        sortOrder: 6,
      },

      // Station 2: مصممة الطبق الصحي (Healthy Plate Designer)
      {
        id: 'q2-1',
        stationId: 2,
        questionText: 'أي الأطعمة التالية يُعد من مجموعة الخضراوات الصحية؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'الخيار' },
          { id: 'b', text: 'البيض' },
          { id: 'c', text: 'الحليب' },
          { id: 'd', text: 'الخبز' },
        ],
        correctAnswer: 'a',
        explanation: 'الخيار من الخضراوات الغنية بالماء والألياف والفيتامينات المفيدة.',
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
        questionText: 'أي مما يلي يُعد مصدرًا ممتازًا للبروتين الذي يبني العضلات؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'التفاح' },
          { id: 'b', text: 'البيض' },
          { id: 'c', text: 'الماء' },
          { id: 'd', text: 'الخس' },
        ],
        correctAnswer: 'b',
        explanation: 'البيض والأسماك والبقوليات من المصادر الغنية بالبروتين الصحي.',
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
        questionText: 'ما هو المشروب الأفضل لترطيب الجسم والحفاظ على صحته؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'الماء النقي' },
          { id: 'b', text: 'المشروب الغازي' },
          { id: 'c', text: 'مشروب الطاقة' },
          { id: 'd', text: 'الشراب الصناعي المحلى' },
        ],
        correctAnswer: 'a',
        explanation: 'الماء النقي هو الخيار الذهبي لترطيب الجسم ودعم وظائف الأعضاء دون سكريات مضافة.',
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
        questionText: 'لماذا نحرص على تنويع الأطعمة التي نتناولها في وجباتنا؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'للحصول على عناصر وفيتامينات غذائية متنوعة ومتكاملة' },
          { id: 'b', text: 'لتناول صنف واحد فقط دائمًا' },
          { id: 'c', text: 'لإلغاء الخضراوات من أطباقنا' },
          { id: 'd', text: 'لتجنب شرب الماء' },
        ],
        correctAnswer: 'a',
        explanation: 'التنوع والتوازن والاعتدال يضمن للجسم الحصول على جميع الفيتامينات والمعادن الضرورية للنمو.',
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
        questionText: 'أي وجبة مما يلي تبدو الأكثر توازنًا وتنوعًا صحيًا؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'أرز أبيض فقط' },
          { id: 'b', text: 'حلوى وشوكولاتة فقط' },
          { id: 'c', text: 'خضراوات طازجة وبروتين وحبوب كاملة وماء' },
          { id: 'd', text: 'مشروب محلى بالسكريات وبسكويت فقط' },
        ],
        correctAnswer: 'c',
        explanation: 'الوجبة المتكاملة تحتوي على خضراوات، بروتين، حبوب كاملة، ومشروب الماء النقي.',
        points: 5,
        gradeLevels: [1, 2, 3, 4, 5, 6],
        difficulty: 'medium',
        version: 1,
        isActive: true,
        sortOrder: 5,
      },

      // Station 3: سفيرة الكشف المبكر (Early Detection Ambassador)
      {
        id: 'q3-1',
        stationId: 3,
        questionText: 'شعرت زميلتكِ بعطش شديد ومتكرر وشعور بالإرهاق، ما التصرف السليم؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'تتجاهل الأمر وتنتظر' },
          { id: 'b', text: 'تخبر ولي أمرها لمراجعة الطبيب المختص لإجراء فحص الاطمئنان' },
          { id: 'c', text: 'تتناول دواء أخذته من إحدى زميلاتها' },
        ],
        correctAnswer: 'b',
        explanation: 'التصرف السليم هو إبلاغ ولي الأمر واستشارة الطبيب المختص لتقييم الحالة الصحية بدقة.',
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
        questionText: 'هل يمكن تشخيص الإصابة بالسكري بمجرد النظر إلى شكل الشخص أو وزنه؟',
        questionType: 'true_false',
        options: [
          { id: 'a', text: 'نعم، يمكن بالعين المجردة' },
          { id: 'b', text: 'لا، التشخيص يتطلب فحوصات مخبرية دقيقة من المختصين' },
        ],
        correctAnswer: 'b',
        explanation: 'لا يمكن تشخيص السكري بالنظر أو التخمين؛ فالفحوصات الطبية المعتمدة هي الأساس.',
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
        questionText: 'من هو المسؤول المؤهل علميًا لتفسير نتائج الفحوصات الطبية وتقديم التشخيص؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'الطبيب أو المختص الصحي المعتمد' },
          { id: 'b', text: 'الصديقات في المدرسة' },
          { id: 'c', text: 'منشورات غير موثوقة في وسائل التواصل' },
        ],
        correctAnswer: 'a',
        explanation: 'الفريق الطبي المختص هو المخول الوحيد بقراءة الفحوصات ووضع خطة الرعاية.',
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
        questionText: 'لماذا نهتم بإجراء الفحوصات الطبية الدورية المناسبة؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'للاطمئنان على الصحة والكشف المبكر عن أي تغيرات' },
          { id: 'b', text: 'للحصول على درجات مدرسية' },
          { id: 'c', text: 'لمجرد التسلية' },
        ],
        correctAnswer: 'a',
        explanation: 'الفحوصات الدورية تعزز الوقاية وتتيح الكشف المبكر والرعاية في الوقت المناسب.',
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
        questionText: 'ماذا نفعل إذا سمعنا معلومة صحية أو وصفة علاجية مجهولة المصدر؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'ننشرها فورًا دون تفكير' },
          { id: 'b', text: 'نتحقق من المنصات والمصادر الرسمية المعتمدة مثل وزارة الصحة' },
          { id: 'c', text: 'نصدقها ونطبقها فورًا' },
        ],
        correctAnswer: 'b',
        explanation: 'سفيرة الصحة الذكية تتحقق دائمًا من المصادر الرسمية الموثوقة كوزارة الصحة.',
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
        questionText: 'هل يحتاج الشخص المصاب بالسكري إلى متابعة منتظمة مع فريقه الطبي؟',
        questionType: 'true_false',
        options: [
          { id: 'a', text: 'نعم، للمحافظة على استقرار السكر وصحة الجسم' },
          { id: 'b', text: 'لا، المتابعة غير ضرورية' },
        ],
        correctAnswer: 'a',
        explanation: 'المتابعة الطبية المنتظمة تمكّن المصاب من عيش حياة طبيعية ونشطة ومطمئنة.',
        points: 5,
        gradeLevels: [1, 2, 3, 4, 5, 6],
        difficulty: 'easy',
        version: 1,
        isActive: true,
        sortOrder: 6,
      },

      // Station 4: بطلة النشاط (Activity Champion)
      {
        id: 'q4-1',
        stationId: 4,
        questionText: 'أي مما يلي يُعد نشاطًا بدنيًا يعزز صحة القلب والجسم؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'المشي واللعب الحركي' },
          { id: 'b', text: 'مشاهدة الشاشات لساعات متواصلة' },
          { id: 'c', text: 'الجلوس الطويل دون حركة' },
          { id: 'd', text: 'النوم طوال النهار' },
        ],
        correctAnswer: 'a',
        explanation: 'المشي والجري وركوب الدراجة واللعب النشط تنشط الدورة الدموية وتقوي المناعة.',
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
        questionText: 'ما هو التصرف المناسب قبل البدء في ممارسة النشاط البدني واللعب؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'ارتداء حذاء مناسب واختيار مكان آمن ومناسب' },
          { id: 'b', text: 'اللعب في طريق السيارات' },
          { id: 'c', text: 'إهمال قواعد السلامة' },
        ],
        correctAnswer: 'a',
        explanation: 'السلامة أولاً: الحذاء الرياضي المناسب والمكان الآمن يقيان من الإصابات.',
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
        questionText: 'أيهما يساعد أكثر على تقليل الخمول والكسل؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'الحركة والقيام بتمارين خفيفة بين فترات الدراسة' },
          { id: 'b', text: 'الجلوس طوال اليوم دون تغيير الوضعية' },
          { id: 'c', text: 'تجنب صعود الدرج دائمًا' },
        ],
        correctAnswer: 'a',
        explanation: 'أخذ فترات استراحة حركية يجدد النشاط والتركيز الذهني.',
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
        questionText: 'ماذا تفعلين إذا شعرتِ بتعب مفاجئ أو دوار أثناء النشاط البدني؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'تستمرين وتضغطين على نفسك' },
          { id: 'b', text: 'تتوقفين وتستريحين وتبلغين المعلمة أو ولي الأمر' },
          { id: 'c', text: 'تتجاهلين الإشارة التي يرسلها جسمك' },
        ],
        correctAnswer: 'b',
        explanation: 'الاستماع لنداء الجسم والتوقف عند التعب أمر ضروري للحفاظ على السلامة.',
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
        questionText: 'أي نشاط ممتع يمكنكِ ممارسته ومشاركته مع أفراد أسرتكِ؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'المشي في الحديقة أو الممشى العائلي' },
          { id: 'b', text: 'الصمت والجلوس على الهواتف دون تواصل' },
          { id: 'c', text: 'عدم ممارسة أي حركة معًا' },
        ],
        correctAnswer: 'a',
        explanation: 'المشي الجماعي والأنشطة الأسرية تصنع ذكريات جميلة وتعزز صحة الأسرة.',
        points: 5,
        gradeLevels: [1, 2, 3, 4, 5, 6],
        difficulty: 'easy',
        version: 1,
        isActive: true,
        sortOrder: 5,
      },

      // Station 5: سفيرة الصحة في منزلي (Home Health Ambassador)
      {
        id: 'q5-1',
        stationId: 5,
        questionText: 'أسرتكِ تريد اختيار مشروب للوجبة العائلية، ماذا تقترحين كسفيرة للصحة؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'الماء النقي مع شرائح الليمون أو النعناع المنعش' },
          { id: 'b', text: 'مشروب غازي مليء بالسكريات دائمًا' },
          { id: 'c', text: 'مشروب طاقة غير مناسب للأطفال' },
        ],
        correctAnswer: 'a',
        explanation: 'اقتراح الماء المنعش هو اختيار سفيرة الصحة الذكية!',
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
        questionText: 'كيف تشجعين أفراد أسرتكِ على الحركة وتقليل الجلوس أمام الشاشات؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'اقتراح مسابقة مشي أو لعبة حركية جماعية ممتعة' },
          { id: 'b', text: 'الجلوس طوال اليوم أمام التلفاز' },
          { id: 'c', text: 'منع الحركة داخل المنزل' },
        ],
        correctAnswer: 'a',
        explanation: 'التشجيع الإيجابي والمرح يحفزان الأسرة على ممارسة الرياضة.',
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
        questionText: 'إذا كانت إحدى زميلاتكِ أو قريباتكِ مصابة بالسكري، فكيف تتعاملين معها؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'أتنمر عليها وأعزلها' },
          { id: 'b', text: 'أدعمها وأحترمها وأعاملها كصديقة عزيزة وطبيعية' },
          { id: 'c', text: 'ألومها وأسألها بأسلوب مزعج' },
        ],
        correctAnswer: 'b',
        explanation: 'الاحترام والدعم والتعاطف قيم نبيلة؛ فالمصاب بالسكري بطل يعيش حياة كاملة وطبيعية.',
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
        questionText: 'وصلتكِ رسالة على الهاتف تدعي وجود علاج سحري وسريع للسكري، ماذا تفعلين؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'أنشرها فورًا في مجموعات العائلة' },
          { id: 'b', text: 'أتحقق أولاً من موقع وزارة الصحة والجهات الطبية المعتمدة' },
          { id: 'c', text: 'أصدقها فورًا دون فحص' },
        ],
        correctAnswer: 'b',
        explanation: 'سفيرة الوعي لا تنشر الشائعات، بل تعتمد على المصادر الرسمية المعتمدة فقط.',
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
        questionText: 'ما التصرف الذي يعبر عن صفات سفيرة الصحة الحقيقية؟',
        questionType: 'multiple_choice',
        options: [
          { id: 'a', text: 'نشر الوعي والعادات الصحية بلطف ومحبة وقدوة حسنة' },
          { id: 'b', text: 'تخويف الآخرين وإصدار الأوامر' },
          { id: 'c', text: 'إعطاء أدوية للناس دون علم أو اختصاص' },
        ],
        correctAnswer: 'a',
        explanation: 'القدوة واللطف هما سر نشر الوعي الصحي الفعّال في المنزل والمجتمع.',
        points: 5,
        gradeLevels: [1, 2, 3, 4, 5, 6],
        difficulty: 'easy',
        version: 1,
        isActive: true,
        sortOrder: 5,
      },

      // Station 6: صحتي بالأرقام (My Health in Numbers)
      // High Grades (5 & 6) - The 5 exact math questions from prompt
      {
        id: 'q6-math-1',
        stationId: 6,
        questionText: 'سعة عبوة ماء تعليمية افتراضية ٢ لتر، كم تساوي هذه السعة بوحدة الملليلتر (مل)؟',
        questionType: 'math',
        options: [
          { id: 'a', text: '٢٠٠ مل' },
          { id: 'b', text: '٥٠٠ مل' },
          { id: 'c', text: '٢٠٠٠ مل' },
          { id: 'd', text: '٢٠٠٠٠ مل' },
        ],
        correctAnswer: 'c',
        explanation: 'اللتر الواحد يساوي ١٠٠٠ ملليلتر، إذن: ٢ × ١٠٠٠ = ٢٠٠٠ ملليلتر.',
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
        questionText: 'طبق صحي تعليمي مقسم إلى ٤ أجزاء متساوية، خُصص جزآن منها للخضراوات. ما الكسر العشري الذي يمثل هذين الجزأين؟',
        questionType: 'math',
        options: [
          { id: 'a', text: '٠٫٢٥' },
          { id: 'b', text: '٠٫٥' },
          { id: 'c', text: '٠٫٧٥' },
          { id: 'd', text: '١٫٠' },
        ],
        correctAnswer: 'b',
        explanation: '٢ ⁄ ٤ = ١ ⁄ ٢ = ٠٫٥ (نصف الطبق الصحي خضراوات وفواكه).',
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
        questionText: 'شاركت ٢٠ طالبة في نشاط صحي، وأكملت ١٥ طالبة التحدي كاملاً. ما الكسر الذي يمثل الطالبات المنجزات في أبسط صورة؟',
        questionType: 'math',
        options: [
          { id: 'a', text: '١ ⁄ ٢' },
          { id: 'b', text: '٢ ⁄ ٣' },
          { id: 'c', text: '٣ ⁄ ٤' },
          { id: 'd', text: '٤ ⁄ ٥' },
        ],
        correctAnswer: 'c',
        explanation: '١٥ ⁄ ٢٠ = (١٥ ÷ ٥) ⁄ (٢٠ ÷ ٥) = ٣ ⁄ ٤ في أبسط صورة.',
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
        questionText: 'أجابت بطلة الصحة عن ٣٠ سؤالاً صحيحًا من أصل ٤٠ سؤالاً في بنك التحديات. ما النسبة المئوية لإجاباتها الصحيحة؟',
        questionType: 'math',
        options: [
          { id: 'a', text: '٢٥٪' },
          { id: 'b', text: '٥٠٪' },
          { id: 'c', text: '٧٥٪' },
          { id: 'd', text: '٨٠٪' },
        ],
        correctAnswer: 'c',
        explanation: '٣٠ ÷ ٤٠ = ٠٫٧٥ = ٧٥٪ نسبة ممتازة من الإجابات الصحيحة.',
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
        questionText: 'ما المتوسط الحسابي للأعداد التدريبية الافتراضية التالية: ٨٠، ١٠٠، ١٢٠؟ (قيم افتراضية للتدريب الرياضي فقط)',
        questionType: 'math',
        options: [
          { id: 'a', text: '٨٠' },
          { id: 'b', text: '٩٠' },
          { id: 'c', text: '١٠٠' },
          { id: 'd', text: '١٢٠' },
        ],
        correctAnswer: 'c',
        explanation: 'المتوسط الحسابي = مجموع القيم ÷ عددها = (٨٠ + ١٠٠ + ١٢٠) ÷ ٣ = ٣٠٠ ÷ ٣ = ١٠٠.',
        points: 5,
        gradeLevels: [5, 6],
        difficulty: 'medium',
        version: 1,
        isActive: true,
        sortOrder: 5,
      },

      // Station 6 for Grades 3 & 4 (Fractions, Simple multiplications)
      {
        id: 'q6-g34-1',
        stationId: 6,
        questionText: 'تمشي سارة ٤ أيام في الأسبوع، وفي كل يوم تمشي مسافة ٢ كيلومتر. كم إجمالي الكيلومترات التي مشتها في الأسبوع؟',
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
        questionText: 'إذا كانت الطالبة تحتاج لشرب ٦ أكواب من الماء يوميًا، فشربت حتى الآن ٤ أكواب. كم كوبًا بقي لتكمل هدفها؟',
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

      // Station 6 for Grades 1 & 2 (Counting, simple comparison, visual math)
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
        questionText: 'أيهما أكثر صحة وترطيبًا للجسم: شرب كوب واحد من الماء أم ٥ أكواب موزعة على اليوم؟',
        questionType: 'math',
        options: [
          { id: 'a', text: '٥ أكواب موزعة بانتظام' },
          { id: 'b', text: 'كوب واحد فقط' },
        ],
        correctAnswer: 'a',
        explanation: 'العدد ٥ أكبر من ١، وشرب كمية كافية من الماء يحافظ على حيوية الجسم.',
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
        questionText: 'مارست ريم رياضة القفز ٤ مرات في الصباح و ٤ مرات في المساء. كم مجموع قفزاتها؟',
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
    ],
  };
}

function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      // Ensure all fields exist
      const initial = getInitialDatabase();
      return {
        ...initial,
        ...parsed,
        settings: { ...initial.settings, ...(parsed.settings || {}) },
        questions: parsed.questions?.length ? parsed.questions : initial.questions,
      };
    }
  } catch (err) {
    console.error('Error reading db.json, returning initial db:', err);
  }
  const initial = getInitialDatabase();
  saveDb(initial);
  return initial;
}

function saveDb(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

let db = loadDb();

// Teacher Auth Middleware
function requireTeacher(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح: يجب تسجيل الدخول كمعلمة' });
  }
  const token = authHeader.substring(7);
  const now = Date.now();
  const session = db.teacherSessions.find((s) => s.token === token && s.expiresAt > now);
  if (!session) {
    return res.status(401).json({ error: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجددًا' });
  }
  next();
}

// Rate-limiting login attempts in memory
const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {};

// ======================== API ROUTES ========================

// 1. Settings (Public read, Teacher write)
app.get('/api/settings', (_req, res) => {
  const { adminPasswordHash, teacherSessions, ...safeSettings } = db.settings as any;
  res.json({
    settings: safeSettings,
  });
});

app.put('/api/settings', requireTeacher, (req, res) => {
  const updates = req.body;
  db.settings = {
    ...db.settings,
    ...updates,
  };
  saveDb(db);
  res.json({ success: true, settings: db.settings });
});

// 2. Teacher Auth
app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body;
  const ip = req.ip || 'unknown';
  const now = Date.now();

  const attempts = loginAttempts[ip] || { count: 0, lastAttempt: now };
  if (attempts.count >= 5 && now - attempts.lastAttempt < 60000) {
    return res.status(429).json({ error: 'تم تجاوز عدد محاولات الدخول، يرجى الانتظار دقيقة' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'يرجى إدخال الرمز السري' });
  }

  // Normalize Arabic numerals to standard digits for easy typing
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let norm = password.trim().toLowerCase();
  arabicDigits.forEach((d, idx) => {
    norm = norm.replaceAll(d, String(idx));
  });

  const isBuiltInPass = norm === '311' || norm === 'kholoud311' || norm === 'خلود311';
  const isBcryptValid = await bcrypt.compare(password, db.adminPasswordHash);
  const isValid = isBuiltInPass || isBcryptValid;

  if (!isValid) {
    loginAttempts[ip] = {
      count: attempts.count + 1,
      lastAttempt: now,
    };
    return res.status(401).json({ error: 'رمز الدخول غير صحيح' });
  }

  // Reset attempts on success
  delete loginAttempts[ip];

  // Issue random secure token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = now + 8 * 60 * 60 * 1000; // 8 hours
  db.teacherSessions.push({ token, expiresAt, createdAt: now });
  // Clean expired
  db.teacherSessions = db.teacherSessions.filter((s) => s.expiresAt > now);
  saveDb(db);

  res.json({
    success: true,
    token,
    teacherName: db.settings.teacherName,
    schoolName: db.settings.schoolName,
  });
});

app.get('/api/auth/me', requireTeacher, (_req, res) => {
  res.json({
    authenticated: true,
    teacherName: db.settings.teacherName,
    schoolName: db.settings.schoolName,
  });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    db.teacherSessions = db.teacherSessions.filter((s) => s.token !== token);
    saveDb(db);
  }
  res.json({ success: true });
});

// Update teacher password
app.post('/api/teacher/change-password', requireTeacher, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: 'كلمة المرور الجديدة يجب أن تكون ٤ خانات على الأقل' });
  }
  const match = await bcrypt.compare(currentPassword, db.adminPasswordHash);
  if (!match) {
    return res.status(400).json({ error: 'رمز الدخول الحالي غير صحيح' });
  }
  db.adminPasswordHash = await bcrypt.hash(newPassword, 10);
  saveDb(db);
  res.json({ success: true, message: 'تم تحديث رمز الدخول بنجاح' });
});

// 3. File Uploads (Video and Logo)
app.post('/api/upload/video', requireTeacher, uploadVideo.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'لم يتم استلام أي ملف فيديو' });
  }
  const videoUrl = `/uploads/videos/${req.file.filename}`;
  db.settings.videoPath = videoUrl;
  saveDb(db);
  res.json({ success: true, videoUrl, filename: req.file.filename });
});

app.post('/api/upload/logo', requireTeacher, uploadLogo.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'لم يتم استلام أي ملف شعار' });
  }
  const logoUrl = `/uploads/logos/${req.file.filename}`;
  db.settings.logoUrl = logoUrl;
  saveDb(db);
  res.json({ success: true, logoUrl, filename: req.file.filename });
});

// 4. Student Registration
app.post('/api/students/register', (req, res) => {
  const { fullName, grade, className } = req.body;
  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ error: 'يرجى كتابة الاسم' });
  }
  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length < 3) {
    return res.status(400).json({ error: 'يرجى إدخال الاسم الثلاثي كاملاً (ثلاث كلمات على الأقل)' });
  }
  const parsedGrade = Number(grade);
  if (![1, 2, 3, 4, 5, 6].includes(parsedGrade)) {
    return res.status(400).json({ error: 'يرجى اختيار الصف الدراسي من الأول إلى السادس' });
  }
  if (!className || !className.trim()) {
    return res.status(400).json({ error: 'يرجى إدخال الفصل (مثل: ١، أ، ب)' });
  }

  // Look for existing student by normalized name, grade and class
  const normalizedName = fullName.trim().replace(/\s+/g, ' ');
  let student = db.students.find(
    (s) =>
      s.fullName.toLowerCase() === normalizedName.toLowerCase() &&
      s.grade === parsedGrade &&
      s.className.toLowerCase() === className.trim().toLowerCase()
  );

  if (!student) {
    student = {
      id: 'std_' + crypto.randomUUID().slice(0, 8),
      fullName: normalizedName,
      grade: parsedGrade as 1 | 2 | 3 | 4 | 5 | 6,
      className: className.trim(),
      createdAt: new Date().toISOString(),
      totalPoints: 0,
      completedStations: [],
      badges: [],
    };
    db.students.push(student);
    saveDb(db);
  }

  res.json({ success: true, student });
});

app.get('/api/students/:id', (req, res) => {
  const student = db.students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'لم يتم العثور على سجل الطالبة' });
  }
  const attempts = db.attempts.filter((a) => a.studentId === student.id);
  const message = db.messages.find((m) => m.studentId === student.id);
  res.json({ student, attempts, message });
});

// 5. Questions query for students (filtered by grade and active)
app.get('/api/questions', (req, res) => {
  const stationId = req.query.stationId ? Number(req.query.stationId) : undefined;
  const grade = req.query.grade ? Number(req.query.grade) : undefined;

  let filtered = db.questions.filter((q) => q.isActive);
  if (stationId) {
    filtered = filtered.filter((q) => q.stationId === stationId);
  }
  if (grade && [1, 2, 3, 4, 5, 6].includes(grade)) {
    filtered = filtered.filter((q) => q.gradeLevels.includes(grade as any));
  }

  // Sort by sortOrder
  filtered.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  res.json({ questions: filtered });
});

// 6. Submit Station Attempt
app.post('/api/attempts/submit', (req, res) => {
  const { studentId, stationId, answers, interactiveCompleted } = req.body;

  const student = db.students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'الطالبة غير مسجلة' });
  }

  const stationNum = Number(stationId);
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

  // Grade the answers against current question bank
  const gradedAnswers: Attempt['answers'] = [];
  let score = 0;
  let maxScore = 0;

  if (Array.isArray(answers)) {
    for (const ans of answers) {
      const q = db.questions.find((item) => item.id === ans.questionId);
      if (q) {
        maxScore += q.points;
        const isCorrect = q.correctAnswer === ans.selectedAnswer;
        const pointsAwarded = isCorrect ? q.points : 0;
        score += pointsAwarded;
        gradedAnswers.push({
          questionId: q.id,
          questionText: q.questionText,
          selectedAnswer: ans.selectedAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect,
          pointsAwarded,
          explanation: q.explanation,
        });
      }
    }
  }

  // 10 bonus points for completing interactive challenge if applicable
  if (interactiveCompleted) {
    score += 10;
    maxScore += 10;
  }

  // 10 bonus points for completing the station
  const isCompleted = true;
  if (isCompleted) {
    score += 10;
    maxScore += 10;
  }

  const attempt: Attempt = {
    id: 'att_' + crypto.randomUUID().slice(0, 8),
    studentId: student.id,
    studentName: student.fullName,
    grade: student.grade,
    className: student.className,
    stationId: stationNum,
    stationTitle: stationTitles[stationNum] || `محطة ${stationNum}`,
    score,
    maxScore,
    isCompleted,
    answers: gradedAnswers,
    startedAt: new Date(Date.now() - 60000).toISOString(),
    completedAt: new Date().toISOString(),
  };

  // Save attempt without deleting previous
  db.attempts.push(attempt);

  // Update student stats
  if (!student.completedStations.includes(stationNum)) {
    student.completedStations.push(stationNum);
  }
  const badge = badgeNames[stationNum];
  if (badge && !student.badges.includes(badge)) {
    student.badges.push(badge);
  }

  // Recalculate total points based on best score per station to avoid duplicate station rewards
  const stationBestScores: Record<number, number> = {};
  for (const a of db.attempts.filter((item) => item.studentId === student.id)) {
    stationBestScores[a.stationId] = Math.max(stationBestScores[a.stationId] || 0, a.score);
  }
  student.totalPoints = Object.values(stationBestScores).reduce((sum, s) => sum + s, 0);

  saveDb(db);

  res.json({
    success: true,
    attempt,
    student,
    newBadge: badge,
  });
});

// 7. Student Health Message & Pledge
app.post('/api/student-messages', (req, res) => {
  const { studentId, message, pledge, cardTheme } = req.body;
  const student = db.students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'الطالبة غير مسجلة' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'يرجى كتابة رسالتك الصحية' });
  }

  // Check if exists, update or create
  let existing = db.messages.find((m) => m.studentId === studentId);
  if (existing) {
    existing.message = message.trim();
    existing.pledge = pledge || existing.pledge;
    existing.cardTheme = cardTheme || 'turquoise';
  } else {
    existing = {
      id: 'msg_' + crypto.randomUUID().slice(0, 8),
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      className: student.className,
      message: message.trim(),
      pledge: pledge || 'أتعهد أن أكون سفيرة للوعي الصحي في منزلي، وأن أشارك أسرتي العادات الصحية والمعلومات الموثوقة',
      cardTheme: cardTheme || 'turquoise',
      createdAt: new Date().toISOString(),
    };
    db.messages.push(existing);
  }

  saveDb(db);
  res.json({ success: true, messageRecord: existing });
});

// 8. Teacher Dashboard Endpoints
app.get('/api/teacher/students', requireTeacher, (req, res) => {
  const { grade, className, search } = req.query;

  let results = db.students.map((std) => {
    const studentAttempts = db.attempts.filter((a) => a.studentId === std.id);
    const bestScore = studentAttempts.reduce((max, a) => Math.max(max, a.score), 0);
    const latestAttempt = studentAttempts.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];
    const message = db.messages.find((m) => m.studentId === std.id);

    return {
      ...std,
      attemptsCount: studentAttempts.length,
      bestScore,
      latestStation: latestAttempt?.stationTitle || 'لم تبدأ بعد',
      hasMessage: !!message,
    };
  });

  if (grade) {
    results = results.filter((s) => s.grade === Number(grade));
  }
  if (className) {
    results = results.filter((s) => s.className.toLowerCase().includes(String(className).toLowerCase()));
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter((s) => s.fullName.toLowerCase().includes(q) || s.className.toLowerCase().includes(q));
  }

  res.json({ students: results });
});

app.get('/api/teacher/students/:id', requireTeacher, (req, res) => {
  const student = db.students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'الطالبة غير موجودة' });
  }
  const attempts = db.attempts.filter((a) => a.studentId === student.id);
  const message = db.messages.find((m) => m.studentId === student.id);
  res.json({ student, attempts, message });
});

// Aggregated Reports
app.get('/api/teacher/reports', requireTeacher, (_req, res) => {
  const totalStudents = db.students.length;
  const totalAttempts = db.attempts.length;
  const avgScore = totalStudents > 0
    ? Math.round(db.students.reduce((acc, s) => acc + s.totalPoints, 0) / totalStudents)
    : 0;

  const gradeDistribution: Record<string, number> = {
    'الصف الأول': 0,
    'الصف الثاني': 0,
    'الصف الثالث': 0,
    'الصف الرابع': 0,
    'الصف الخامس': 0,
    'الصف السادس': 0,
  };

  db.students.forEach((s) => {
    const gradeLabels: Record<number, string> = {
      1: 'الصف الأول',
      2: 'الصف الثاني',
      3: 'الصف الثالث',
      4: 'الصف الرابع',
      5: 'الصف الخامس',
      6: 'الصف السادس',
    };
    const label = gradeLabels[s.grade] || `الصف ${s.grade}`;
    gradeDistribution[label] = (gradeDistribution[label] || 0) + 1;
  });

  const stationCompletionCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  db.students.forEach((s) => {
    s.completedStations.forEach((stNum) => {
      stationCompletionCounts[stNum] = (stationCompletionCounts[stNum] || 0) + 1;
    });
  });

  // Calculate most missed questions
  const questionMissStats: Record<string, { wrongCount: number; totalAnswers: number; text: string; stationId: number }> = {};
  db.attempts.forEach((a) => {
    a.answers.forEach((ans) => {
      if (!questionMissStats[ans.questionId]) {
        questionMissStats[ans.questionId] = {
          wrongCount: 0,
          totalAnswers: 0,
          text: ans.questionText,
          stationId: a.stationId,
        };
      }
      questionMissStats[ans.questionId].totalAnswers += 1;
      if (!ans.isCorrect) {
        questionMissStats[ans.questionId].wrongCount += 1;
      }
    });
  });

  const mostMissedQuestions = Object.entries(questionMissStats)
    .filter(([_, stats]) => stats.wrongCount > 0)
    .map(([qId, stats]) => ({
      questionId: qId,
      questionText: stats.text,
      stationId: stats.stationId,
      wrongCount: stats.wrongCount,
      totalAnswers: stats.totalAnswers,
    }))
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 5);

  res.json({
    analytics: {
      totalStudents,
      totalAttempts,
      averageScore: avgScore,
      gradeDistribution,
      stationCompletionCounts,
      mostMissedQuestions,
    },
  });
});

// Question Bank Management
app.get('/api/teacher/questions', requireTeacher, (_req, res) => {
  res.json({ questions: db.questions });
});

app.post('/api/teacher/questions', requireTeacher, (req, res) => {
  const newQ = req.body;
  if (!newQ.questionText || !newQ.correctAnswer || !newQ.stationId) {
    return res.status(400).json({ error: 'بيانات السؤال غير مكتملة' });
  }
  const q: Question = {
    id: 'q_custom_' + Date.now(),
    stationId: Number(newQ.stationId),
    questionText: newQ.questionText,
    questionType: newQ.questionType || 'multiple_choice',
    options: newQ.options || [],
    correctAnswer: newQ.correctAnswer,
    explanation: newQ.explanation || '',
    points: Number(newQ.points) || 5,
    gradeLevels: Array.isArray(newQ.gradeLevels) ? newQ.gradeLevels : [1, 2, 3, 4, 5, 6],
    difficulty: newQ.difficulty || 'medium',
    version: 1,
    isActive: true,
    sortOrder: (db.questions.length || 0) + 1,
  };
  db.questions.push(q);
  saveDb(db);
  res.json({ success: true, question: q });
});

app.put('/api/teacher/questions/:id', requireTeacher, (req, res) => {
  const index = db.questions.findIndex((q) => q.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'السؤال غير موجود' });
  }
  const oldQ = db.questions[index];
  db.questions[index] = {
    ...oldQ,
    ...req.body,
    version: (oldQ.version || 1) + 1, // increment version so previous attempts preserve version consistency
  };
  saveDb(db);
  res.json({ success: true, question: db.questions[index] });
});

app.delete('/api/teacher/questions/:id', requireTeacher, (req, res) => {
  const index = db.questions.findIndex((q) => q.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'السؤال غير موجود' });
  }
  db.questions.splice(index, 1);
  saveDb(db);
  res.json({ success: true });
});

// CSV / Excel Export endpoint
app.get('/api/teacher/export-csv', requireTeacher, (_req, res) => {
  let csv = '\uFEFF'; // UTF-8 BOM for Arabic in Excel
  csv += 'المعرف,الاسم الثلاثي,الصف,الفصل,إجمالي النقاط,المحطات المكتملة,الشارات,تاريخ التسجيل\n';

  const gradeNames: Record<number, string> = {
    1: 'الأول الابتدائي',
    2: 'الثاني الابتدائي',
    3: 'الثالث الابتدائي',
    4: 'الرابع الابتدائي',
    5: 'الخامس الابتدائي',
    6: 'السادس الابتدائي',
  };

  db.students.forEach((s) => {
    const row = [
      `"${s.id}"`,
      `"${s.fullName}"`,
      `"${gradeNames[s.grade] || s.grade}"`,
      `"${s.className}"`,
      s.totalPoints,
      `"${s.completedStations.join('، ')}"`,
      `"${s.badges.join('، ')}"`,
      `"${new Date(s.createdAt).toLocaleDateString('ar-SA')}"`,
    ];
    csv += row.join(',') + '\n';
  });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="health_heroes_students.csv"');
  res.send(csv);
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
