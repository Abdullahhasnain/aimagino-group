// A tiny frame-updated singleton describing where the "walker" is along the
// journey. Written once per frame by the CameraRig and read by scenes for
// parallax / reactive effects — avoids prop drilling and React re-renders.

export const travel = {
  offset: 0, // normalized scroll 0..1
  z: 0, // current world z of the walker
  velocity: 0, // smoothed scroll speed (drives walk cycle + sway)
  step: 0, // accumulated walk-cycle phase
};
