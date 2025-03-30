export const Background = () => {
  return (
    <div className="absolute inset-0 w-dvw h-dvh bg-[url('/background.webp')] bg-repeat bg-center z-0">
      <div className="absolute inset-0 bg-black opacity-75"></div>
    </div>
  );
};
