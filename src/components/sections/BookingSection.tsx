'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Paperclip, Search, ChevronDown, Calendar } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, Preload } from '@react-three/drei';
import { inSphere } from 'maath/random';
import { Points as PointsType } from 'three';

// --- Comprehensive Country List ---
const allCountryCodes = [
    { name: "Indonesia", dial_code: "+62", code: "ID", flag: "🇮🇩" },
    { name: "United States", dial_code: "+1", code: "US", flag: "🇺🇸" },
    { name: "Singapore", dial_code: "+65", code: "SG", flag: "🇸🇬" },
    { name: "Malaysia", dial_code: "+60", code: "MY", flag: "🇲🇾" },
    { name: "Australia", dial_code: "+61", code: "AU", flag: "🇦🇺" },
    { name: "United Kingdom", dial_code: "+44", code: "GB", flag: "🇬🇧" },
    { name: "Japan", dial_code: "+81", code: "JP", flag: "🇯🇵" },
    { name: "Germany", dial_code: "+49", code: "DE", flag: "🇩🇪" },
    { name: "Netherlands", dial_code: "+31", code: "NL", flag: "🇳🇱" },
    { name: "South Korea", dial_code: "+82", code: "KR", flag: "🇰🇷" },
    { name: "Canada", dial_code: "+1", code: "CA", flag: "🇨🇦" },
    // A more comprehensive list can be added here
];
type Country = typeof allCountryCodes[0];

