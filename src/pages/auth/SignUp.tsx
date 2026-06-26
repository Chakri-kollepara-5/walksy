import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 
                    bg-gradient-to-b from-purple-100 to-white">

      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              card: "shadow-2xl rounded-2xl border border-purple-200",
              headerTitle: "text-purple-700 font-bold text-2xl",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton:
                "bg-purple-600 text-white hover:bg-purple-700",
              formButtonPrimary:
                "bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2",
            },
          }}
        />
      </div>

    </div>
  );
};

export default SignUpPage;
