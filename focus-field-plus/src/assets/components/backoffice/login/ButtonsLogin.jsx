import { useDispatch } from "react-redux";
import { useEffect } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import { loginWithFacebook } from "../../../../redux/actions";

const ButtonsLogin = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1198051718204410",
        cookie: true,
        xfbml: false,
        version: "v19.0",
      });
    };
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          dispatch(loginWithFacebook({ accessToken }));
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <div className="d-flex flex-column gap-2  w-100 px-4 mb-5">
      <p className="text-center">Or continue with</p>
      <GoogleLoginButton />
      <button
        className="focusfield-btn-outline d-flex align-items-center justify-content-center gap-2 mx-auto"
        style={{ width: "16rem" }}
        onClick={handleFacebookLogin}
      >
        <i className="bi bi-facebook"></i>
        Facebook
      </button>
    </div>
  );
};

export default ButtonsLogin;
