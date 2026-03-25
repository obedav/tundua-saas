export default function PublicPageBackground() {
  return (
    <>
      {/* Animated gradient base */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-teal-50/30 to-cyan-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 transition-colors duration-300" />

      {/* Warm dark mode mesh overlay */}
      <div
        className="fixed inset-0 -z-10 hidden dark:block"
        style={{
          backgroundImage: [
            "radial-gradient(at 40% 20%, rgba(180, 83, 9, 0.08) 0px, transparent 50%)",
            "radial-gradient(at 80% 0%, rgba(59, 130, 246, 0.1) 0px, transparent 50%)",
            "radial-gradient(at 0% 50%, rgba(217, 119, 6, 0.06) 0px, transparent 50%)",
            "radial-gradient(at 80% 50%, rgba(20, 184, 166, 0.08) 0px, transparent 50%)",
            "radial-gradient(at 0% 100%, rgba(245, 158, 11, 0.05) 0px, transparent 50%)",
          ].join(", "),
        }}
      />

      {/* Gradient orbs */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl" />
    </>
  );
}
