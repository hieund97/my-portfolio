import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { HiCheck, HiLocationMarker, HiMail, HiPaperAirplane, HiPhone, HiX } from 'react-icons/hi';
import Turnstile from 'react-turnstile';
import { useLanguage } from '../../contexts/LanguageContext';
import { messagesService } from '../../services/api';

const Contact = ({ profile = {} }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', _h_: '' });
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple honeypot check on client (optional, backend also checks)
    if (formData._h_) {
      setStatus({ type: 'error', message: 'Spam detected' });
      return;
    }

    if (!turnstileToken) {
      setStatus({ type: 'error', message: 'Please complete the security verification' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await messagesService.send({ ...formData, turnstileToken });
      setStatus({ type: 'success', message: t('contact.form.success') });
      setFormData({ name: '', email: '', subject: '', message: '', _h_: '' });
      // The Turnstile widget will need to be reset if the user wants to send another message, 
      // but usually, it's one message per page load or we can manually reset it.
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.error || t('contact.form.error') });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: HiMail, label: t('contact.email'), value: profile.email, href: `mailto:${profile.email}` },
    { icon: HiPhone, label: t('contact.phone'), value: profile.phone, href: `tel:${profile.phone}` },
    { icon: HiLocationMarker, label: t('contact.location'), value: profile.location },
  ].filter(item => item.value);

  return (
    <section id="contact" className="section bg-slate-50/50 dark:bg-slate-900/50">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="badge mb-4"
            >
              {t('contact.badge')}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-display font-bold"
            >
              {t('contact.title')} <span className="gradient-text">{t('contact.titleHighlight')}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto mt-4 text-slate-600 dark:text-slate-400"
            >
              {t('contact.description')}
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-8">{t('contact.getInTouch')}</h3>
              
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800/50 shadow-sm border border-slate-100 dark:border-slate-700/50"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 text-primary-600 dark:text-primary-400">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-500">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-medium hover:text-primary-600 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot field (hidden from users) */}
                <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                  <input
                    type="text"
                    name="_h_"
                    value={formData._h_}
                    onChange={handleChange}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">{t('contact.form.name')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">{t('contact.form.email')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">{t('contact.form.subject')}</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input"
                    placeholder={t('contact.form.subjectPlaceholder')}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">{t('contact.form.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                {/* Cloudflare Turnstile */}
                <div className="flex justify-center md:justify-start">
                  <Turnstile
                    sitekey="1x00000000000000000000AA"
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
                    {status.type === 'success' ? <HiCheck className="w-5 h-5" /> : <HiX className="w-5 h-5" />}
                    <span className="text-sm">{status.message}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('contact.form.sending')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <HiPaperAirplane className="w-5 h-5" />
                      {t('contact.form.send')}
                    </span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
