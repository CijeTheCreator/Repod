import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import Ticker from "react-ticker";
interface OverflowTickerProps {
  text: string;
  className?: string;
}
const Overflowticker = ({ text, className }: OverflowTickerProps) => {
  const TEXTAMOUNT = 5000;
  const textRef = useRef<HTMLHeadingElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textArray: string[] = [];
  for (let i = 0; i < TEXTAMOUNT; i++) {
    textArray.push(".                                           " + text);
  }
  const text_ = textArray.join("");
  console.log(text_);

  useEffect(() => {
    // TODO: Get this width right, OverflowTicker
    const TEMPPARENTFIXWIDTH = 460;
    // let parentWidth;
    const checkOverflow = () => {
      if (textRef.current) {
        // const parentWithCorrectWidth = textRef.current.parentNode?.parentNode
        //   ?.parentNode?.parentNode?.parentNode as Element;
        // parentWidth = parentWithCorrectWidth.getBoundingClientRect().width;
        setIsOverflowing(textRef.current.scrollWidth > TEMPPARENTFIXWIDTH);
      }
    };

    // Check overflow on mount
    checkOverflow();

    // Optional: Check overflow on window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    // {isOverflowing ? (
    <div
      style={{
        width: "460px",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <h4
        className={cn("", className)}
        ref={textRef}
        style={{ display: "inline-block" }}
      >
        {text}
      </h4>
    </div>
  );
};

export default Overflowticker;
