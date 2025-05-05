import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router";
import AdminDashboard from "./dashboards/AdminDashboard";
import FocusNavBar from "../home/FocusNavBar";
import UserDashboard from "./dashboards/UserDashboard";
import SellerDashboard from "./dashboards/SellerDashboard";
import { setUser } from "../../../redux/actions";

const DashboardWrapper = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);

  // Effettua la chiamata al backend per ottenere i dati utente
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8080/api/focus-field/auth/current-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Errore nel recupero dell'utente");

        const userData = await res.json();
        console.log("Dati utente:", userData);
        dispatch(setUser(userData));
      } catch (error) {
        console.error("Errore nel recuperare il profilo:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) fetchUser();
    else setLoading(false);
  }, [dispatch, token, user]);

  if (!token) return <Navigate to="/login" replace />;

  if (loading || !user || !user.roles) {
    return (
      <>
        <FocusNavBar />
        <div className="text-center py-5">Caricamento in corso...</div>
      </>
    );
  }

  const roles = Array.isArray(user.roles) ? user.roles : [user.roles];

  return (
    <>
      <FocusNavBar />
      {roles.includes("ROLE_ADMIN") ? (
        <AdminDashboard />
      ) : roles.includes("ROLE_USER") ? (
        <UserDashboard />
      ) : roles.includes("ROLE_SELLER") ? (
        <SellerDashboard />
      ) : (
        <Navigate to="/unauthorized" replace />
      )}
    </>
  );
};

export default DashboardWrapper;
