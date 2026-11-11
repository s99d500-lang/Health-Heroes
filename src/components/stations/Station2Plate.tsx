import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { NabdhMascot } from '../NabdhMascot.tsx';
import { Utensils, CheckCircle2, ArrowLeft, Award, Sparkles, AlertCircle, Droplets, Apple, Wheat, Beef } from 'lucide-react';
import { sound, toArabicNumerals } from '../../utils/numerals.ts';
import { DataService } from '../../services/dataService.ts';
import type { Student, Question, Attempt } from '../../types/index.ts';

interface Station2PlateProps {
  student: Student;
  questions: Question[];
  onComplete: (attempt: Attempt, updatedStudent: Student, newBadge?: string) => void;
  onBackToMap: () => void;
}

interface FoodItem {
  id: string;
  name: string;
  icon: string;
  category: 'veg_fruit' | 'protein' | 'grain' | 'water' | 'sugary';
  categoryLabel: string;
  feedback: string;
  isHealthy: boolean;
}

const FOOD_BASKET: FoodItem[] = [
  { id: 'f-apple', name: 'تفاحة حمراء', icon: '🍎', category: 'veg_fruit', categoryLabel: 'فواكه وخضراوات', feedback: 'ممتاز! الفواكه غنية بالفيتامينات والألياف الصحية الطبيعية.', isHealthy: true },
  { id: 'f-cucumber', name: 'خيار طازج', icon: '🥒', category: 'veg_fruit', categoryLabel: 'فواكه وخضراوات', feedback: 'رائع! الخيار غني بالماء والألياف وقليل السعرات.', isHealthy: true },
  { id: 'f-carrot', name: 'جزر مقرمش', icon: '🥕', category: 'veg_fruit', categoryLabel: 'فواكه وخضراوات', feedback: 'أحسنتِ! الجزر يقوي النظر وغني بمضادات الأكسدة.', isHealthy: true },
  { id: 'f-egg', name: 'بيض مسلوق', icon: '🥚', category: 'protein', categoryLabel: 'بروتين صحي', feedback: 'بطلة! البيض مصدر ممتاز للبروتين الذي يبني العضلات.', isHealthy: true },
  { id: 'f-fish', name: 'سمك مشوي', icon: '🐟', category: 'protein', categoryLabel: 'بروتين صحي', feedback: 'اختيار ذكي! الأسماك غنية بالأوميغا-٣ والبروتين الخفيف.', isHealthy: true },
  { id: 'f-bread', name: 'خبز الحبوب الكاملة', icon: '🍞', category: 'grain', categoryLabel: 'حبوب كاملة', feedback: 'ممتاز! الحبوب الكاملة تمدنا بالطاقة ببطء وتحافظ على استقرار السكر.', isHealthy: true },
  { id: 'f-rice', name: 'أرز بني', icon: '🍚', category: 'grain', categoryLabel: 'حبوب كاملة', feedback: 'رائع! الأرز البني يحتوي على ألياف مفيدة للهضم.', isHealthy: true },
  { id: 'f-milk', name: 'حليب قليل الدسم', icon: '🥛', category: 'water', categoryLabel: 'منتجات الألبان', feedback: 'أحسنتِ! الحليب غني بالكالسيوم لبناء عظام وأسنان قوية.', isHealthy: true },
  { id: 'f-water', name: 'ماء نقي', icon: '💧', category: 'water', categoryLabel: 'ماء وترطيب', feedback: 'الخيار الذهبي! الماء هو المشروب الأفضل للجسم دائماً.', isHealthy: true },
  { id: 'f-candy', name: 'حلوى وسكاكر', icon: '🍬', category: 'sugary', categoryLabel: 'سكريات مضافة', feedback: 'تنبيه! السكريات سريعة الامتصاص ولا تمنح الجسم قيمة غذائية مفيدة.', isHealthy: false },
  { id: 'f-soda', name: 'مشروب غازي محلى', icon: '🥤', category: 'sugary', categoryLabel: 'مشروبات محلاة', feedback: 'تنبيه! المشروبات الغازية ترفع سكر الدم بسرعة وتسبب تسوس الأسنان.', isHealthy: false },
];

