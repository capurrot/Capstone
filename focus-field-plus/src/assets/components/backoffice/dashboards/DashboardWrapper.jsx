import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router";
import AdminDashboard from "./AdminDashboard";
import FocusNavBar from "../../home/FocusNavBar";
import UserDashboard from "./UserDashboard";
import SellerDashboard from "./SellerDashboard";
import { fetchCurrentUser } from "../../../../redux/actions";
import Footer from "../../home/Footer";

const DashboardWrapper = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    if (!user && token) {
      dispatch(fetchCurrentUser());
    }
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
        <AdminDashboard user={user} />
      ) : roles.includes("ROLE_USER") ? (
        <UserDashboard user={user} />
      ) : roles.includes("ROLE_SELLER") ? (
        <SellerDashboard user={user} />
      ) : (
        <Navigate to="/unauthorized" replace />
      )}
      <Footer />
    </>
  );
};

export default DashboardWrapper;
