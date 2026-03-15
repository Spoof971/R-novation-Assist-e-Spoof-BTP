/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Paintbrush, 
  Home, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Layout, 
  Compass,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { getRenovationAdvice, generateVisualIdea, RenovationAdvice } from './services/geminiService';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<RenovationAdvice | null>(null);
  const [images, setImages] = useState<Record<string, string>>({});
  const [generatingImages, setGeneratingImages] = useState<Record<string, boolean>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const result = await getRenovationAdvice(prompt);
      setAdvice(result);
      // Reset images when new advice comes
      setImages({});
      
      // Auto-generate first image for the first style
      if (result.styles.length > 0) {
        handleGenerateImage(result.styles[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async (style: string) => {
    if (images[style] || generatingImages[style]) return;

    setGeneratingImages(prev => ({ ...prev, [style]: true }));
    try {
      const imageUrl = await generateVisualIdea(prompt, style);
      if (imageUrl) {
        setImages(prev => ({ ...prev, [style]: imageUrl }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingImages(prev => ({ ...prev, [style]: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-paper/80 backdrop-blur-md border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white">
              <Home size={20} />
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight">Spoof BTP & Adhésif</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
            <a href="#" className="hover:text-accent transition-colors">Accueil</a>
            <a href="#" className="hover:text-accent transition-colors">Services</a>
            <a href="#" className="hover:text-accent transition-colors">Réalisations</a>
            <button className="bg-ink text-white px-6 py-2 rounded-full hover:bg-accent transition-all">
              Contact
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-paper pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-serif">
              <a href="#" onClick={() => setIsMenuOpen(false)}>Accueil</a>
              <a href="#" onClick={() => setIsMenuOpen(false)}>Services</a>
              <a href="#" onClick={() => setIsMenuOpen(false)}>Réalisations</a>
              <a href="#" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" 
              alt="Luxury Interior" 
              className="w-full h-full object-cover opacity-30"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-paper/0 via-paper/50 to-paper"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <span className="text-accent font-medium tracking-[0.3em] uppercase text-sm mb-4 block">
                Expertise & Innovation
              </span>
              <h1 className="text-6xl md:text-8xl font-light leading-[1.1] mb-8">
                Et si choisir votre <span className="italic">rénovation</span> devenait enfin simple ?
              </h1>
              <p className="text-lg text-ink/70 mb-10 max-w-xl leading-relaxed">
                Transformez vos idées en choix inspirants. Notre assistant IA vous aide à voir clair dans votre projet de décoration et d'architecture.
              </p>
              
              <form onSubmit={handleSubmit} className="relative max-w-2xl group">
                <input 
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Décrivez votre projet (ex: Rénover ma cuisine en style industriel...)"
                  className="w-full bg-white border border-ink/10 rounded-2xl px-8 py-6 pr-40 shadow-xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-lg"
                />
                <button 
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="absolute right-2 top-2 bottom-2 bg-ink text-white px-8 rounded-xl flex items-center gap-2 hover:bg-accent disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  <span>Explorer</span>
                </button>
              </form>
            </motion.div>
          </div>

          <div className="absolute right-0 bottom-20 hidden lg:block">
            <div className="vertical-text text-[10px] tracking-[0.5em] uppercase opacity-30 font-bold">
              Spoof BTP & Adhésif — 2026
            </div>
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {advice && (
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 bg-white"
              id="results"
            >
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                  {/* Text Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 text-accent mb-6">
                      <Sparkles size={24} />
                      <span className="uppercase tracking-widest text-sm font-bold">Analyse de l'IA</span>
                    </div>
                    <h2 className="text-5xl mb-8">{advice.title}</h2>
                    <p className="text-xl text-ink/70 leading-relaxed mb-12">
                      {advice.description}
                    </p>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl mb-4 flex items-center gap-2">
                          <Compass className="text-accent" /> Styles Recommandés
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {advice.styles.map((style) => (
                            <button
                              key={style}
                              onClick={() => handleGenerateImage(style)}
                              className={`px-6 py-3 rounded-full border transition-all flex items-center gap-2 ${
                                images[style] 
                                  ? 'bg-accent text-white border-accent' 
                                  : 'bg-paper border-ink/10 hover:border-accent'
                              }`}
                            >
                              {style}
                              {generatingImages[style] && <Loader2 className="animate-spin" size={14} />}
                              {images[style] && <CheckCircle2 size={14} />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl mb-4 flex items-center gap-2">
                          <Layout className="text-accent" /> Conseils d'Expert
                        </h3>
                        <ul className="space-y-4">
                          {advice.tips.map((tip, i) => (
                            <motion.li 
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + (i * 0.1) }}
                              className="flex gap-4 items-start p-4 bg-paper rounded-xl"
                            >
                              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-1">
                                {i + 1}
                              </div>
                              <p className="text-ink/80">{tip}</p>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  {/* Visuals Content */}
                  <div className="space-y-8">
                    <div className="aspect-[4/5] bg-paper rounded-3xl overflow-hidden relative shadow-2xl group">
                      {Object.values(images).length > 0 ? (
                        <AnimatePresence mode="wait">
                          {Object.entries(images).map(([style, url]) => (
                            <motion.div
                              key={style}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0"
                            >
                              <img 
                                src={url} 
                                alt={style} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg">
                                <span className="text-sm font-bold uppercase tracking-widest">{style}</span>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6">
                            <Paintbrush size={40} />
                          </div>
                          <h4 className="text-2xl mb-2">Visualisation</h4>
                          <p className="text-ink/50">Sélectionnez un style pour générer une idée visuelle personnalisée.</p>
                        </div>
                      )}
                      
                      {Object.values(generatingImages).some(Boolean) && (
                        <div className="absolute inset-0 bg-paper/60 backdrop-blur-sm flex items-center justify-center z-20">
                          <div className="flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-accent" size={48} />
                            <span className="font-medium tracking-widest uppercase text-xs">Génération de l'image...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-paper rounded-2xl border border-ink/5">
                        <span className="text-3xl font-serif block mb-1">30s</span>
                        <span className="text-xs uppercase tracking-widest text-ink/50">Temps d'analyse</span>
                      </div>
                      <div className="p-6 bg-paper rounded-2xl border border-ink/5">
                        <span className="text-3xl font-serif block mb-1">100%</span>
                        <span className="text-xs uppercase tracking-widest text-ink/50">Personnalisé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <section className="py-24 bg-paper">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-5xl mb-6">Pourquoi nous choisir ?</h2>
              <p className="text-ink/60">Nous combinons l'expertise du bâtiment avec la puissance de l'intelligence artificielle pour simplifier vos projets.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Vision Claire",
                  desc: "Ne soyez plus perdu dans les catalogues. Visualisez instantanément vos idées.",
                  icon: <Sparkles />
                },
                {
                  title: "Gain de Temps",
                  desc: "Passez de l'idée au projet concret en quelques secondes seulement.",
                  icon: <ArrowRight />
                },
                {
                  title: "Expertise BTP",
                  desc: "Des conseils basés sur les réalités du terrain et les tendances actuelles.",
                  icon: <Home />
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-paper rounded-2xl flex items-center justify-center text-accent mb-8 group-hover:bg-accent group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl mb-4">{feature.title}</h3>
                  <p className="text-ink/60 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-ink text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
             <img 
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000" 
              alt="Texture" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-7xl mb-8 leading-tight">Prêt à transformer votre maison avec confiance ?</h2>
              <p className="text-xl text-white/60 mb-12 max-w-xl">
                Rejoignez des milliers de propriétaires qui ont clarifié leur vision grâce à Spoof BTP & Adhésif.
              </p>
              <div className="flex flex-wrap gap-6">
                <button className="bg-white text-ink px-10 py-5 rounded-full font-bold text-lg hover:bg-accent hover:text-white transition-all flex items-center gap-3">
                  Essayer Gratuitement <ChevronRight size={20} />
                </button>
                <button className="border border-white/20 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                  Nos Réalisations
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-paper border-t border-ink/5 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white">
                  <Home size={16} />
                </div>
                <span className="font-serif text-xl font-semibold tracking-tight">Spoof BTP & Adhésif</span>
              </div>
              <p className="text-ink/50 max-w-sm leading-relaxed">
                Votre partenaire de confiance pour la rénovation, l'architecture et la décoration d'intérieur.
              </p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Navigation</h4>
              <ul className="space-y-4 text-sm text-ink/60">
                <li><a href="#" className="hover:text-accent transition-colors">Accueil</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Réalisations</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Contact</h4>
              <ul className="space-y-4 text-sm text-ink/60">
                <li>spoofbtp_adhesif@icloud.com</li>
                <li>01 59 13 31 38</li>
                <li>Saint-Mammes</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-ink/5 text-xs text-ink/40 uppercase tracking-widest">
            <p>© 2026 Spoof BTP & Adhésif. Tous droits réservés.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-ink transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-ink transition-colors">Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