export const Station2Plate: React.FC<Station2PlateProps> = ({
  student,
  questions,
  onComplete,
  onBackToMap,
}) => {
  const [plateItems, setPlateItems] = useState<FoodItem[]>([]);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'plate' | 'quiz'>('plate');
  const [submitting, setSubmitting] = useState(false);

  const handleAddFood = (item: FoodItem) => {
    if (plateItems.some((i) => i.id === item.id)) {
      // Remove from plate
      setPlateItems((prev) => prev.filter((i) => i.id !== item.id));
      sound.playClick();
      return;
    }

    if (!item.isHealthy) {
      sound.playWrong();
      setActiveFeedback(`⚠️ ${item.name}: ${item.feedback} يفضل استبدالها ببديل صحي!`);
    } else {
      sound.playCorrect();
      setActiveFeedback(`✨ ${item.name}: ${item.feedback}`);
    }

    setPlateItems((prev) => [...prev, item]);
  };

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    sound.playClick();
  };

  const vegCount = plateItems.filter((i) => i.category === 'veg_fruit').length;
  const proteinCount = plateItems.filter((i) => i.category === 'protein').length;
  const grainCount = plateItems.filter((i) => i.category === 'grain').length;
  const waterCount = plateItems.filter((i) => i.category === 'water').length;
  const hasSugary = plateItems.some((i) => i.category === 'sugary');
  const isPlateBalanced = vegCount >= 1 && proteinCount >= 1 && grainCount >= 1 && waterCount >= 1 && !hasSugary;

  const handleFinishStation = async () => {
    setSubmitting(true);
    try {
      const answersPayload = questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: userAnswers[q.id] || '',
      }));

      const result = await DataService.submitAttempt(
        student,
        2,
        answersPayload,
        isPlateBalanced || plateItems.length >= 4
      );

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      sound.playBadge();
      onComplete(result.attempt, result.updatedStudent, result.newBadge);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-teal-200 shadow-xs">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-bold text-sm bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>العودة للخريطة</span>
        </button>

        <div className="flex items-center gap-2 text-right">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
            ٢
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800">محطة مصممة الطبق الصحي</h2>
            <span className="text-xs text-emerald-600 font-bold">الشارة: خبيرة الغذاء 🥗</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('plate')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs md:text-sm border transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'plate'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>١. تصميم الطبق الصحي التفاعلي</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs md:text-sm border transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-amber-500 text-teal-950 border-amber-500 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>٢. أسئلة خبيرة الغذاء والنقاط</span>
        </button>
      </div>

      {activeTab === 'plate' && (
        <div className="space-y-6">
          {/* Plate Visual & Food Basket Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 3D Healthy Plate Simulator (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-lg text-center space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <span className="text-xs font-bold text-slate-500">
                  انقري على الأطعمة من السلة لإضافتها أو إزالتها
                </span>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {isPlateBalanced ? '✨ طبق متوازن ومثالي!' : 'كوني طبقًا متوازنًا'}
                </span>
              </div>

              {/* Plate Container SVG/CSS 3D */}
              <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-slate-100 bg-radial from-slate-50 to-white shadow-[0_15px_35px_rgba(16,185,129,0.15)] flex items-center justify-center p-2">
                {/* Plate Quadrants Dividers */}
                <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-dashed border-teal-200/80 pointer-events-none grid grid-cols-2 grid-rows-2">
                  {/* Top Right: Half is Veg & Fruit */}
                  <div className="col-span-1 row-span-2 bg-emerald-50/40 p-2 flex flex-col items-center justify-center border-l-2 border-dashed border-teal-200/80">
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-full mb-1">
                      نصف الطبق: خضار وفواكه
                    </span>
                    <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
                      {plateItems
                        .filter((i) => i.category === 'veg_fruit')
                        .map((item) => (
                          <span key={item.id} className="text-2xl animate-gentle-bounce" title={item.name}>
                            {item.icon}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Top Left: Grains */}
                  <div className="bg-amber-50/40 p-2 flex flex-col items-center justify-center border-b-2 border-dashed border-teal-200/80">
                    <span className="text-[10px] font-extrabold text-amber-800 bg-white/80 px-2 py-0.5 rounded-full mb-1">
                      ربع: حبوب كاملة
                    </span>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {plateItems
                        .filter((i) => i.category === 'grain')
                        .map((item) => (
                          <span key={item.id} className="text-2xl animate-gentle-bounce" title={item.name}>
                            {item.icon}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Bottom Left: Protein */}
                  <div className="bg-rose-50/40 p-2 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-extrabold text-rose-800 bg-white/80 px-2 py-0.5 rounded-full mb-1">
                      ربع: بروتين صحي
                    </span>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {plateItems
                        .filter((i) => i.category === 'protein')
                        .map((item) => (
                          <span key={item.id} className="text-2xl animate-gentle-bounce" title={item.name}>
                            {item.icon}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Hydration / Water Cup placed near the plate */}
                <div className="absolute -top-3 -left-3 bg-cyan-100 border-2 border-cyan-400 rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-md">
                  <span className="text-xs">💧</span>
                  <span className="text-[8px] font-extrabold text-cyan-900">ماء نقي</span>
                </div>

                {/* Any sugary warning */}
                {hasSugary && (
                  <div className="absolute -bottom-2 bg-rose-100 border-2 border-rose-400 text-rose-800 px-3 py-1 rounded-full text-xs font-black shadow-md animate-pulse">
                    ⚠️ حلوى / مشروب محلى مضاف
                  </div>
                )}
              </div>

              {/* Feedback Message Box */}
              {activeFeedback && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-xs md:text-sm text-teal-900 font-bold text-right flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{activeFeedback}</span>
                </div>
              )}

              {/* Clear Plate button */}
              {plateItems.length > 0 && (
                <button
                  onClick={() => setPlateItems([])}
                  className="text-xs text-slate-400 hover:text-slate-600 underline font-bold"
                >
                  إفراغ الطبق وإعادة الترتيب
                </button>
              )}
            </div>

            {/* Food Basket (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-lg text-right space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                  <span>سلة الأطعمة والمشروبات</span>
                  <span className="text-xl">🧺</span>
                </h3>
                <span className="text-xs text-teal-700 font-bold">
                  {toArabicNumerals(plateItems.length)} عناصر بالطبق
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {FOOD_BASKET.map((food) => {
                  const isInPlate = plateItems.some((i) => i.id === food.id);

                  return (
                    <button
                      key={food.id}
                      onClick={() => handleAddFood(food)}
                      className={`p-3 rounded-2xl border-2 text-right transition cursor-pointer flex flex-col justify-between ${
                        isInPlate
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs scale-102 ring-2 ring-emerald-200'
                          : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-2xl">{food.icon}</span>
                        {isInPlate ? (
                          <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                            في الطبق ✓
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">+ إضافة</span>
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-800">{food.name}</div>
                        <div className="text-[10px] text-slate-500">{food.categoryLabel}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Next step button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('quiz');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm md:text-base rounded-2xl shadow-md flex items-center justify-center gap-2 hover:shadow-lg transition cursor-pointer"
                >
                  <span>المتابعة إلى أسئلة خبيرة الغذاء</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Graded Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-lg space-y-6 text-right">
          <div>
            <h3 className="text-xl font-black text-emerald-950">أسئلة خبيرة الغذاء الصحي</h3>
            <p className="text-slate-600 text-xs md:text-sm mt-1">
              أجيبي عن الأسئلة لتأكيد معلوماتكِ الغذائية وحصد النقاط والشارة الذهبية!
            </p>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const currentSelected = userAnswers[q.id];

              return (
                <div key={q.id} className="p-4 md:p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {toArabicNumerals(idx + 1)}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                      {q.questionText}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt) => {
                      const isSelected = currentSelected === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, opt.id)}
                          className={`p-3 rounded-xl border-2 text-xs md:text-sm font-bold text-right transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                          }`}
                        >
                          <span>{opt.text}</span>
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'border-slate-300 text-slate-400'
                            }`}
                          >
                            {opt.id}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-bold">
              تم الإجابة عن: {toArabicNumerals(Object.keys(userAnswers).length)} من {toArabicNumerals(questions.length)} أسئلة
            </div>

            <button
              onClick={handleFinishStation}
              disabled={submitting || Object.keys(userAnswers).length === 0}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition cursor-pointer ${
                submitting || Object.keys(userAnswers).length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/20 active:scale-95'
              }`}
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>{submitting ? 'جاري الاعتماد...' : 'اعتماد الإجابات واستلام الشارة ✨'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
