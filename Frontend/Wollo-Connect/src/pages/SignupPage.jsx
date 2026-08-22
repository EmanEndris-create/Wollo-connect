import { useState } from "react";
import { Link } from "react-router-dom";
import useMutateQuery from "../hooks/useMutateQuery";
import { setAccessToken } from "../lib/token";

function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const {
    mutate: signupMutation,
    isPending,
    error,
  } = useMutateQuery({
    method: "POST",
    url: "/auth/signup",
    queryKey: "authUser",
  });

  const handleSignup = (e) => {
    e.preventDefault();

    signupMutation(formData, {
      onSuccess: (data) => {
        console.log("Signup successful:", data);
        setAccessToken(data.accessToken);
      },
    });
  };

  return (
    <div className="min-h-screen w-full flexCenter bg-[#f3f4f6] p-4">
      {/* Main Signup Container */}
      <div className="w-full max-w-4xl bg-white rounded-xl p-6 flex flex-col md:flex-row gap-6">

        {/* ================= LEFT SIDE ================= */}
        <div className="w-full md:w-1/2 bg-base-100 p-6 md:p-8 rounded-box">

          {/* Logo */}
          <div>
            <img
              src="/logo.jpg"
              alt="Wollo-Connect"
              className="w-60 h-auto"
            />
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h2 className="font-bold">
              Get Started
            </h2>

            <p className="para mt-1">
              Welcome to Wollo-Connect. Please fill in the form below to
              create an account.
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {error.response?.data?.message ||
                  "Something went wrong. Please try again."}
              </span>
            </div>
          )}
          {/* ================= FORM ================= */}
          <form onSubmit={handleSignup}>

            {/* Full Name */}
            <fieldset className="fieldset mb-3">
              <legend className="fieldset-legend py-0.5">
                Full Name
              </legend>

              <label className="input input-sm validator w-full">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
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
                Must be 3 to 50 characters containing only letters, spaces,
                hyphens or apostrophes.
              </p>
            </fieldset>

            {/* Email */}
            <fieldset className="fieldset mb-3">
              <legend className="fieldset-legend py-0.5">
                Email
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
                    <rect
                      width="20"
                      height="16"
                      x="2"
                      y="4"
                      rx="2"
                    />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </g>
                </svg>

                <input
                  type="email"
                  placeholder="mail@site.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <p className="validator-hint hidden text-xs">
                Enter a valid email address.
              </p>
            </fieldset>

            {/* Password */}
            <fieldset className="fieldset mb-3">
              <legend className="fieldset-legend py-0.5">
                Password
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
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                    <circle
                      cx="16.5"
                      cy="7.5"
                      r=".5"
                      fill="currentColor"
                    />
                  </g>
                </svg>

                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  required
                  minLength="8"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must contain at least 8 characters, one number, one lowercase letter, and one uppercase letter"
                />
              </label>

              <p className="validator-hint hidden text-xs">
                Must be 8+ characters with at least one number, lowercase
                letter, and uppercase letter.
              </p>
            </fieldset>

            {/* Terms */}
            <div className="mt-2 mb-4">
              <label className="flexStart gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-xs"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      acceptTerms: e.target.checked,
                    })
                  }
                  required
                />

                <span className="text-xs">
                  I agree with the terms & conditions.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-sm w-full"
              disabled={isPending}
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </button>

            {/* Sign In */}
            <p className="text-xs mt-4 text-center md:text-left">
              Already have an account?{" "}
              <Link
                to="/login"
                className="link link-primary"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="hidden md:block w-full md:w-1/2">
          <div className="h-full min-h-125 rounded-box overflow-hidden">
            <img
              src="/signup-image.jpg"
              alt="Welcome to Wollo-Connect"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default SignupPage;