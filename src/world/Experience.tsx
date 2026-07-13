import { Atmosphere } from "./Atmosphere";
import { Corridor } from "./Corridor";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { ResponsiveCamera } from "./Responsive";
import { sectionZ } from "../theme";

import { Exterior } from "../sections/Exterior";
import { Agents } from "../sections/Agents";
import { Automation } from "../sections/Automation";
import { DataCenter } from "../sections/DataCenter";
import { Lab } from "../sections/Lab";
import { Industries } from "../sections/Industries";
import { Portfolio } from "../sections/Portfolio";
import { WhyUs } from "../sections/WhyUs";
import { Contact } from "../sections/Contact";

// Departments in journey order — each dropped at its slot along the -Z spine.
const DEPARTMENTS = [
  Exterior,
  Agents,
  Automation,
  DataCenter,
  Lab,
  Industries,
  Portfolio,
  WhyUs,
  Contact,
];

/** Everything that lives inside the Canvas + ScrollControls. */
export function Experience() {
  return (
    <>
      <ResponsiveCamera />
      <Atmosphere />
      <Corridor />
      <CameraRig />

      {DEPARTMENTS.map((Dept, i) => (
        <group key={i} position={[0, 0, sectionZ(i)]}>
          <Dept />
        </group>
      ))}

      <Effects />
    </>
  );
}
