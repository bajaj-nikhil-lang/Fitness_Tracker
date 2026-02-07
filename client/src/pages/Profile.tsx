import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext"
import { useTheme } from "../context/ThemeContext";
import type { ProfileFormData, UserData } from "../types";
import Card from "../components/ui/Card";
import { Calendar, LogOutIcon, MoonIcon, Scale, SunIcon, Target, User } from "lucide-react";
import Button from "../components/ui/Button";
import { goalLabels, goalOptions } from "../assets/assets";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
// import mockApi from "../assets/mockApi";
import toast from "react-hot-toast";
import api from "../configs/api";

// =======================================================================================

const Profile = () => {
  const {user, logout, fetchUser, allFoodLogs, allActivityLogs} = useAppContext();
  const { theme, toggleTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({age: 0, weight: 0, height: 0, goal: 'maintain', dailyCalorieIntake: 2000, dailyCalorieBurn: 400 })

// =============================================================================================

  const fetchUserData = () => {
    if(user) {
      setFormData({
        age: user?.age || 0,
        weight: user?.weight || 0,
        height: user?.height || 0,
        goal: user?.goal || 'maintain',
        dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
        dailyCalorieBurn: user?.dailyCalorieBurn || 400
      })
    }
  }

  // =================================================================================================

  useEffect(()=> {
    (()=> {
      fetchUserData()
    })();
  },[user])

  // =================================================================================================

  const handleSave = async () => {
    try {
      // // Mock API Update
      // const updates: Partial<UserData> = {
      //   ...formData,
      //   goal: formData.goal as 'lose' | 'maintain' | 'gain'
      // };
      // await mockApi.user.update(user?.id || '', updates)

      await api.put(`/api/users/${user?.id}`, formData)
      await fetchUser(user?.token || '')
      toast.success('Profile updated successfully')
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || 'Failed to updated profile');
    }
    setIsEditing(false)
  }

  // =============================================================================================

  const getStats = () => {
    const totalFoodEntries = allFoodLogs?.length || 0;
    const totalActivities = allActivityLogs?.length || 0;

    return {totalFoodEntries, totalActivities}
  }

  // ==========================================================================================

  const stats = getStats();

  if(!user || !formData) return null;

  // ==========================================================================================

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your settings</p>
      </div>

      <div className="profile-content">
        {/* Left Column */}
        <Card>
          {/* Card Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <User className="size-6 text-white"/>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Your Profile</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">

              <Input label="Age" type="number" value={formData.age} onChange={(v)=> setFormData({...formData, age: Number(v)})} min={13} max={120}/>

              <Input label="Weight (kg)" type="number" value={formData.weight} onChange={(v)=> setFormData({...formData, weight: Number(v)})} min={20} max={300}/>

              <Input label="Height (cm)" type="number" value={formData.height} onChange={(v)=> setFormData({...formData, height: Number(v)})} min={100} max={250}/>

              <Select label="Fitness Goal" value={formData.goal as string} onChange={(v)=> setFormData({...formData, goal: v as 'lose' | 'maintain' | 'gain'})} options={goalOptions}/>

                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" className="flex-1" 
                    onClick={()=> {
                      setIsEditing(false);
                      setFormData({
                        age: Number(user.age),
                        weight: Number(user.weight),
                        height: Number(user.height),
                        goal: user.goal || '',
                        dailyCalorieIntake: user.dailyCalorieIntake || 2000,
                        dailyCalorieBurn: user.dailyCalorieBurn || 400
                      })
                    }}>
                    Cancel
                  </Button>

                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">

                {/* Age */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                  <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Calendar className="size-4.5 text-blue-600 dark:text-blue-400"/>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Age</p>
                    <p className="font-semibold text-slate-800 dark:text-white">{user.age} years</p>
                  </div>
                </div>

                {/* Weight */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                  <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Scale className="size-4.5 text-purple-600 dark:text-purple-400"/>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Weight</p>
                    <p className="font-semibold text-slate-800 dark:text-white">{user.weight} kg</p>
                  </div>
                </div>

                {/* Height */}
                {user.height !== 0 && (
                  <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                    <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <User className="size-4.5 text-green-600 dark:text-green-400"/>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Height</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{user.height} cm</p>
                    </div>
                  </div>
                )}

                {/* Goal */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                  <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <Target className="size-4.5 text-orange-600 dark:text-orange-400"/>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Goal</p>
                    <p className="font-semibold text-slate-800 dark:text-white">{goalLabels[user?.goal || 'gain']}</p>
                  </div>
                </div>

              </div>

              <Button variant="secondary" onClick={()=> setIsEditing(true)} className="w-full mt-4">
                Edit Profile
              </Button>
            </>
          )}

        </Card>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Stats Card */}
          <Card>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.totalFoodEntries}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Food entries</p>
              </div>

              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalActivities}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Activities</p>
              </div>
            </div>
            
          </Card>

          {/* Toggle theme button for phone */}
          <div className="lg:hidden">
            <button onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors duration-200 cursor-pointer">
              {theme === 'light' ? <MoonIcon className="size-5"/> : <SunIcon className="size-5"/>}
              <span className="text-base">{theme == 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          {/* Logout button */}
          <Button variant="danger" onClick={logout} className="w-full ring ring-red-300 hover:ring-2">
            <LogOutIcon className="size-4"/>
            Louout
          </Button>

        </div>
      </div>
    </div>
  )
}

export default Profile