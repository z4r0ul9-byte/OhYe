import { useState } from 'react'
import WizardLayout from './components/Wizard/WizardLayout'
import Step1 from './components/Wizard/Step1'
import Step5 from './components/Wizard/Step5'
import PlaceholderStep from './components/Wizard/PlaceholderStep'

const INITIAL_DATA = {
  mode: '',
  websiteUrl: '',
  html: '',
  uploadedFile: null,
  uploadedFileName: null,
  uploadedFileSize: null,
  appName: '',
  appIcon: null,
  appIconPreview: null,
  splashColor: '#5c5cff',
  themeColor: '#5c5cff',
  features: {},
  permissions: [],
}

const STEPS = [
  { id: 1, label: 'Aplikasi' },
  { id: 2, label: 'Tampilan' },
  { id: 3, label: 'Fitur' },
  { id: 4, label: 'Izin' },
  { id: 5, label: 'Selesai' },
]

export default function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(INITIAL_DATA)
  
  // State untuk mengontrol proses generate di Step 5
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const update = (patch) => setFormData((prev) => ({ ...prev, ...patch }))

  // Validasi khusus Step 1
  const isStep1Valid = (() => {
    if (!formData.mode) return false
    if (formData.appName.trim().length === 0) return false

    switch (formData.mode) {
      case 'website': return formData.websiteUrl.trim().length > 0
      case 'html': return formData.html.trim().length > 0
      case 'livedev': return true
      case 'zip':
      case 'docs':
      case 'gallery': return Boolean(formData.uploadedFile)
      default: return false
    }
  })()

  const canAdvance = () => {
    if (currentStep === 1) return isStep1Valid
    if (currentStep === 5) return !isGenerating && !isDone // Disable next kalau sedang generate/done
    return true
  }

  const handleNext = () => {
    if (currentStep < STEPS.length && canAdvance()) {
      setCurrentStep((s) => s + 1)
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 data={formData} update={update} />
      case 5:
        return <Step5 data={formData} />
      default:
        return (
          <PlaceholderStep
            step={currentStep}
            title={STEPS[currentStep - 1].label}
          />
        )
    }
  }

  return (
    <WizardLayout
      steps={STEPS}
      currentStep={currentStep}
      onNext={handleNext}
      onPrev={handlePrev}
      canNext={canAdvance()}
      isLast={currentStep === STEPS.length}
      hideNextButton={currentStep === 5} // Sembunyikan tombol Lanjut/Generate di footer karena sudah ada di dalam Step5
    >
      {renderStep()}
    </WizardLayout>
  )
}
