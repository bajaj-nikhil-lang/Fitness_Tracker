// import { ArrowLeft, ArrowRight, PersonStanding, ScaleIcon, Target, User, Weight } from "lucide-react"
import { ArrowLeft, ArrowRight, PersonStanding, ScaleIcon, Target, User } from "lucide-react"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useAppContext } from "../context/AppContext";
// import type { ProfileFormData, UserData } from "../types";
import type { ProfileFormData } from "../types";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
// import mockApi from "../assets/mockApi";
import { ageRanges, goalOptions } from "../assets/assets";
import Slider from "../components/ui/Slider";
import api from "../configs/api";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const {user, setOnboardingCompleted, fetchUser} = useAppContext()
  const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height: 0,
    goal: 'maintain',
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400
  })

  //   const [formData, setFormData] = useState<ProfileFormData>({
  //   age: "",
  //   weight: "",
  //   height: "",
  //   goal: "maintain",
  //   dailyCalorieIntake: 2000,
  //   dailyCalorieBurn: 400
  // });


  const totalSteps = 3;

  const updateField = (field: keyof ProfileFormData, value: string | number) => {
    setFormData({...formData, [field]: value})
  }

  const handleNext = async () => {
    if (step === 1) {
      if(!formData.age || Number(formData.age) < 13 || Number(formData.age) > 120) {
        return toast("Age is required")
      }
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const userData = {
        ...formData,
        age: formData.age,
        weight: formData.weight,
        height: formData.height ? formData.height : null,
        // age: Number(formData.age),
        // weight: Number(formData.weight),
        // height: formData.height ? Number(formData.height) : null,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('fitnessUser', JSON.stringify(userData))
      // await mockApi.user.update(user?.id || "", userData as unknown as Partial<UserData>)

      try {
        await api.put(`/api/users/${user?.id}`, userData)
        toast.success('Profile updated successfully')
        setOnboardingCompleted(true)
        fetchUser(user?.token || "")
      } catch (error: any) {
        toast.error(error.message)
      }
      
    }
  }

  return (
    <>
      <Toaster />
      <div className="onboarding-container">
        {/* Header */}
        <div className="p-6 pt-12 onboarding-wrapper">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <PersonStanding className="w-6 h-6 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">FitTrack</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-4">Let's personalize your experience</p>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 mb-8 onboarding-wrapper">
          <div className="flex gap-2 max-w-2xl">
            {[1,2,3].map((s)=>(
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`}/>
            ))}
          </div>
          <p className="text-sm text-slate-400 mt-3">Step {step} of {totalSteps}</p>
        </div>

        {/* Form Content */}
        <div className="flex-1 px-6 onboarding-wrapper">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">

                <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center">
                  <User className="size-6 text-emerald-600 dark:text-emerald-400"/>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">How old are you?</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">This helps us calculate your needs</p>
                </div>
              </div>
              <Input label="Age" type="number" className="max-w-2xl" value={formData.age} onChange={(v)=>updateField('age', v)} placeholder="Enter your age" min={13} max={120} required/>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 onboarding-wrapper">
              <div className="flex items-center gap-4 mb-8">

                <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center">
                  <ScaleIcon className="size-6 text-emerald-600 dark:text-emerald-400"/>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Your measurements</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Help us track your progress</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 max-w-2xl">

                <Input label="Weight (kg)" type="number" value={formData.weight} onChange={(v)=>updateField('weight', v)} placeholder="Enter your weight" min={20} max={300} required/>

                <Input label="Height (cm) - Optional" type="number" value={formData.height} onChange={(v)=>updateField('height', v)} placeholder="Enter your height" min={100} max={250} />

              </div>

            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 onboarding-wrapper">
              <div className="flex items-center gap-4 mb-8">

                <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center">
                  <Target className="size-6 text-emerald-600 dark:text-emerald-400"/>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">What's your goal?</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">We'll tailor your experience</p>
                </div>
              </div>
              

              {/* Options */}
              <div className="space-y-4 max-w-lg">
                {goalOptions.map((option)=>(
                  <button 
                    key={option.value}
                    onClick={()=>{
                      const age = Number(formData.age);
                      const range = ageRanges.find((r)=>age <= r.max) || ageRanges[ageRanges.length - 1]

                      let intake = range.maintain;
                      let burn = range.burn;

                      if (option.value === 'lose') {
                        intake -= 400;
                        burn += 100;
                      } else if (option.value === 'gain') {
                        intake += 500;
                        burn -= 100;
                      }

                      setFormData({
                        ...formData,
                        goal: option.value as 'lose' | 'maintain' | 'gain',
                        dailyCalorieIntake: intake,
                        dailyCalorieBurn: burn,
                      })
                    }}
                    className={`onboarding-option-btn ${formData.goal === option.value && 'ring-2 ring-emerald-500'}`}>
                    <span className="text-base text-slate-700 dark:text-slate-200">{option.label}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 my-6 max-w-lg"></div>

              {/* Daily Targets */}
              <div className="space-y-8 max-w-lg">
                <h3 className="text-md font-medium text-slate-800 dark:text-white mb-4">Daily Targets</h3>

                <div className="space-y-6">

                  <Slider label="Daily Calorie Intake" min={120} max={4000} step={50} value={formData.dailyCalorieIntake} onChange={(v)=>updateField('dailyCalorieIntake', v)} unit="kcal" infoText="The total calories you plan to consume each day."/>

                  <Slider label="Daily Calorie Burn" min={100} max={2000} step={50} value={formData.dailyCalorieBurn} onChange={(v)=>updateField('dailyCalorieBurn', v)} unit="kcal" infoText="The total calories you aim to burn through exercise and activity each day."/>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="p-6 pb-10 onboarding-wrapper">
          <div className="flex gap-3 lg:justify-end">
            {step > 1 && (
              <Button variant="secondary" onClick={()=>setStep(step > 1 ? step - 1 : 1)} className="max-lg:flex-1 lg:px-10">
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5"/>
                  Back
                </span>
              </Button>
            )}
            <Button onClick={handleNext} className="max-lg:flex-1 lg:px-10">
              <span className="flex items-center justify-center gap-2">
                {step === totalSteps ? 'Get Started' : 'Continue'}
                <ArrowRight className="w-5 h-5"/>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Onboarding