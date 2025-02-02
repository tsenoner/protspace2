const SvgSpinner = () => {
  return (
    <div className="w-12 h-12 flex justify-center items-center">
      <img
        src="logo.svg"
        style={{ height: '42px' }}
        alt="Logo"
        className="animate-spin h-12 w-12"
      />
    </div>
  );
};

export default SvgSpinner;
