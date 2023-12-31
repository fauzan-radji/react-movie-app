import { ACTIONS, ALERT } from "../Constants";
import { ErrorAlert, SuccessAlert, WarningAlert } from "./";

import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

export default function AlertContainer({ alerts, dispatch, className }) {
  return (
    <div className={twMerge(`mx-auto my-4 flex  flex-col gap-2`, className)}>
      {alerts.map((alert, index) => {
        if (alert.type === ALERT.ERROR) {
          return (
            <ErrorAlert
              key={index}
              className="w-full"
              close={() =>
                dispatch({ type: ACTIONS.ALERT_REMOVE, payload: alert.id })
              }
            >
              <p>{alert.message}</p>
            </ErrorAlert>
          );
        }

        if (alert.type === ALERT.SUCCESS) {
          return (
            <SuccessAlert
              key={index}
              className="w-full"
              close={() =>
                dispatch({ type: ACTIONS.ALERT_REMOVE, payload: alert.id })
              }
            >
              <p>{alert.message}</p>
            </SuccessAlert>
          );
        }

        if (alert.type === ALERT.WARNING) {
          return (
            <WarningAlert
              key={index}
              className="w-full"
              close={() =>
                dispatch({ type: ACTIONS.ALERT_REMOVE, payload: alert.id })
              }
            >
              <p>{alert.message}</p>
            </WarningAlert>
          );
        }
      })}
    </div>
  );
}

AlertContainer.propTypes = {
  alerts: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  className: PropTypes.string,
};
