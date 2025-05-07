import GoogleLoginButton from "./GoogleLoginButton";

const ButtonsLogin = () => {
  return (
    <div className="d-flex flex-column gap-2  w-100 px-4 mb-5">
      <p className="text-center">Or continue with</p>
      <GoogleLoginButton />
      <button className="focusfield-btn-outline d-flex align-items-center justify-content-center gap-2">
        <i className="bi bi-facebook"></i>
        Facebook
      </button>
    </div>
  );
};

export default ButtonsLogin;
