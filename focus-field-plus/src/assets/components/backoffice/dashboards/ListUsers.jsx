import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Spinner, Alert, Badge, Container, Image } from "react-bootstrap";
import { fetchUsers } from "../../../../redux/actions";
import {
  CheckCircleFill,
  XCircleFill,
  LockFill,
  Unlock,
  ClockHistory,
  Google,
  PersonCheck,
  ShieldLock,
  Person,
  Clock,
  ExclamationCircle,
} from "react-bootstrap-icons";

const getRoleInfo = (user) => {
  const role = (user.roles && user.roles[0]) || (user.authorities && user.authorities[0]?.authority) || "ROLE_USER";

  switch (role.toUpperCase()) {
    case "ROLE_ADMIN":
      return {
        label: "Admin",
        icon: <ShieldLock size={16} />,
        variant: "danger",
      };
    case "ROLE_SELLER":
      return {
        label: "Venditore",
        icon: <PersonCheck size={16} />,
        variant: "warning",
      };
    case "ROLE_USER":
    default:
      return {
        label: "Utente",
        icon: <Person size={16} />,
        variant: "primary",
      };
  }
};

const ListUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading)
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Caricamento utenti...</p>
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="mt-4">
        Errore: {error}
      </Alert>
    );

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Lista Utenti</h2>

      {users.length === 0 ? (
        <Alert variant="info">Nessun utente trovato.</Alert>
      ) : (
        <div className="d-flex flex-column gap-3">
          {users.map((user) => {
            const roleInfo = getRoleInfo(user);

            return (
              <Card key={user.id} className="shadow-sm p-3 d-flex flex-column flex-md-row align-items-md-center">
                <div className="flex-fill mb-3 mb-md-0">
                  <h5 className="mb-1 d-flex align-items-center gap-2">
                    {user.username || "Utente"}
                    <Badge bg="secondary">#{user.id}</Badge>
                  </h5>
                  <div className="text-muted small">{user.email || "-"}</div>
                  <div className="small">Nome: {user.nome && user.cognome ? `${user.nome} ${user.cognome}` : "-"}</div>
                  <div className="mt-2">
                    <Badge bg={roleInfo.variant} className="d-inline-flex align-items-center gap-1">
                      {roleInfo.icon}
                      {roleInfo.label}
                    </Badge>
                  </div>
                </div>

                <div className="d-flex justify-content-between justify-content-md-end flex-wrap gap-3">
                  <div className="text-center">
                    <small className="text-muted">Account</small>
                    <div>
                      {user.accountNonExpired ? (
                        <CheckCircleFill className="text-success" title="Account attivo" />
                      ) : (
                        <XCircleFill className="text-danger" title="Account disattivato" />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <small className="text-muted">Stato</small>
                    <div>
                      {user.accountNonLocked ? (
                        <Unlock className="text-success" title="Account abilitato" />
                      ) : (
                        <LockFill className="text-danger" title="Account bloccato" />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <small className="text-muted">Password</small>
                    <div>
                      {user.googleAccount ? (
                        <span className="text-muted">—</span>
                      ) : user.credentialsNonExpired ? (
                        <Clock className="text-success" title="Password valida" />
                      ) : (
                        <ExclamationCircle className="text-danger" title="Password scaduta" />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <small className="text-muted">Accesso</small>
                    <div>
                      {user.googleAccount ? (
                        <Google className="text-danger" title="Accesso con Google" />
                      ) : (
                        <PersonCheck className="text-secondary" title="Accesso classico" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default ListUsers;
