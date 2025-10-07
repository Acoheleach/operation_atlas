"use client";

interface GameHeaderProps {
  timeRemaining?: number;
  currentStep?: string;
}

export function GameHeader({ timeRemaining, currentStep }: GameHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl"
      style={{
        position: "relative",
        zIndex: 1000,
        width: "90%",
        maxWidth: "48rem",
        marginTop: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div
        className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-[2rem] px-6 py-3 shadow-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "2px solid rgba(0, 123, 255, 0.2)",
          borderRadius: "2rem",
          padding: "0.75rem 1.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="logo-opération.png" alt="" className="w-[2.5rem]" />
            <h1 className="text-2xl font-bold text-primary tracking-wide">
              Opération Atlas
            </h1>
          </div>

          {timeRemaining !== undefined && (
            <div className="flex items-center gap-4">
              {currentStep && (
                <span className="text-sm text-muted-foreground font-medium">
                  {currentStep}
                </span>
              )}
              <div className="bg-primary/10 px-4 py-2 rounded-full">
                <span className="text-lg font-bold text-primary tabular-nums">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
