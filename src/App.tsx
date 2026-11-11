import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { AmbientBackground } from './components/AmbientBackground.tsx';
import { WelcomeView } from './components/WelcomeView.tsx';
import { VideoView } from './components/VideoView.tsx';
import { RegistrationView } from './components/RegistrationView.tsx';
import { AdventureMap } from './components/AdventureMap.tsx';
import { Station1Detective } from './components/stations/Station1Detective.tsx';
import { Station2Plate } from './components/stations/Station2Plate.tsx';
import { Station3EarlyDetection } from './components/stations/Station3EarlyDetection.tsx';
import { Station4Activity } from './components/stations/Station4Activity.tsx';
import { Station5HomeAmbassador } from './components/stations/Station5HomeAmbassador.tsx';
import { Station6MathChallenge } from './components/stations/Station6MathChallenge.tsx';
import { CertificateView } from './components/CertificateView.tsx';
import { NationalSection } from './components/NationalSection.tsx';
import { TeacherDashboard } from './components/TeacherDashboard.tsx';
import { sound } from './utils/numerals.ts';
import { DataService } from './services/dataService.ts';
import type { Student, SiteSettings, Question, Attempt } from './types/index.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'video' | 'register' | 'map' | 'station' | 'national' | 'certificate'>('welcome');
  const [activeStationId, setActiveStationId] = useState<number>(1);
  const [stationQuestions, setStationQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [student, setStudent] = useState<Student | null>(() => {
    try {
      const saved = localStorage.getItem('active_student');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [settings, setSettings] = useState<SiteSettings>({
    welcomeTitle: 'صحتكِ كنز.. فاحفظيها بالوعي',
    welcomeSubtitle: 'كل اختيار صحي اليوم، يصنع حياة أجمل غدًا',
    welcomeQuotes: [
      'صحتكِ كنز.. فاحفظيها بالوعي',
      'كل اختيار صحي اليوم، يصنع حياة أجمل غدًا',
      'كوني بطلة الوعي الصحي، وانشري المعرفة والوقاية بين أسرتكِ ومجتمعكِ',
      'أهلًا بكِ يا بطلة الصحة!',
    ],
    videoPath: '',
    videoTitle: 'مقدمة توعوية: ما هو السكري وكيف نعتني بصحتنا؟',
    videoDescription: 'مقطع تعريفي شيق وملهم يوضح أهمية نمط الحياة الصحي وأساسيات التوعية الصحية لطالبات الابتدائي.',
    videoThumbnail: '',
    videoRequired: false,
    logoUrl: '',
    mascotVisible: true,
    schoolName: 'المدرسة الابتدائية ٣١١',
    teacherName: 'أ. خلود الحريصي',
  });

  const [isTeacherOpen, setIsTeacherOpen] = useState(false);

  // Load site settings on initial mount
  useEffect(() => {
    DataService.getSettings().then((s) => {
      setSettings(s);
    });
  }, []);

  // Fetch questions for active station and student's grade
  const loadStationQuestions = async (stationId: number, grade: number) => {
    setLoadingQuestions(true);
    try {
      const qList = await DataService.getQuestions(stationId, grade as any);
      setStationQuestions(qList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSelectStation = async (stationId: number) => {
    if (!student) {
      setCurrentView('register');
      return;
    }
    setActiveStationId(stationId);
    await loadStationQuestions(stationId, student.grade);
    sound.playClick();
    setCurrentView('station');
  };

  const handleStationComplete = (
    _attempt: Attempt,
    updatedStudent: Student,
    _newBadge?: string
  ) => {
    setStudent(updatedStudent);
    localStorage.setItem('active_student', JSON.stringify(updatedStudent));
    setCurrentView('map');
  };

  const handleRegisterSuccess = (newStudent: Student) => {
    setStudent(newStudent);
    localStorage.setItem('active_student', JSON.stringify(newStudent));
    setCurrentView('map');
  };

  const renderStation = () => {
    if (!student) return null;

    switch (activeStationId) {
      case 1:
        return (
          <Station1Detective
            student={student}
            questions={stationQuestions}
            onComplete={handleStationComplete}
            onBackToMap={() => setCurrentView('map')}
          />
        );
      case 2:
        return (
          <Station2Plate
            student={student}
            questions={stationQuestions}
            onComplete={handleStationComplete}
            onBackToMap={() => setCurrentView('map')}
          />
        );
      case 3:
        return (
          <Station3EarlyDetection
            student={student}
            questions={stationQuestions}
            onComplete={handleStationComplete}
            onBackToMap={() => setCurrentView('map')}
          />
        );
      case 4:
        return (
          <Station4Activity
            student={student}
            questions={stationQuestions}
            onComplete={handleStationComplete}
            onBackToMap={() => setCurrentView('map')}
          />
        );
      case 5:
        return (
          <Station5HomeAmbassador
            student={student}
            questions={stationQuestions}
            onComplete={handleStationComplete}
            onBackToMap={() => setCurrentView('map')}
          />
        );
      case 6:
        return (
          <Station6MathChallenge
            student={student}
            questions={stationQuestions}
            onComplete={handleStationComplete}
            onBackToMap={() => setCurrentView('map')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-['Tajawal',sans-serif] relative selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden">
      {/* Gentle Floating Health Symbols & Ambient Glow */}
      <AmbientBackground />

      {/* Official Header */}
      <Header
        settings={settings}
        student={student}
        onOpenTeacherModal={() => setIsTeacherOpen(true)}
        onNavigateHome={() => setCurrentView('welcome')}
        onNavigateMap={() => student && setCurrentView('map')}
        onNavigateNational={() => student && setCurrentView('national')}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full relative z-10 flex flex-col">
        {currentView === 'welcome' && (
          <WelcomeView
            settings={settings}
            onStart={() => {
              if (student) {
                setCurrentView('map');
              } else {
                setCurrentView('video');
              }
            }}
          />
        )}

        {currentView === 'video' && (
          <VideoView
            settings={settings}
            onContinue={() => {
              if (student) {
                setCurrentView('map');
              } else {
                setCurrentView('register');
              }
            }}
          />
        )}

        {currentView === 'register' && (
          <RegistrationView onRegisterSuccess={handleRegisterSuccess} />
        )}

        {currentView === 'map' && student && (
          <AdventureMap
            student={student}
            onSelectStation={handleSelectStation}
            onGoToCertificate={() => setCurrentView('certificate')}
            onGoToNational={() => setCurrentView('national')}
          />
        )}

        {currentView === 'station' && renderStation()}

        {currentView === 'national' && student && (
          <NationalSection
            student={student}
            onUpdateStudent={(updated) => {
              setStudent(updated);
              localStorage.setItem('active_student', JSON.stringify(updated));
            }}
            onBackToMap={() => setCurrentView('map')}
            onGoToCertificate={() => setCurrentView('certificate')}
          />
        )}

        {currentView === 'certificate' && student && (
          <CertificateView
            student={student}
            settings={settings}
            onBackToMap={() => setCurrentView('map')}
          />
        )}
      </main>

      {/* Official Footer with Teacher Kholoud Al-Huraissi credentials */}
      <Footer settings={settings} />

      {/* Protected Teacher Dashboard Modal */}
      <TeacherDashboard
        settings={settings}
        isOpen={isTeacherOpen}
        onClose={() => setIsTeacherOpen(false)}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
      />
    </div>
  );
}
