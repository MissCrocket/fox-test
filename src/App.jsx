import React, { useState, useEffect } from 'react';

// --- IKONY SVG ---
const Icon = ({ children, className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>
);
const Check = (props) => <Icon {...props}><polyline points="20 6 9 17 4 12"/></Icon>;
const ChevronRight = (props) => <Icon {...props}><polyline points="9 18 15 12 9 6"/></Icon>;
const ChevronLeft = (props) => <Icon {...props}><polyline points="15 18 9 12 15 6"/></Icon>;
const AlertCircle = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Icon>;
const Building2 = (props) => <Icon {...props}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></Icon>;
const User = (props) => <Icon {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>;
const CreditCard = (props) => <Icon {...props}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></Icon>;
const Truck = (props) => <Icon {...props}><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></Icon>;
const FileText = (props) => <Icon {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></Icon>;
const Plus = (props) => <Icon {...props}><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></Icon>;
const Trash2 = (props) => <Icon {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></Icon>;
const ShieldCheck = (props) => <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></Icon>;
const MapPin = (props) => <Icon {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></Icon>;
const Briefcase = (props) => <Icon {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Icon>;
const Users = (props) => <Icon {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
const LayoutGrid = (props) => <Icon {...props}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></Icon>;
const ArrowRight = (props) => <Icon {...props}><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></Icon>;
const X = (props) => <Icon {...props}><path d="M18 6 6 18"/><path d="m6 6 18 18"/></Icon>;
const AlertTriangle = (props) => <Icon {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y2="17"/></Icon>;
const Clock = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>;
const Euro = (props) => <Icon {...props}><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/></Icon>;
const Award = (props) => <Icon {...props}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></Icon>;

// --- KONFIGURACJA I STAŁE ---
const DEV_MODE = import.meta.env.DEV; // Automatyczne przełączanie: true w dev, false w prod

const FLEET_LABELS = { 
  trucks: 'Ciężarowe', 
  bus: 'Autokary'
};

const INITIAL_FORM_STATE = {
  countries: { Belgia: false, Chorwacja: false, Francja: false, Słowenia: false, Włochy: false, None: false },
  nip: '', companyName: '', seatAddress: '', seatPostal: '', seatCity: '',
  legalForm: '', ownerPesel: '', partners: [{ id: 1, name: '', pesel: '' }, { id: 2, name: '', pesel: '' }], representation: '',
  sameAddress: 'yes', corrAddress: '', corrPostal: '', corrCity: '',
  email: '', phone: '', fleetSize: '', fleetType: 'trucks',
  iban: '', ibanSkipped: false,
  consent: false,
  _gotcha: '' // Pole honeypot
};

// --- WALIDATORY ---
const isValidNIP = (nip) => {
  if (typeof nip !== 'string') return false;
  const nipNoDashes = nip.replace(/[\s-]/g, '');
  if (nipNoDashes.length !== 10 || !/^\d+$/.test(nipNoDashes)) return false;
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  for (let i = 0; i < 9; i++) { sum += parseInt(nipNoDashes[i]) * weights[i]; }
  const control = sum % 11;
  return control === parseInt(nipNoDashes[9]);
};

const isValidPESEL = (pesel) => {
  if (typeof pesel !== 'string') return false;
  const p = pesel.replace(/[\s-]/g, '');
  if (p.length !== 11 || !/^\d+$/.test(p)) return false;
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  for (let i = 0; i < 10; i++) { sum += parseInt(p[i]) * weights[i]; }
  const m = sum % 10;
  const control = m === 0 ? 0 : 10 - m;
  return control === parseInt(p[10]);
};

const isValidPhone = (phone) => {
  const cleanPhone = phone.replace(/[\s-]/g, '');
  return /^(\+48)?\d{9}$/.test(cleanPhone);
};

const isValidIBAN = (iban) => {
  const clean = iban.replace(/\s/g, '').toUpperCase();
  if (!/^PL\d{26}$/.test(clean)) return false;
  const rearranged = clean.slice(4) + clean.slice(0, 4);
  const numeric = rearranged
    .split('')
    .map(ch => {
      const code = ch.charCodeAt(0);
      return (code >= 65 && code <= 90) ? code - 55 : ch;
    })
    .join('');
  try {
    return BigInt(numeric) % BigInt(97) === BigInt(1);
  } catch {
    return false;
  }
};

// --- KOMPONENTY UI ---
const StepWrapper = ({ children }) => (
  <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">{children}</div>
);

const InputField = ({ label, error, icon: Icon, autoComplete, required, onBlur, inputMode, pattern, ...props }) => (
  <div className="mb-5 group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 font-body">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className={`relative flex items-center transition-all duration-200 rounded-xl bg-slate-50 border-2 ${error ? 'border-red-100 bg-red-50' : 'border-transparent group-focus-within:border-[#E86C3F] group-focus-within:bg-white hover:bg-slate-100'}`}>
      {Icon && (
        <>
          <div className="pl-4 pr-2 text-slate-400 group-focus-within:text-[#E86C3F] transition-colors shrink-0"><Icon size={20} /></div>
          <div className="h-6 w-px bg-slate-300 mr-2 shrink-0"></div>
        </>
      )}
      <input className={`w-full py-4 pr-4 pl-2 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 font-medium rounded-xl font-body`} autoComplete={autoComplete || "off"} required={required} onBlur={onBlur} inputMode={inputMode} pattern={pattern} {...props} />
    </div>
    {error && <div className="flex items-center mt-2 ml-1 text-red-500 text-xs font-semibold animate-in slide-in-from-left-2 fade-in font-body"><AlertCircle size={12} className="mr-1" /> {error}</div>}
  </div>
);

const SelectionCard = ({ selected, onClick, title, description, icon: Icon }) => (
  <button type="button" onClick={onClick} aria-pressed={selected} className={`relative w-full text-left p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ease-out group outline-none ${selected ? 'border-[#E86C3F] bg-orange-50/50 shadow-lg shadow-orange-100 transform scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md focus:border-[#E86C3F]'}`}>
    <div className="flex items-start justify-between mb-2">
      <div className={`p-3 rounded-xl transition-colors ${selected ? 'bg-[#E86C3F] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}><Icon size={24} /></div>
      {selected && <div className="bg-[#E86C3F] text-white rounded-full p-1 animate-in zoom-in spin-in-90 duration-300"><Check size={12} strokeWidth={4} /></div>}
    </div>
    <h3 className={`font-bold text-lg mb-1 ${selected ? 'text-[#01152F]' : 'text-slate-700'} font-heading`}>{title}</h3>
    {description && <p className="text-sm text-slate-500 leading-snug font-body">{description}</p>}
  </button>
);

const WelcomeScreen = ({ onStart }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-8 md:p-12 text-center animate-in fade-in duration-700">
    <h2 className="text-3xl md:text-4xl font-black text-[#01152F] mb-4 mt-8 md:mt-16 font-heading">Witamy na pokładzie 👋</h2>
    <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed font-body">Wypełnienie tego formularza zajmie tylko chwilę i pozwoli nam przygotować dla Ciebie komplet dokumentów.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-3xl">
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center"><Award className="text-[#E86C3F] mb-3" size={28} /><h3 className="font-bold text-[#01152F] font-heading">Wiedza i doświadczenie</h3><p className="text-sm text-slate-500 mt-1 font-body">Zespół praktyków</p></div>
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center"><Euro className="text-[#E86C3F] mb-3" size={28} /><h3 className="font-bold text-[#01152F] font-heading">Model Success Fee</h3><p className="text-sm text-slate-500 mt-1 font-body">Płacisz tylko od sukcesu</p></div>
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center"><FileText className="text-[#E86C3F] mb-3" size={28} /><h3 className="font-bold text-[#01152F] font-heading">Minimum formalności</h3><p className="text-sm text-slate-500 mt-1 font-body">Prosty i szybki proces</p></div>
    </div>
    <button onClick={onStart} className="group bg-[#E86C3F] hover:bg-[#d55f32] text-white text-lg px-10 py-4 rounded-lg font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-3 font-body">Rozpocznij <ArrowRight className="group-hover:translate-x-1 transition-transform" /></button>
    <div className="mt-6 flex items-center gap-2 text-sm text-slate-400 font-medium font-body"><Clock size={16} /> Średni czas wypełniania: 3-5 minut</div>
  </div>
);

// --- GŁÓWNA APLIKACJA ---
export default function App() {
  // 1. Definicja stanu formularza (MUSI być przed useEffect)
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  
  // Pozostałe stany
  const [showWelcome, setShowWelcome] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [completed, setCompleted] = useState(false);
  const [finalPayload, setFinalPayload] = useState(null); 
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [zipCodesMap, setZipCodesMap] = useState({});

  // 2. useEffect zależący od formData (Teraz bezpieczny)
  useEffect(() => {
    if (formData.sameAddress === 'no' && Object.keys(zipCodesMap).length === 0) {
      fetch('/kody-pocztowe.json')
        .then((res) => res.json())
        .then((data) => setZipCodesMap(data))
        .catch((err) => console.error("Nie udało się pobrać bazy kodów", err));
    }
  }, [formData.sameAddress]);

  const resetForm = () => {
    setShowWelcome(true);
    setStep(1);
    setLoading(false);
    setErrors({});
    setCompleted(false);
    setFinalPayload(null);
    setShowSkipConfirm(false);
    setFormData(INITIAL_FORM_STATE);
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
    }
  };

  useEffect(() => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.ownerPesel;
      delete newErrors.representation;
      Object.keys(newErrors).forEach(key => { if (key.startsWith('partner_')) delete newErrors[key]; });
      return newErrors;
    });
  }, [formData.legalForm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('country_')) {
      const countryKey = name.replace('country_', '');
      if (countryKey === 'None' && checked) {
        setFormData(prev => ({ ...prev, countries: Object.keys(prev.countries).reduce((acc, key) => ({ ...acc, [key]: key === 'None' }), {}) }));
      } else {
        setFormData(prev => ({ ...prev, countries: { ...prev.countries, [countryKey]: checked, None: false } }));
      }
      clearError('countries');
      return;
    }

    if (name === 'nip') {
      const cleanVal = value.replace(/[^0-9-]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleanVal, companyName: '', seatAddress: '', seatPostal: '', seatCity: '' }));
      clearError(name);
      clearError('companyName');
      return;
    }

    if (name === 'phone') {
       let cleanVal = value.replace(/\s/g, '').replace(/[^+\d]/g, '');
       if (cleanVal.indexOf('+') > 0) cleanVal = cleanVal.replace(/\+/g, '');
       setFormData(prev => ({ ...prev, [name]: cleanVal }));
       clearError(name);
       return;
    }

    if (name === 'iban') {
       const cleanVal = value.replace(/\s/g, '').toUpperCase();
       setFormData(prev => ({ ...prev, [name]: cleanVal, ibanSkipped: false }));
       clearError(name);
       if(showSkipConfirm) setShowSkipConfirm(false);
       return;
    }

    if (name === 'corrPostal') {
      let cleanVal = value.replace(/\D/g, '').slice(0, 5);
      let formattedVal = cleanVal.length > 2 ? `${cleanVal.slice(0, 2)}-${cleanVal.slice(2)}` : cleanVal;
      setFormData(prev => {
        let newCity = prev.corrCity;
        if (cleanVal.length === 5) {
           const autoCity = zipCodesMap[formattedVal];
           if (autoCity) newCity = autoCity;
        }
        return { ...prev, [name]: formattedVal, corrCity: newCity };
      });
      clearError(name);
      if(errors.corrCity) clearError('corrCity');
      return;
    }

    if (name === 'fleetSize') {
      if (value === '' || (parseInt(value, 10) > 0)) {
        setFormData(prev => ({ ...prev, [name]: value }));
        clearError(name);
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    clearError(name);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMsg = null;
    if (name === 'email' && !/^\S+@\S+\.\S+$/.test(value)) errorMsg = 'Nieprawidłowy format email';
    if (name === 'phone' && !isValidPhone(value)) errorMsg = 'Nieprawidłowy numer (+48...)';
    if (name === 'fleetSize' && !value) errorMsg = 'Wymagane';
    if (errorMsg) setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handlePartnerChange = (id, field, value) => {
    const newPartners = formData.partners.map(p => p.id === id ? { ...p, [field]: value } : p);
    setFormData({ ...formData, partners: newPartners });
    clearError(`partner_${id}_${field}`);
  };

  const addPartner = () => setFormData(prev => ({ ...prev, partners: [...prev.partners, { id: Math.max(...prev.partners.map(p => p.id)) + 1, name: '', pesel: '' }] }));
  
  const removePartner = (id) => {
    if (formData.partners.length > 2) {
      setFormData(prev => ({ ...prev, partners: prev.partners.filter(p => p.id !== id) }));
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[`partner_${id}_name`];
        delete newErrors[`partner_${id}_pesel`];
        return newErrors;
      });
    }
  };

  const handleFetchGUS = async () => {
    if (!isValidNIP(formData.nip)) {
      setErrors(prev => ({ ...prev, nip: 'Sprawdź format NIP (10 cyfr)' }));
      return false;
    }
    setErrors(prev => { const e = { ...prev }; delete e.nip; delete e.companyName; return e; });
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/gus-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nip: formData.nip })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Błąd pobierania danych');

      setFormData(prev => ({
        ...prev,
        companyName: data.companyName,
        seatAddress: data.seatAddress,
        seatPostal: data.seatPostal,
        seatCity: data.seatCity,
      }));
      return true;
    } catch (err) {
      setErrors(prev => ({ ...prev, nip: err.message || 'Nie udało się pobrać danych firmy' }));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSkipIban = () => {
    setFormData(prev => ({ ...prev, iban: '', ibanSkipped: true }));
    setErrors(prev => { const e = {...prev}; delete e.iban; return e; });
    setShowSkipConfirm(false);
    setStep(p => p + 1);
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.countries.None && !Object.entries(formData.countries).some(([k, v]) => k !== 'None' && v)) {
        newErrors.countries = 'Wybierz przynajmniej jeden kraj';
        isValid = false;
      }
    }
    if (currentStep === 2) {
      if (!isValidNIP(formData.nip)) { newErrors.nip = 'Nieprawidłowy NIP'; isValid = false; }
      if (!formData.companyName) { newErrors.companyName = 'Wymagane pobranie danych firmy'; isValid = false; }
    }
    if (currentStep === 3) {
      if (!formData.legalForm) { newErrors.legalForm = 'Wybierz formę prawną'; isValid = false; }
      else if (formData.legalForm === 'jdg' && !isValidPESEL(formData.ownerPesel)) { newErrors.ownerPesel = 'Nieprawidłowy PESEL'; isValid = false; }
      else if (formData.legalForm === 'sc') formData.partners.forEach(p => { 
        if (!p.name) { newErrors[`partner_${p.id}_name`] = 'Wymagane imię i nazwisko'; isValid = false; }
        if (!isValidPESEL(p.pesel)) { newErrors[`partner_${p.id}_pesel`] = 'Nieprawidłowy PESEL'; isValid = false; }
      });
      else if (formData.legalForm === 'other' && !formData.representation) { newErrors.representation = 'Pole wymagane'; isValid = false; }
    }
    if (currentStep === 4 && formData.sameAddress === 'no') {
      if (!formData.corrAddress) { newErrors.corrAddress = 'Ulica wymagana'; isValid = false; }
      if (!formData.corrCity) { newErrors.corrCity = 'Miasto wymagane'; isValid = false; }
      if (!formData.corrPostal) { newErrors.corrPostal = 'Kod wymagany'; isValid = false; }
    }
    if (currentStep === 5) {
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) { newErrors.email = 'Nieprawidłowy format email'; isValid = false; }
      if (!isValidPhone(formData.phone)) { newErrors.phone = 'Nieprawidłowy numer (+48...)'; isValid = false; }
      if (!formData.fleetSize) { newErrors.fleetSize = 'Wymagane'; isValid = false; }
    }
    if (currentStep === 6) {
      if (!formData.ibanSkipped && !isValidIBAN(formData.iban)) { newErrors.iban = 'Nieprawidłowy IBAN (Suma kontrolna)'; isValid = false; }
    }
    if (currentStep === 7 && !formData.consent) { newErrors.consent = 'Musisz wyrazić zgodę'; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const nextStep = async () => {
    if (step === 2) {
      if (formData.nip && !formData.companyName) {
        const success = await handleFetchGUS();
        if (!success) return;
      }
    }
    if (validateStep(step) && !formData.countries.None) {
      setStep(p => p + 1);
    }
  };

  const prevStep = () => setStep(p => p - 1);
  
  const handleSubmit = async () => {
    if (validateStep(7)) {
      setLoading(true);
      const correspondenceAddress = formData.sameAddress === 'yes'
        ? { address: formData.seatAddress, postalCode: formData.seatPostal, city: formData.seatCity }
        : { address: formData.corrAddress, postalCode: formData.corrPostal, city: formData.corrCity };
      
      const cleanedIban = formData.iban ? formData.iban.replace(/\s/g, '') : null;

      const payload = {
        nip: formData.nip, companyName: formData.companyName,
        seat: { address: formData.seatAddress, postalCode: formData.seatPostal, city: formData.seatCity },
        correspondence: correspondenceAddress,
        legalForm: formData.legalForm,
        ownerPesel: formData.legalForm === 'jdg' ? formData.ownerPesel : null,
        representation: formData.legalForm === 'other' ? formData.representation : null,
        partners: formData.legalForm === 'sc' ? formData.partners : [],
        countries: Object.keys(formData.countries).filter(k => formData.countries[k] && k !== 'None'),
        contact: { email: formData.email, phone: formData.phone },
        fleet: { size: formData.fleetSize ? parseInt(formData.fleetSize, 10) : null, type: formData.fleetType },
        iban: formData.ibanSkipped ? null : cleanedIban,
        ibanSkipped: formData.ibanSkipped,
        consent: formData.consent, 
        // ZMIANA: Usunięto submittedAt, dodano _gotcha
        _gotcha: formData._gotcha
      };

      try {
        const response = await fetch('/.netlify/functions/submit-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Błąd wysyłania formularza');
        setFinalPayload(payload);
        setCompleted(true);
      } catch (error) {
        console.error(error);
        alert("Wystąpił problem z wysłaniem zgłoszenia. Spróbuj ponownie.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (completed) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans font-body">
      <div className="max-w-md w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200 animate-in zoom-in duration-500"><Check className="w-12 h-12 text-white" /></div>
        <h2 className="text-3xl font-extrabold text-[#01152F] mb-4 font-heading">Zgłoszenie przyjęte!</h2>
        <p className="text-slate-600 mb-8 text-lg font-body">Dziękujemy za rejestrację. Nasz zespół zweryfikuje dane i skontaktuje się z Tobą mailowo na adres <strong>{formData.email}</strong> w celu dopełnienia formalności.</p>
        {DEV_MODE && finalPayload && (
          <div className="bg-slate-100 p-4 rounded text-xs text-left text-slate-500 font-mono mb-6 overflow-hidden"><strong>DEV MODE:</strong> Payload wysłany do API:<br/>{JSON.stringify(finalPayload, null, 2)}</div>
        )}
        <button onClick={resetForm} className="text-[#E86C3F] font-bold hover:underline font-body">Wróć do strony głównej</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F6F8] font-sans text-slate-900 py-8 px-4 flex flex-col items-center justify-center">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Roboto:wght@400;500;700&display=swap'); .font-heading { font-family: 'Montserrat', sans-serif; font-weight: 700; } .font-body { font-family: 'Roboto', sans-serif; }`}</style>
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700"><img src="https://static.wixstatic.com/media/3912d2_bf127344204e4cd2990077917aaa5f1c~mv2.png" alt="Fox Up Logo" className="w-32 mx-auto" /></div>
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-slate-100 relative">
        {showWelcome ? ( <WelcomeScreen onStart={() => setShowWelcome(false)} /> ) : (
          <>
            <div className="hidden md:flex w-72 bg-[#01152F] p-8 flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#E86C3F] rounded-full opacity-10 blur-3xl"></div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-8 font-heading">Postęp rejestracji</p>
                <div className="space-y-6 relative z-10">
                  {[{ s: 1, label: "Kraje zwrotu", icon: Truck }, { s: 2, label: "Firma", icon: Building2 }, { s: 3, label: "Forma prawna", icon: FileText }, { s: 4, label: "Adresy", icon: MapPin }, { s: 5, label: "Flota", icon: LayoutGrid }, { s: 6, label: "Finanse", icon: CreditCard }, { s: 7, label: "Podsumowanie", icon: Check }].map((item) => (
                    <div key={item.s} className={`flex items-center gap-4 transition-all duration-500 ${step === item.s ? 'translate-x-2' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${step > item.s ? 'bg-[#E86C3F] border-[#E86C3F] text-white' : step === item.s ? 'bg-white border-white text-[#01152F]' : 'border-slate-700 text-slate-500 bg-transparent'}`}>{step > item.s ? <Check size={12}/> : item.s}</div>
                      <span className={`text-sm font-medium transition-colors font-body ${step === item.s ? 'text-white' : 'text-slate-500'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-slate-600 text-xs mt-8 font-body"><span className="text-white hover:text-[#E86C3F] cursor-pointer transition-colors">Pomoc: +48 453 423 249</span></div>
            </div>
            <div className="md:hidden p-6 bg-white border-b border-slate-100 sticky top-0 z-20 w-full">
              <div className="flex justify-between items-center mb-4"><span className="text-sm font-bold text-slate-500 font-body">Krok {step} z 7</span><span className="text-xs font-bold text-[#E86C3F] bg-orange-50 px-3 py-1 rounded-full font-body">{Math.round(((step-1)/6)*100)}%</span></div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#E86C3F] transition-all duration-500" style={{ width: `${((step-1)/6)*100}%` }}></div></div>
            </div>
            <div className="flex-1 flex flex-col relative">
              {/* --- ZMIANA: HONEYPOT RENDEROWANY ZAWSZE (GLOBALNIE W UI) --- */}
              {/* Jest niewidoczny dla użytkownika (opacity:0, left: -9999px), ale widoczny dla bota (brak display:none) */}
              <div style={{ opacity: 0, position: 'absolute', left: '-9999px', top: 0 }}>
                  <label htmlFor="_gotcha">Nie wypełniaj tego pola, jeśli jesteś człowiekiem</label>
                  <input 
                      type="text" 
                      id="_gotcha" 
                      name="_gotcha" 
                      value={formData._gotcha} 
                      onChange={handleChange} 
                      tabIndex="-1" 
                      autoComplete="off"
                  />
              </div>

              <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
                {step === 1 && (
                  <StepWrapper>
                    <h2 className="text-3xl font-bold text-[#01152F] mb-2 font-heading">Gdzie tankujesz?</h2>
                    <p className="text-slate-500 mb-8 text-lg font-body">Wybierz kraje, z których chcesz odzyskać podatek.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {['Belgia', 'Chorwacja', 'Francja', 'Słowenia', 'Włochy'].map(country => (
                        <button key={country} type="button" disabled={formData.countries.None} aria-pressed={formData.countries[country]} onClick={() => !formData.countries.None && handleChange({ target: { name: `country_${country}`, type: 'checkbox', checked: !formData.countries[country] } })} className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between outline-none disabled:opacity-50 focus:border-[#E86C3F] ${formData.countries[country] ? 'border-[#E86C3F] bg-white shadow-lg shadow-orange-100/50' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200'}`}>
                          <span className={`text-lg font-bold ${formData.countries[country] ? 'text-[#01152F]' : 'text-slate-500'} font-heading`}>{country}</span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.countries[country] ? 'bg-[#E86C3F] border-[#E86C3F]' : 'border-slate-300'}`}>{formData.countries[country] && <Check size={14} className="text-white" />}</div>
                        </button>
                      ))}
                    </div>
                    <button type="button" aria-pressed={formData.countries.None} onClick={() => handleChange({ target: { name: `country_None`, type: 'checkbox', checked: !formData.countries.None } })} className={`w-full p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 outline-none focus:border-red-500 ${formData.countries.None ? 'border-red-200 bg-red-50' : 'border-transparent hover:bg-slate-50'}`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.countries.None ? 'border-red-500 bg-red-500' : 'border-slate-300'}`}>{formData.countries.None && <Check size={12} className="text-white" />}</div>
                      <span className="text-slate-600 font-medium font-body">Żadne z powyższych</span>
                    </button>
                    {errors.countries && <p className="text-red-500 font-bold mt-4 animate-bounce font-body">{errors.countries}</p>}
                    {formData.countries.None && (
                      <div className="mt-6 p-6 bg-red-50 rounded-2xl border border-red-100 text-red-800 flex gap-4 items-start animate-in zoom-in-95">
                          <X className="shrink-0 mt-1" />
                          <div>
                            <h4 className="font-bold text-lg font-heading">Brak kwalifikacji</h4>
                            <p className="mt-2 opacity-90 font-body">Niestety, odzyskujemy podatek akcyzowy wyłącznie z wymienionych krajów.</p>
                            <button onClick={resetForm} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-colors font-body">Wróć do strony głównej</button>
                          </div>
                      </div>
                    )}
                  </StepWrapper>
                )}
                {step === 2 && (
                  <StepWrapper>
                    <div className="max-w-lg">
                      <h2 className="text-3xl font-bold text-[#01152F] mb-2 font-heading">Twoja Firma</h2>
                      <p className="text-slate-500 mb-8 text-lg font-body">Podaj NIP, abyśmy mogli pobrać dane rejestrowe Twojej firmy.</p>
                      <div className="flex gap-4 items-start mb-8">
                        <div className="flex-1"><InputField label="NIP" name="nip" value={formData.nip} onChange={handleChange} placeholder="np. 6343051589" icon={Briefcase} error={errors.nip} autoFocus inputMode="numeric" maxLength={13} required /></div>
                        <button onClick={handleFetchGUS} disabled={loading} className="mt-6 h-[54px] w-[54px] flex items-center justify-center bg-[#E86C3F] text-white rounded-lg hover:bg-[#d55f32] transition-colors disabled:opacity-50 shadow-md hover:shadow-lg">{loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <ArrowRight />}</button>
                      </div>
                      {formData.companyName && (
                        <div className="bg-white p-0 rounded-2xl border-2 border-[#E86C3F]/20 overflow-hidden shadow-xl shadow-orange-500/5 animate-in slide-in-from-bottom-4">
                          <div className="bg-orange-50/50 p-4 border-b border-orange-100 flex items-center gap-2"><ShieldCheck className="text-[#E86C3F]" size={18} /><span className="text-xs font-bold text-[#E86C3F] uppercase tracking-wider font-body">Zweryfikowano</span></div>
                          <div className="p-6"><h3 className="font-bold text-[#01152F] text-lg mb-1 font-heading">{formData.companyName}</h3><p className="text-slate-500 font-body">{formData.seatAddress}, {formData.seatPostal} {formData.seatCity}</p></div>
                        </div>
                      )}
                      {errors.companyName && <p className="text-red-500 font-bold mt-4 font-body">{errors.companyName}</p>}
                    </div>
                  </StepWrapper>
                )}
                {step === 3 && (
                  <StepWrapper>
                    <h2 className="text-3xl font-bold text-[#01152F] mb-8 font-heading">Forma prawna</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <SelectionCard selected={formData.legalForm === 'jdg'} onClick={() => setFormData(p => ({...p, legalForm: 'jdg'}))} title="JDG" description="Jednoosobowa działalność" icon={User} />
                      <SelectionCard selected={formData.legalForm === 'sc'} onClick={() => setFormData(p => ({...p, legalForm: 'sc'}))} title="Spółka Cywilna" description="Wspólnicy" icon={Users} />
                      <SelectionCard selected={formData.legalForm === 'other'} onClick={() => setFormData(p => ({...p, legalForm: 'other'}))} title="Spółka Prawa Handlowego" description="Sp. z o.o., S.A., itd." icon={Building2} />
                    </div>
                    {errors.legalForm && <p className="text-red-500 font-bold mb-4 font-body">{errors.legalForm}</p>}
                    <div className="bg-white">
                      {formData.legalForm === 'jdg' && (
                        <div className="animate-in fade-in slide-in-from-top-2"><InputField label="PESEL Właściciela" name="ownerPesel" value={formData.ownerPesel} onChange={handleChange} placeholder="np. 90080512345" error={errors.ownerPesel} maxLength={11} inputMode="numeric" pattern="\d*" required /></div>
                      )}
                      {formData.legalForm === 'sc' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                          <div className="flex justify-between items-center"><h4 className="font-bold text-[#01152F] font-heading">Dane Wspólników</h4><button onClick={addPartner} className="text-xs font-bold text-[#E86C3F] flex items-center hover:bg-orange-50 px-2 py-1 rounded transition-colors font-body"><Plus size={14} className="mr-1"/> DODAJ</button></div>
                          {formData.partners.map((p, i) => (
                            <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-2 group hover:border-slate-300 transition-colors">
                              <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 mt-1">{i+1}</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                    <div>
                                      <input placeholder="Imię i Nazwisko" value={p.name} onChange={e => handlePartnerChange(p.id, 'name', e.target.value)} className="w-full bg-transparent border-b border-slate-300 focus:border-[#E86C3F] focus:outline-none py-1 text-sm font-medium placeholder-slate-400 font-body" />
                                      {errors[`partner_${p.id}_name`] && <p className="text-xs text-red-500 mt-1 font-body">{errors[`partner_${p.id}_name`]}</p>}
                                    </div>
                                    <div>
                                      <input placeholder="PESEL" value={p.pesel} onChange={e => handlePartnerChange(p.id, 'pesel', e.target.value)} className="w-full bg-transparent border-b border-slate-300 focus:border-[#E86C3F] focus:outline-none py-1 text-sm font-medium placeholder-slate-400 font-body" maxLength={11} inputMode="numeric" pattern="\d*" />
                                      {errors[`partner_${p.id}_pesel`] && <p className="text-xs text-red-500 mt-1 font-body">{errors[`partner_${p.id}_pesel`]}</p>}
                                    </div>
                                </div>
                                {formData.partners.length > 2 && <button onClick={() => removePartner(p.id)} className="text-slate-400 hover:text-red-500 mt-1"><Trash2 size={16}/></button>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {formData.legalForm === 'other' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 font-body">Reprezentacja (KRS) <span className="text-red-500">*</span></label>
                          <textarea name="representation" value={formData.representation} onChange={handleChange} className={`w-full p-4 rounded-xl bg-slate-50 border-2 focus:bg-white focus:border-[#E86C3F] focus:outline-none transition-all resize-none min-h-[100px] font-body ${errors.representation ? 'border-red-200 bg-red-50' : 'border-transparent'}`} placeholder="np. Jan Kowalski - Prezes Zarządu" />
                          {errors.representation && <p className="text-xs text-red-500 mt-1 ml-1 font-body">{errors.representation}</p>}
                        </div>
                      )}
                    </div>
                  </StepWrapper>
                )}
                {step === 4 && (
                  <StepWrapper>
                    <h2 className="text-3xl font-bold text-[#01152F] mb-6 font-heading">Adresy</h2>
                    <div className="p-6 bg-[#01152F] rounded-2xl text-white mb-8 relative overflow-hidden shadow-lg">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E86C3F] rounded-full blur-[60px] opacity-40"></div>
                      <div className="relative z-10 flex items-start gap-4">
                          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm"><Building2 className="text-[#E86C3F]"/></div>
                          <div><span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 font-body">Adres Siedziby</span><p className="text-lg font-bold font-body">{formData.seatAddress}</p><p className="text-slate-300 font-body">{formData.seatPostal} {formData.seatCity}</p></div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-slate-900 mb-4 font-heading">Adres korespondencyjny</h3>
                      <div className="flex gap-4">
                          <button type="button" onClick={() => setFormData(p => ({...p, sameAddress: 'yes'}))} className={`flex-1 p-4 rounded-xl border-2 text-sm font-bold transition-all outline-none focus:border-[#E86C3F] font-body ${formData.sameAddress === 'yes' ? 'border-[#E86C3F] bg-orange-50 text-[#01152F]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>Taki sam jak siedziby</button>
                          <button type="button" onClick={() => setFormData(p => ({...p, sameAddress: 'no'}))} className={`flex-1 p-4 rounded-xl border-2 text-sm font-bold transition-all outline-none focus:border-[#E86C3F] font-body ${formData.sameAddress === 'no' ? 'border-[#E86C3F] bg-orange-50 text-[#01152F]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>Inny adres</button>
                      </div>
                    </div>
                    {formData.sameAddress === 'no' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="md:col-span-2"><InputField label="Ulica i numer" name="corrAddress" value={formData.corrAddress} onChange={handleChange} error={errors.corrAddress} required /></div>
                        <InputField label="Kod pocztowy" name="corrPostal" value={formData.corrPostal} onChange={handleChange} error={errors.corrPostal} placeholder="XX-XXX" required />
                        <InputField label="Miasto" name="corrCity" value={formData.corrCity} onChange={handleChange} error={errors.corrCity} required />
                      </div>
                    )}
                  </StepWrapper>
                )}
                {step === 5 && (
                  <StepWrapper>
                    <h2 className="text-3xl font-bold text-[#01152F] mb-8 font-heading">Kontakt</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="jan@firma.pl" icon={User} error={errors.email} autoComplete="email" required />
                      <InputField label="Telefon" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} placeholder="+48 000 000 000" icon={Briefcase} error={errors.phone} autoComplete="tel" inputMode="tel" required />
                    </div>
                    <div className="h-px bg-slate-100 my-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Liczba pojazdów >7.5t" name="fleetSize" type="number" value={formData.fleetSize} onChange={handleChange} onBlur={handleBlur} icon={Truck} error={errors.fleetSize} inputMode="numeric" min="1" required />
                      <div className="mb-5 group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 font-body">Typ Floty</label>
                        <div className="relative flex items-center rounded-xl bg-slate-50 border-2 border-transparent group-focus-within:border-[#E86C3F] group-focus-within:bg-white hover:bg-slate-100 transition-all">
                          <div className="pl-4 text-slate-400"><LayoutGrid size={20}/></div>
                          <select name="fleetType" value={formData.fleetType} onChange={handleChange} className="w-full p-4 bg-transparent border-none focus:ring-0 text-slate-900 font-medium rounded-xl appearance-none cursor-pointer outline-none font-body"><option value="trucks">Ciężarowe</option><option value="bus">Autokary</option></select>
                        </div>
                      </div>
                    </div>
                  </StepWrapper>
                )}
                {step === 6 && (
                  <StepWrapper>
                    <div className="max-w-lg">
                      <h2 className="text-3xl font-bold text-[#01152F] mb-4 font-heading">Wypłata środków</h2>
                      <p className="text-slate-500 mb-8 font-body">Wpisz numer konta, na który przelejemy zwrot.</p>
                      <div className={`bg-gradient-to-br from-slate-900 to-[#01152F] p-8 rounded-2xl shadow-xl text-white mb-4 relative overflow-hidden transition-all duration-300 ${showSkipConfirm ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
                        <div className="flex justify-between items-start mb-8"><CreditCard className="w-8 h-8 opacity-80"/><span className="text-xs font-bold bg-white/10 px-2 py-1 rounded font-body">PLN / EUR</span></div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block font-body">Numer IBAN</label>
                        <input name="iban" value={formData.iban} onChange={handleChange} className="w-full bg-transparent border-b-2 border-slate-600 focus:border-[#E86C3F] outline-none text-2xl font-mono tracking-wider placeholder-slate-600 pb-2 transition-colors uppercase" placeholder="PL00..." maxLength={40} autoComplete="off" disabled={showSkipConfirm} />
                        {!formData.ibanSkipped && formData.iban && isValidIBAN(formData.iban) && (<div className="absolute top-8 right-8 flex items-center text-green-400 text-xs font-bold animate-in fade-in zoom-in font-body"><Check size={16} className="mr-1" /> OK</div>)}
                      </div>
                      {!formData.ibanSkipped && formData.iban && isValidIBAN(formData.iban) && (
                         <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg justify-center mb-4 border border-green-200 animate-in fade-in slide-in-from-top-2 font-body"><Check size={18} /><span className="font-medium">Numer poprawny! Możesz przejść dalej.</span></div>
                      )}
                      {!formData.ibanSkipped && !isValidIBAN(formData.iban) && (<div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 p-3 rounded-lg justify-center mb-4 font-body"><ShieldCheck size={14}/> Połączenie szyfrowane SSL 256-bit</div>)}
                      {errors.iban && <p className="text-red-500 font-bold mb-4 flex items-center justify-center font-body"><AlertCircle size={16} className="mr-2"/>{errors.iban}</p>}
                      {!showSkipConfirm ? (
                        <button onClick={() => setShowSkipConfirm(true)} className="w-full text-center text-sm text-slate-500 hover:text-[#01152F] font-medium transition-colors font-body">Uzupełnię numer konta później</button>
                      ) : (
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-4">
                          <div className="flex items-start gap-3 mb-3"><AlertTriangle className="text-orange-500 shrink-0" size={20} /><p className="text-sm text-slate-800 font-medium font-body">Jeśli pominiesz ten krok, <strong>będziesz musiał dostarczyć numer konta później</strong>, abyśmy mogli przelać Ci zwrot. Czy na pewno chcesz kontynuować?</p></div>
                          <div className="flex gap-3 mt-2"><button onClick={() => setShowSkipConfirm(false)} className="flex-1 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors font-body">Wróć</button><button onClick={handleSkipIban} className="flex-1 py-2 rounded-lg bg-orange-100 text-[#E86C3F] text-sm font-bold hover:bg-orange-200 transition-colors font-body">Tak, dostarczę później</button></div>
                        </div>
                      )}
                    </div>
                  </StepWrapper>
                )}
                {step === 7 && (
                  <StepWrapper>
                    <h2 className="text-3xl font-bold text-[#01152F] mb-6 font-heading">Podsumowanie</h2>
                    
                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 mb-8 shadow-sm">
                      <div className="border-b border-slate-100 pb-4 mb-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-heading">Dane Firmy</h4>
                          <div className="flex justify-between items-center mb-2"><span className="font-bold text-[#01152F] text-lg font-heading">{formData.companyName}</span></div>
                          <div className="text-sm text-slate-500 flex gap-4 font-body"><span>NIP: {formData.nip}</span><span>|</span><span>Forma: {formData.legalForm ? formData.legalForm.toUpperCase() : '—'}</span></div>
                      </div>
                      <div className="border-b border-slate-100 pb-4 mb-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-heading">Adres Korespondencyjny</h4>
                          <div className="text-sm text-slate-700 font-body">{formData.sameAddress === 'yes' ? `${formData.seatAddress}, ${formData.seatPostal} ${formData.seatCity}` : `${formData.corrAddress}, ${formData.corrPostal} ${formData.corrCity}`}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4 mb-4">
                          <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-heading">Kontakt</h4><div className="text-sm text-slate-700 font-body"><div>{formData.email}</div><div>{formData.phone}</div></div></div>
                          <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-heading">Liczba pojazdów</h4><div className="text-sm text-slate-700 font-body">{formData.fleetSize || '—'}{FLEET_LABELS[formData.fleetType] && ` (${FLEET_LABELS[formData.fleetType]})`}</div></div>
                      </div>
                      <div className="mb-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-heading">Wypłata środków</h4>
                          <div className={`text-sm font-mono p-2 rounded inline-block ${formData.ibanSkipped ? 'bg-orange-50 text-orange-600 font-bold' : 'bg-slate-50 text-slate-600'}`}>{formData.ibanSkipped ? '⚠️ Numer konta do uzupełnienia' : `${formData.iban ? formData.iban.replace(/\s/g, '').slice(0, 2) : ''} **** **** **** **** **** ${formData.iban ? formData.iban.replace(/\s/g, '').slice(-4) : ''}`}</div>
                      </div>
                      <div><span className="text-slate-400 font-bold uppercase text-xs block mb-2 font-heading">Kraje Zwrotu</span><div className="text-sm text-slate-700 font-body">{Object.entries(formData.countries).filter(([k, v]) => v && k !== 'None').map(([k]) => k).join(', ')}</div></div>
                    </div>
                    <label className={`flex items-start p-5 border rounded-xl cursor-pointer transition-all duration-200 ${errors.consent ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <div className="relative flex items-center h-6"><input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="w-5 h-5 border-2 border-slate-300 rounded text-[#E86C3F] focus:ring-[#E86C3F] accent-[#E86C3F] cursor-pointer" /></div>
                      <span className="ml-4 text-sm text-slate-600 leading-relaxed font-body">Oświadczam, że zapoznałem się z Regulaminem i wyrażam zgodę na przetwarzanie danych osobowych przez Fox up sp. z o.o. w celu przygotowania dokumentów do rozpoczęcia współpracy.</span>
                    </label>
                    {errors.consent && <p className="text-red-500 font-bold text-sm mt-3 ml-1 flex items-center font-body"><AlertCircle size={16} className="mr-2"/>{errors.consent}</p>}
                  </StepWrapper>
                )}
              </div>
              <div className="p-6 md:p-10 border-t border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky bottom-0 z-20 rounded-b-3xl">
                <button onClick={prevStep} disabled={step === 1 || loading || (step === 1 && formData.countries.None) || (step === 6 && showSkipConfirm)} className={`text-slate-400 font-bold hover:text-[#01152F] transition-colors flex items-center gap-2 font-body ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}><ChevronLeft size={18}/> Wstecz</button>
                {!formData.countries.None && (
                  <button onClick={step === 7 ? handleSubmit : nextStep} disabled={loading || (step === 6 && showSkipConfirm)} className="bg-[#E86C3F] hover:bg-[#d55f32] text-white px-8 py-4 rounded-lg font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:transform-none font-body">{loading ? 'Przetwarzanie...' : step === 7 ? 'Wyślij Zgłoszenie' : <>Dalej <ChevronRight size={18}/></>}</button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mt-8 text-slate-400 text-xs text-center font-medium font-body">&copy; 2025 Fox up sp. z o.o. • Wszelkie prawa zastrzeżone</div>
    </div>
  );
}