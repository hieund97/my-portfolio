import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  HiArrowLeft,
  HiArrowRight,
  HiCalendar,
  HiCheck,
  HiCurrencyDollar,
  HiLightningBolt,
  HiMail,
  HiUser,
  HiX,
} from 'react-icons/hi';
import Turnstile from 'react-turnstile';
import { useLanguage } from '../../contexts/LanguageContext';
import { VND_RATE, websiteTypes } from '../../data/pricingConfig';
import { messagesService } from '../../services/api';

const AnimatedPrice = ({ value, language }) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const end = value;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formatted = useMemo(() => {
    if (language === 'vi') {
      return `${(display * VND_RATE).toLocaleString('vi-VN')}₫`;
    }
    return `$${display.toLocaleString('en-US')}`;
  }, [display, language]);

  return <span>{formatted}</span>;
};

const PriceCalculator = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { t, language } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [budget, setBudget] = useState('');
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const STEPS = useMemo(
    () => [
      { id: 1, label: t('pricing.steps.projectType') },
      { id: 2, label: t('pricing.steps.features') },
      { id: 3, label: t('pricing.steps.budget') },
      { id: 4, label: t('pricing.steps.contact') },
    ],
    [t]
  );

  const selectedTypeData = useMemo(
    () => websiteTypes.find((wt) => wt.id === selectedType),
    [selectedType]
  );

  const totalPrice = useMemo(() => {
    if (!selectedTypeData) return 0;
    const featuresPrice = selectedFeatures.reduce((sum, featureId) => {
      const feature = selectedTypeData.features.find((f) => f.id === featureId);
      return sum + (feature?.price || 0);
    }, 0);
    return selectedTypeData.basePrice + featuresPrice;
  }, [selectedTypeData, selectedFeatures]);

  const timeline = useMemo(() => {
    if (!selectedTypeData) return { min: 0, max: 0 };
    const min = selectedTypeData.baseDays + selectedFeatures.length * 2;
    const max = selectedTypeData.baseDays + selectedFeatures.length * 4;
    return { min, max };
  }, [selectedTypeData, selectedFeatures]);

  const formatPrice = useCallback(
    (usd) => {
      if (language === 'vi') {
        return `${(usd * VND_RATE).toLocaleString('vi-VN')}₫`;
      }
      return `$${usd.toLocaleString('en-US')}`;
    },
    [language]
  );

  const toggleFeature = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((f) => f !== featureId) : [...prev, featureId]
    );
  };

  const canProceed = () => {
    if (currentStep === 1) return !!selectedType;
    return true;
  };

  const handleTypeSelect = (typeId) => {
    if (typeId !== selectedType) setSelectedFeatures([]);
    setSelectedType(typeId);
  };

  const goNext = () => {
    if (canProceed() && currentStep < 4) setCurrentStep((s) => s + 1);
  };
  const goPrev = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleGetQuote = async () => {
    if (!turnstileToken) {
      setStatus({ type: 'error', message: t('contact.form.error') || 'Please complete security verification' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const summary = `
Website Type: ${t(selectedTypeData.nameKey)}
Features: ${selectedFeatures.map((id) => t(selectedTypeData.features.find((f) => f.id === id)?.nameKey)).join(', ')}
Budget Range: ${budget}
Estimated Price: ${formatPrice(totalPrice)}
Timeline: ${timeline.min}-${timeline.max} ${t('pricing.days')}
User Message: ${contact.message}
      `.trim();

      await messagesService.send({
        name: contact.name,
        email: contact.email,
        subject: `Project Inquiry: ${t(selectedTypeData.nameKey)}`,
        message: summary,
        turnstileToken,
      });

      setStatus({ type: 'success', message: t('contact.form.success') });
      // Reset after success
      setContact({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || t('contact.form.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  const budgetRanges = t('pricing.budgetRanges', { returnObjects: true }) || [];

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <section
      id="pricing"
      className="relative py-24 bg-white dark:bg-[#0B0F19] overflow-hidden transition-colors duration-500"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/20 dark:bg-primary-900/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-200/20 dark:bg-cyan-900/15 rounded-full blur-[120px]" />
      </div>

      <div className="container-custom relative z-10 w-full max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-block uppercase tracking-[0.2em] text-xs font-semibold text-primary-600 dark:text-cyan-400 mb-3"
            >
              {t('pricing.badge')}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white"
            >
              {t('pricing.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="max-w-xl mx-auto mt-4 text-slate-500 dark:text-slate-400"
            >
              {t('pricing.subtitle')}
            </motion.p>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Left: Step Form */}
            <div className="lg:col-span-3">
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-10 px-2">
                {STEPS.map((step, i) => (
                  <div key={step.id} className="flex items-center flex-1 last:flex-none">
                    <button
                      onClick={() => {
                        if (step.id <= currentStep || (step.id === 2 && selectedType))
                          setCurrentStep(step.id);
                      }}
                      className={`flex items-center gap-2 cursor-pointer transition-colors duration-200 ${
                        currentStep >= step.id
                          ? 'text-primary-600 dark:text-cyan-400'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          currentStep > step.id
                            ? 'bg-primary-600 dark:bg-cyan-500 text-white'
                            : currentStep === step.id
                            ? 'bg-primary-100 dark:bg-cyan-400/20 text-primary-600 dark:text-cyan-400 ring-2 ring-primary-400 dark:ring-cyan-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        {currentStep > step.id ? <HiCheck className="w-4 h-4" /> : step.id}
                      </div>
                      <span className="hidden sm:block text-sm font-medium">{step.label}</span>
                    </button>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-px mx-3 transition-colors duration-300 ${
                          currentStep > step.id
                            ? 'bg-primary-400 dark:bg-cyan-500'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="min-h-[380px] relative">
                <AnimatePresence mode="wait">
                  {/* Step 1: Project Type */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                        {t('pricing.step1Title')}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {websiteTypes.map((type) => {
                          const Icon = type.icon;
                          const isSelected = selectedType === type.id;
                          return (
                            <button
                              key={type.id}
                              onClick={() => handleTypeSelect(type.id)}
                              className={`relative cursor-pointer p-5 rounded-2xl text-left transition-all duration-200 border group ${
                                isSelected
                                  ? 'bg-primary-50 dark:bg-cyan-500/10 border-primary-300 dark:border-cyan-500/40 shadow-lg shadow-primary-500/10 dark:shadow-cyan-500/10'
                                  : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:border-primary-200 dark:hover:border-white/15 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className={`p-3 rounded-xl transition-colors duration-200 ${
                                    isSelected
                                      ? 'bg-primary-100 dark:bg-cyan-500/20 text-primary-600 dark:text-cyan-400'
                                      : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-primary-500'
                                  }`}
                                >
                                  <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-800 dark:text-white">
                                    {t(type.nameKey)}
                                  </h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                    {t(type.descKey)}
                                  </p>
                                  <p className="text-sm font-medium text-primary-600 dark:text-cyan-400 mt-2">
                                    {t('pricing.from')} {formatPrice(type.basePrice)}
                                  </p>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 dark:bg-cyan-500 rounded-full flex items-center justify-center">
                                  <HiCheck className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Features */}
                  {currentStep === 2 && selectedTypeData && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                        {t('pricing.step2Title')} {t(selectedTypeData.nameKey)}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        {t('pricing.step2Desc')}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {selectedTypeData.features.map((feature) => {
                          const isSelected = selectedFeatures.includes(feature.id);
                          return (
                            <button
                              key={feature.id}
                              onClick={() => toggleFeature(feature.id)}
                              className={`cursor-pointer px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-primary-50 dark:bg-cyan-500/10 border-primary-300 dark:border-cyan-500/40 text-primary-700 dark:text-cyan-300 shadow-sm'
                                  : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-primary-200 dark:hover:border-white/15'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-primary-500 dark:bg-cyan-500'
                                    : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                              >
                                {isSelected && <HiCheck className="w-3.5 h-3.5 text-white" />}
                              </div>
                              {t(feature.nameKey)}
                              <span className="text-xs opacity-60">+{formatPrice(feature.price)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Budget */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                        {t('pricing.step3Title')}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        {t('pricing.step3Desc')}
                      </p>
                      <div className="flex flex-col gap-3 max-w-md">
                        {Array.isArray(budgetRanges) &&
                          budgetRanges.map((range) => (
                            <button
                              key={range}
                              onClick={() => setBudget(range)}
                              className={`cursor-pointer px-5 py-3.5 rounded-xl text-left text-sm font-medium transition-all duration-200 border ${
                                budget === range
                                  ? 'bg-primary-50 dark:bg-cyan-500/10 border-primary-300 dark:border-cyan-500/40 text-primary-700 dark:text-cyan-300'
                                  : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-primary-200 dark:hover:border-white/15'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <HiCurrencyDollar
                                  className={`w-5 h-5 ${
                                    budget === range
                                      ? 'text-primary-500 dark:text-cyan-400'
                                      : 'text-slate-400'
                                  }`}
                                />
                                {range}
                              </div>
                            </button>
                          ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Contact */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                        {t('pricing.step4Title')}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        {t('pricing.step4Desc')}
                      </p>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <HiUser className="w-4 h-4" /> {t('pricing.name')}
                          </label>
                          <input
                            type="text"
                            value={contact.name}
                            onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-cyan-500 focus:border-transparent transition-all"
                            placeholder={t('pricing.namePlaceholder')}
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <HiMail className="w-4 h-4" /> {t('pricing.email')}
                          </label>
                          <input
                            type="email"
                            value={contact.email}
                            onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-cyan-500 focus:border-transparent transition-all"
                            placeholder={t('pricing.emailPlaceholder')}
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <HiLightningBolt className="w-4 h-4" /> {t('pricing.projectDetails')}
                          </label>
                          <textarea
                            value={contact.message}
                            onChange={(e) => setContact((p) => ({ ...p, message: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                            placeholder={t('pricing.projectDetailsPlaceholder')}
                          />
                        </div>

                        {/* Cloudflare Turnstile */}
                        <div className="flex justify-center md:justify-start pt-2">
                          <Turnstile
                            sitekey="0x4AAAAAACRemh9BLpQR9RqW"
                            onVerify={(token) => setTurnstileToken(token)}
                          />
                        </div>

                        {/* Status message */}
                        {status.message && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center gap-2 p-4 rounded-xl ${
                              status.type === 'success'
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            }`}
                          >
                            {status.type === 'success' ? (
                              <HiCheck className="w-5 h-5" />
                            ) : (
                              <HiX className="w-5 h-5" />
                            )}
                            <span className="text-sm">{status.message}</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={goPrev}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    currentStep === 1
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <HiArrowLeft className="w-4 h-4" /> {t('pricing.back')}
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={goNext}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      canProceed()
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 shadow-lg'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {t('pricing.next')} <HiArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleGetQuote}
                    disabled={loading || !contact.name || !contact.email}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      loading || !contact.name || !contact.email
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white hover:scale-105 shadow-lg'
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        {t('contact.form.sending')}
                      </>
                    ) : (
                      <>
                        {t('pricing.getQuote')} <HiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right: Live Estimate Panel */}
            <div className="lg:col-span-2 lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-primary-500/20 to-cyan-500/20 rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <div className="estimate-panel rounded-2xl p-8 border border-slate-200 dark:border-white/10 group-hover:border-primary-200 dark:group-hover:border-white/20 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <HiLightningBolt className="w-5 h-5 text-primary-500 dark:text-cyan-400" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                      {t('pricing.estimateTitle')}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                      {t('pricing.estimatedPrice')}
                    </p>
                    <div className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-600 dark:from-primary-400 dark:to-cyan-400">
                      <AnimatedPrice value={totalPrice} language={language} />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                    <HiCalendar className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {timeline.min > 0
                          ? `~${timeline.min} – ${timeline.max} ${t('pricing.days')}`
                          : t('pricing.selectType')}
                      </p>
                      <p className="text-xs text-slate-400">{t('pricing.estimatedDelivery')}</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      {t('pricing.summary')}
                    </p>
                    <div className="space-y-2 text-sm">
                      {selectedTypeData ? (
                        <>
                          <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>{t(selectedTypeData.nameKey)}</span>
                            <span className="font-medium">{formatPrice(selectedTypeData.basePrice)}</span>
                          </div>
                          {selectedFeatures.map((featureId) => {
                            const feature = selectedTypeData.features.find((f) => f.id === featureId);
                            if (!feature) return null;
                            return (
                              <div
                                key={featureId}
                                className="flex justify-between text-slate-500 dark:text-slate-500"
                              >
                                <span className="flex items-center gap-1.5">
                                  <HiCheck className="w-3.5 h-3.5 text-primary-500 dark:text-cyan-400" />
                                  {t(feature.nameKey)}
                                </span>
                                <span>+{formatPrice(feature.price)}</span>
                              </div>
                            );
                          })}
                          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/5 flex justify-between font-semibold text-slate-800 dark:text-white">
                            <span>{t('pricing.total')}</span>
                            <span>{formatPrice(totalPrice)}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-slate-400 dark:text-slate-600">
                          {t('pricing.selectTypePrompt')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .estimate-panel {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .dark .estimate-panel {
          background: rgba(15, 23, 42, 0.6) !important;
        }
      `,
        }}
      />
    </section>
  );
};

export default PriceCalculator;
