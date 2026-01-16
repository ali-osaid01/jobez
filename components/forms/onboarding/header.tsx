export default function OnboardingHeader({
  step,
  title,
  totalSteps = 3,
  showProgress = true,  // Added showProgress flag
}: OnboardingHeaderProps) {
  const progress = Math.min(100, Math.max(0, (step / totalSteps) * 100));

  return (
    <header className="w-full bg-blue-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
        
        {/* ✅ SINGLE RESPONSIVE ROW (NO DUPLICATION) */}
        <div className="flex items-center justify-between gap-3 flex-wrap">

          {/* LEFT: LOGO */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider text-black">
            JOBEZ
          </h1>

          {/* CENTER: STEP + PROGRESS BAR */}
          {showProgress && (  // Only show if showProgress is true
            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
              <span className="font-medium whitespace-nowrap">
                Step {step} of {totalSteps}
              </span>

              <div className="w-36 sm:w-52 md:w-64 h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* RIGHT: TITLE (ONLY ONCE) */}
          <span className="text-xs sm:text-sm font-medium text-gray-800 whitespace-nowrap">
            {title}
          </span>

        </div>
      </div>
    </header>
  );
}
