"use client";

import { useState, useEffect } from "react";

export default function ClientComponentWeather(
  props: WeatherProps
): JSX.Element {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(1);
  }, []);

  useEffect(() => {
    if (count && count >= 4) {
      throw new Error("Count >= 4! ");
    }
  }, [count]);

  return (
    <h1
      onClick={() => {
        setCount(count + 1);
      }}
    >
      The weather is {props.weather}, and the counter shows {count}
    </h1>
  );
}
