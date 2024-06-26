import {
  AlertContainer,
  CreditCard,
  Header,
  Heading,
  Icons,
  Tickets,
} from "../Components";
import {
  CreditCard as CreditCardSkeleton,
  Header as HeaderSkeleton,
} from "../Skeletons";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useEffect, useReducer } from "react";

import { ACTIONS } from "../Constants";
import { alert as alertReducer } from "../Reducers";
import { calculateAge } from "../utils";
import { useAuth } from "../Context/Auth";
import { useFetch } from "../hooks";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export default function Profile() {
  const { isLoggedIn, token, setToken } = useAuth();
  const [alerts, dispatch] = useReducer(alertReducer, []);
  const {
    data: user,
    error: userError,
    isLoading: userIsLoading,
  } = useFetch(`${API_ENDPOINT}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    if (!userError) return;
    dispatch({ type: ACTIONS.ERROR_PUSH, payload: userError });
  }, [userError]);

  const location = useLocation();
  useEffect(() => {
    if (!location.state) return;

    const { successMessage } = location.state;
    delete location.state;
    if (successMessage) {
      dispatch({
        type: ACTIONS.SUCCESS_PUSH,
        payload: successMessage,
      });
    }
  }, [location]);

  if (!isLoggedIn) return <Navigate to="/login" replace={true} />;
  if (!userIsLoading && !user) setToken("");

  return (
    <div className="flex flex-col pb-4">
      <Heading
        rightButton={
          <button
            className="absolute right-0 top-0 flex aspect-square h-full items-center justify-center rounded-md border border-danger-600 px-2 py-1 text-danger-600"
            onClick={() => setToken("")}
          >
            <Icons.Logout className="h-4 w-4" />
          </button>
        }
      >
        My Profile
      </Heading>

      <AlertContainer alerts={alerts} dispatch={dispatch} />

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-start md:gap-12">
        <div className="flex flex-col gap-4 md:sticky">
          <div className="flex flex-col gap-1">
            {userIsLoading ? (
              <>
                <HeaderSkeleton />
                <span className="mx-auto h-5 w-32 animate-pulse rounded bg-complimentaryDark/30"></span>
              </>
            ) : (
              <>
                <Header className="py-0">{user.name}</Header>
                <p className="text-center text-neutralContrast/50">
                  @{user.username} | {calculateAge(user.birthDate)} y.o
                </p>
              </>
            )}
          </div>
          {userIsLoading ? (
            <CreditCardSkeleton />
          ) : (
            <CreditCard balance={user.balance} email={user.email} />
          )}
          <div className="mx-auto flex w-full max-w-lg gap-4">
            <Link
              to="/profile/topup"
              className={`flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-2 py-3 text-accentContrast ${
                userIsLoading && "pointer-events-none opacity-50"
              }`}
            >
              <Icons.TopUp className="h-6 w-6" /> Top Up
            </Link>
            <Link
              to="/profile/withdraw"
              className={`flex flex-1 items-center justify-center gap-2 rounded-md bg-complimentary px-2 py-3 text-complimentaryContrast ${
                userIsLoading && "pointer-events-none opacity-50"
              }`}
            >
              <Icons.Withdraw className="h-6 w-6" /> Withdraw
            </Link>
          </div>
        </div>

        <div className="md:max-h-full">
          <Tickets excludeCancelled={true} alertDispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}
