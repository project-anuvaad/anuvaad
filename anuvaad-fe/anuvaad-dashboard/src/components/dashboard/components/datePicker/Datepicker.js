import React, { useState } from "react";
import { useDatepicker, START_DATE } from "@datepicker-react/hooks";
import Month from "./Month";
import NavButton from "./NavButton";
import DatepickerContext from "./DatepickerContext";
import * as moment from "moment";

function Datepicker(props) {
  const [state, setState] = useState({
    startDate: null,
    endDate: null,
    focusedInput: START_DATE
  });

  const {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
    goToPreviousMonths,
    goToNextMonths
  } = useDatepicker({
    startDate: state.startDate,
    endDate: state.endDate,
    focusedInput: state.focusedInput,
    onDatesChange: handleDateChange
  });

  function handleDateChange(data) {
    if (!data.focusedInput) {
      setState({ ...data, focusedInput: START_DATE });
    } else {
      setState(data);
    }

    let sd = data.startDate;
    let ed = data.endDate;
    if (sd !== null && ed !== null) {
      let finalRange =
        moment(sd).format("DD MMM") + " - " + moment(ed).format("DD MMM");
      localStorage.setItem("selectedFilter", "Custom");
      localStorage.setItem("selectedDate", finalRange);
      setTimeout(() => {
        props.pathName.pathName.pathName.history.push({
          pathName: "/dashboards",
          state: { trigger: true }
        });
      }, 500);
      localStorage.setItem("startDate", moment(sd));
      localStorage.setItem("endDate", moment(ed));
    }
  }

  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover
      }}
    >
      <div
        className="row col-sm-12 customdatePicker"
        css={{
          display: "grid",
          margin: "32px 0 0",
          gridTemplateColumns: `repeat(${activeMonths.length}, 300px)`,
          gridGap: "0 64px"
        }}
      >
        <NavButton onClick={goToPreviousMonths}>{"<"}</NavButton>
        {activeMonths.map(month => (
          <Month
            key={`${month.year}-${month.month}`}
            year={month.year}
            month={month.month}
            firstDayOfWeek={firstDayOfWeek}
          />
        ))}
        <NavButton onClick={goToNextMonths}>{">"}</NavButton>
      </div>
    </DatepickerContext.Provider>
  );
}

export default Datepicker;
