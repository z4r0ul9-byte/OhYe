import { useState } from 'react'
import WizardLayout from './components/Wizard/WizardLayout'
import Step1 from './components/Wizard/Step1'
import Step2 from './components/Wizard/Step2'
import Step3 from './components/Wizard/Step3'
import Step4 from './components/Wizard/Step4'
import Step5 from './components/Wizard/Step5'

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
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const update = (patch) => setFormData((prev) => ({ ...prev, ...patch }))

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
    if (currentStep === 5) return !isGenerating && !isDone 
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
      case 1: return <Step1 data={formData} update={update} />
      case 2: return <Step2 data={formData} update={update} />
      case 3: return <Step3 data={formData} update={update} />
      case 4: return <Step4 data={formData} update={update} />
      case 5: return <Step5 data={formData} />
      default: return null
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
      hideNextButton={currentStep === 5}
    >
      {renderStep()}
    </WizardLayout>
  )
}
