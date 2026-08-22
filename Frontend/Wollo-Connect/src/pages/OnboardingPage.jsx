import useAuthUser from "../hooks/useAuthUser"
import { useState } from "react";
import useMutateQuery from "../hooks/useMutateQuery";
import toast from "react-hot-toast";
import {CameraIcon, ShuffleIcon} from "lucide-react"
import { LANGUAGES, SKILLS } from "../constants";


function OnboardingPage() {
  const {authenticatedUser} = useAuthUser();
  const [formData, setFormData] = useState({
    fullName: authenticatedUser?.fullName || '',
    image: authenticatedUser?.image || '',
    skill: authenticatedUser?.skill || '',
    language: authenticatedUser?.language || '',
    location: authenticatedUser?.location || '',
    bio: authenticatedUser?.bio || '',
  });

  const{
    mutate: onboardingMutation,
    isPending,
    error,
  } = useMutateQuery({
    method: "POST",
    url: "/user/onboarding",
  });

  const handleOnboarding = (e)=>{
    e.preventDefault();
    onboardingMutation(formData, {
      onSuccess: ()=>{
        console.log("user updated profile.");
        toast.success("Profile updated successfully.");
      },
    });
  };

  const handleRandomAvatar = ()=> {
    const idx = Math.floor(Math.random() * 1000) + 1; 
    const randomAvatar = `https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=alexander${idx}&style=circle`
    setFormData({...formData, image: randomAvatar})
    toast.success("Successfully changed random avatar")
  }

return (
  <div className="min-h-screen w-full flexCenter bg-[#f3f4f6] p-4">
    {/* Main Onboarding Container */}
    <div className="w-full max-w-4xl bg-white rounded-xl p-6">

      <div className="card bg-base-100 card-border border-base-300">
        <div className="card-body">

          {/* Header */}
          <div className="flexCenter flex-col text-center mb-6">
            <h2 className="font-bold">
              Complete Onboarding
            </h2>

            <p className="para mt-1">
              Please complete your profile to get started with Wollo-Connect.
            </p>

            {/* Profile Image */}
            <div className="mt-4">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-base-200 flexCenter">
                  <CameraIcon className="size-12 text-base-content opacity-40" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleRandomAvatar}
              className="btn btn-info btn-xs mt-3"
            >
              <ShuffleIcon className="size-4" />
              Generate another
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {error.response?.data?.message ||
                  "Something went wrong. Please try again."}
              </span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleOnboarding}>

            {/* Full Name + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Full Name */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend py-0.5">
                  Full Name
                </legend>

                <label className="input input-sm validator w-full">
                  <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </g>
                  </svg>

                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullName: e.target.value,
                      })
                    }
                    required
                    minLength="3"
                    maxLength="50"
                    pattern="^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$"
                    title="Only letters, spaces, hyphens or apostrophes"
                  />
                </label>

                <p className="validator-hint hidden text-xs">
                  Must be 3 to 50 characters containing only letters,
                  spaces, hyphens or apostrophes.
                </p>
              </fieldset>

              {/* Location */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend py-0.5">
                  Location
                </legend>

                <label className="input input-sm w-full">
                  <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </g>
                  </svg>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: e.target.value,
                      })
                    }
                    placeholder="City, Country"
                  />
                </label>
              </fieldset>
            </div>

            {/* Language + Skill */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">

              {/* Language */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend py-0.5">
                  Language
                </legend>

                <select
                  className="select select-sm w-full"
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      language: e.target.value,
                    })
                  }
                  required
                >
                  <option value="" disabled>
                    Pick your language
                  </option>

                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </fieldset>

              {/* Skill */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend py-0.5">
                  Skill
                </legend>

                <select
                  className="select select-sm w-full"
                  value={formData.skill}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skill: e.target.value,
                    })
                  }
                  required
                >
                  <option value="" disabled>
                    Select skill you're learning
                  </option>

                  {SKILLS.map((skill) => (
                    <option key={skill} value={skill.toLowerCase()}>
                      {skill}
                    </option>
                  ))}
                </select>
              </fieldset>
            </div>

            {/* Bio */}
            <fieldset className="fieldset mt-3">
              <legend className="fieldset-legend py-0.5">
                Bio
              </legend>

              <label className="input input-sm min-h-16 flex w-full items-start py-3">
                <svg
                  className="h-[1em] opacity-50 mt-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </g>
                </svg>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bio: e.target.value,
                    })
                  }
                  className="grow resize-none outline-none border-none"
                  placeholder="Tell others about yourself..."
                  rows="3"
                />
              </label>
            </fieldset>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-sm w-full mt-5"
              disabled={isPending}
            >
              {isPending ? "Completing Onboarding..." : "Complete Onboarding"}
            </button>

          </form>
        </div>
      </div>
    </div>
  </div>
);
}

export default OnboardingPage
