import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import { loginWithGoogle } from "../../../../redux/actions";
const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const data = await res.json();

        const userData = {
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
          googleId: data.sub,
          picture: data.picture,
        };

        dispatch(loginWithGoogle(userData));

        navigate("/dashboard");
      } catch (error) {
        console.error("Errore nel login con Google:", error);
      }
    },
    onError: () => {
      console.error("Login Google fallito");
    },
  });

  return (
    <button
      onClick={() => login()}
      className="focusfield-btn-outline d-flex align-items-center justify-content-center gap-2 mx-auto"
      style={{ width: "16rem" }}
    >
      <i className="bi bi-google"></i>
      Google
    </button>
  );
};

export default GoogleLoginButton;