// --- Custom UI Components ---
const GrowthIllustration = () => {
    const pointsRef = useRef<PointsType>(null!);
    const sphere = inSphere(new Float32Array(5000 * 3), { radius: 1.2 });
    useFrame((state, delta) => {
        if(pointsRef.current) {
            pointsRef.current.rotation.x -= delta / 10;
            pointsRef.current.rotation.y -= delta / 15;
            const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
            pointsRef.current.scale.set(scale, scale, scale);
        }
    });
    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={pointsRef} positions={sphere as Float32Array} stride={3} frustumCulled={false}><pointsMaterial transparent color="#9ca3af" size={0.005} sizeAttenuation={true} depthWrite={false} /></Points>
        </group>
    );
};
const AnimatedIllustration = () => (<Canvas camera={{ position: [0, 0, 5] }}><Suspense fallback={null}><GrowthIllustration /><Preload all /></Suspense></Canvas>);
const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => { const timerId = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timerId); }, []);
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return (<div className="mt-auto"><p className="text-sm text-zinc-500">Our Local Time</p><p className="text-3xl font-bold text-zinc-900 tracking-tight">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p><p className="text-xs text-zinc-500">{time.toLocaleDateString('en-US', dateOptions)} (WIB/GMT+7)</p></div>);
};
const FormField = ({ label, name, children, className }: { label: string, name: string, children: React.ReactNode, className?: string }) => (<div className={className}><label htmlFor={name} className="block text-sm font-semibold leading-6 text-zinc-900">{label}</label><div className="mt-2.5">{children}</div></div>);
const CountrySelect = ({ selected, setSelected }: { selected: Country, setSelected: (country: Country) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const filteredCountries = searchTerm === '' ? allCountryCodes : allCountryCodes.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    useEffect(() => { const handleClickOutside = (event: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false); }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, []);
    return (<div className="relative" ref={dropdownRef}><div className="relative w-full rounded-md border-0 bg-white shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-zinc-900"><button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full cursor-pointer py-2 pl-3 pr-10 text-left text-zinc-900 sm:text-sm"><span className="flex items-center"><span className="text-lg">{selected.flag}</span><span className="ml-3 block truncate">{selected.name}</span></span><span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"><ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></span></button></div><AnimatePresence>{isOpen && (<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"><div className="p-2"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search country..." className="w-full rounded-md border-zinc-300 py-1.5 pl-8 text-sm" /></div></div><ul className="max-h-56 overflow-auto py-1 text-base">{filteredCountries.map(country => (<li key={country.code} onClick={() => { setSelected(country); setIsOpen(false); setSearchTerm(''); }} className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-zinc-900 hover:bg-zinc-100"><div className="flex items-center"><span className="text-lg">{country.flag}</span><span className="ml-3 block truncate font-normal">{country.name}</span><span className="ml-2 truncate text-zinc-500">{country.dial_code}</span></div></li>))}</ul></motion.div>)}</AnimatePresence><input type="hidden" name="country-code" value={selected.dial_code} /></div>);
};

// --- Main Booking Section Component ---
export default function BookingSection() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [selectedCountry, setSelectedCountry] = useState(allCountryCodes[0]);
    const [isClient, setIsClient] = useState(false);
    const [scheduleMeeting, setScheduleMeeting] = useState(false);
    useEffect(() => { setIsClient(true); }, []);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setStatus('loading'); await new Promise(resolve => setTimeout(resolve, 2000)); setStatus('success'); };

    return (
        <section id="contact" className="w-full overflow-hidden bg-white py-24 sm:py-32">
            <motion.div className="container mx-auto max-w-7xl px-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.3 } } }}>
                <motion.div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl shadow-zinc-500/10" variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } } }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Column: Information */}
                        <div className="flex flex-col bg-zinc-50 p-12 sm:p-16">
                            <h2 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">Starts Here.</h2>
                            <div className="my-auto h-64 w-full"><AnimatedIllustration /></div>
                            {isClient ? <LiveClock /> : (<div className="mt-auto"><p className="text-sm text-zinc-500">Our Local Time</p><p className="text-3xl font-bold text-zinc-900 tracking-tight">--:--:--</p><p className="text-xs text-zinc-500">Loading...</p></div>)}
                        </div>
                        {/* Right Column: Form */}
                        <div className="bg-white p-12 sm:p-16">
                            {isClient ? (
                                <AnimatePresence mode="wait">
                                    {status === 'success' ? (
                                        <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-[500px] flex-col items-center justify-center text-center"><motion.svg className="h-16 w-16 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><motion.path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }} /></motion.svg><motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.8 } }} className="mt-4 text-2xl font-semibold text-zinc-900">Thank You!</motion.h3><motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 1 } }} className="mt-2 text-zinc-600">Your message has been sent successfully.</motion.p></motion.div>
                                    ) : (
                                        <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmit} className="space-y-8">
                                            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
                                                <FormField label="Full Name *" name="name"><input type="text" name="name" id="name" required className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm"/></FormField>
                                                <FormField label="Email Address *" name="email"><input type="email" name="email" id="email" required className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm"/></FormField>
                                            </div>
                                            <div><FormField label="Country/Region *" name="country"><CountrySelect selected={selectedCountry} setSelected={setSelectedCountry} /></FormField></div>
                                            <div><FormField label="Message *" name="message"><textarea name="message" id="message" required rows={4} className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm"></textarea></FormField></div>

                                            {/* Toggle for optional meeting details */}
                                            <div className="border-t border-zinc-200 pt-8">
                                                <button type="button" onClick={() => setScheduleMeeting(!scheduleMeeting)} className="flex w-full items-center justify-between text-left text-sm font-semibold text-zinc-700 hover:text-zinc-900">
                                                    <span>Suggest a Meeting Time? (Optional)</span>
                                                    <ChevronDown className={`h-5 w-5 transition-transform ${scheduleMeeting ? 'rotate-180' : ''}`} />
                                                </button>
                                            </div>

                                            <AnimatePresence>
                                                {scheduleMeeting && (
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-8 overflow-hidden">
                                                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
                                                            <FormField label="Preferred Date" name="date"><input type="date" name="date" id="date" min={new Date().toISOString().split('T')[0]} className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm"/></FormField>
                                                            <FormField label="Time (WIB/GMT+7)" name="time"><input type="time" name="time" id="time" min="09:00" max="17:00" className="block w-full rounded-md border-0 px-3.5 py-2 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm"/></FormField>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {status === 'error' && <p className="text-sm text-red-600">Sorry, there was an error. Please try again.</p>}
                                            <div className="pt-2"><button type="submit" disabled={status === 'loading'} className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full border-2 border-zinc-900 px-6 py-3 text-center text-sm font-semibold text-zinc-900 shadow-sm transition-colors duration-300 hover:text-white disabled:opacity-50 sm:w-auto"><div className="absolute inset-0 z-0 translate-y-full transform bg-zinc-900 transition-transform duration-300 ease-in-out group-hover:translate-y-0" /><span className="relative z-10">{status === 'loading' ? 'Sending...' : 'Send Message'}</span></button></div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            ) : (
                                <div className="flex h-full min-h-[500px] items-center justify-center"><p className="text-zinc-400">Loading form...</p></div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}