import React from "react";
import { useMonth } from "@datepicker-react/hooks";
import Day from "./Day";

function Month({ year, month, firstDayOfWeek }) {
  const { days, weekdayLabels, monthLabel } = useMonth({
    year,
    month,
    firstDayOfWeek
  });

  return (
    <div
      className="monthCal"
      style={{ margin: "2em", backgroundColor: "white" }}
    >
      <div style={{ textAlign: "center", margin: "0 0 16px" }}>
        <strong>{monthLabel}</strong>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          justifyContent: "center",
          marginBottom: "10px",
          fontSize: "10px"
        }}
      >
        {weekdayLabels.map(dayLabel => (
          <div style={{ textAlign: "center" }} key={dayLabel}>
            {dayLabel}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          justifyContent: "center"
        }}
      >
        {days.map((day, index) => {
          if (typeof day === "object") {
            return (
              <Day
                date={day.date}
                key={day.date.toString()}
                dayLabel={day.dayLabel}
              />
            );
          }
          return <div key={index} />;
        })}
      </div>
    </div>
  );
}

export default Month;
