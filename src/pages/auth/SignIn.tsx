import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white p-6">

      <div className="w-full max-w-md">
        {/* Walksy Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-purple-700">Walksy</h1>
          <p className="text-gray-600 mt-1">Welcome back! Let’s keep moving 🚶‍♂️💜</p>
        </div>

        {/* Clerk Sign In */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#6C2BD9",   // Walksy purple
                colorText: "#4B5563",
                colorInputBackground: "#ffffff",
                colorInputText: "#111827",
              },
              elements: {
                card: "shadow-none border-0 bg-transparent",
                header: "hidden",
                socialButtonsBlockButton:
                  "border rounded-xl py-3 shadow-sm hover:bg-purple-50 transition",
                formFieldInput:
                  "rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400",
                formButtonPrimary:
                  "rounded-xl bg-purple-600 hover:bg-purple-700 text-white py-3 text-md font-semibold shadow-md transition",
              },
            }}
          />
        </div>

        {/* Sign Up Redirect */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don’t have an account?{" "}
          <a
            href="/sign-up"
            className="text-purple-600 font-semibold hover:underline"
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
