import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(inputString: string) {
  // remove non ascii characters
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}
type DivRef = HTMLDivElement | null;
export type Divisions = {
  percentage: number;
  color: string;
  order: number;
}[];
export function segmentContainer(containerRef: DivRef, divisions: Divisions) {
  if (containerRef) {
    containerRef.style.position = "relative";
  }
  divisions.forEach((division, index) => {
    const segment = document.createElement("div");
    segment.style.position = "absolute";
    segment.style.left = `${divisions.slice(0, index).reduce((acc, curr) => acc + curr.percentage, 0) * 100}%`; // Calculate left position
    segment.style.top = `0`; // Calculate left position
    segment.style.width = `${division.percentage * 100}%`;
    segment.style.height = "100%";
    segment.style.backgroundColor = division.color;
    segment.style.zIndex = "1";
    segment.style.opacity = "0.7";

    // if (index === 0) {
    //   segment.className = `rounded-tl-md rounded-bl-md`;
    // }
    // if (index === divisions.length - 1) {
    //   segment.className = `rounded-tr-md rounded-br-md`;
    // }
    segment.className = `${division.color}`;

    if (containerRef) {
      containerRef.appendChild(segment);
    }
  });
}
