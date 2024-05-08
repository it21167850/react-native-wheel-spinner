import { Path } from "react-native-svg";

export const generateBowShape = () => {
  const path = new Path();
  path.moveTo(25, 120);
  path.quadraticBezierTo(SCREEN_WIDTH / 2 - 40, 100, SCREEN_WIDTH / 2, 90);
  path.quadraticBezierTo(SCREEN_WIDTH / 2 + 40, 100, SCREEN_WIDTH - 25, 120);
  return path.toString(); // Convert Path object to string
};

export const generateDaggerShape = () => {
  const path = new Path();
  path.moveTo(SCREEN_WIDTH / 2 - 20, 115);
  path.lineTo(SCREEN_WIDTH / 2, 25);
  path.lineTo(SCREEN_WIDTH / 2 + 20, 115);
  return path.toString(); // Convert Path object to string
};

export const generateWheelSegments = (segments) => {
  const wheelSegments = [];
  let lastAngle = 0;
  segments.forEach((segmentValue, index) => {
    const angle = (360 / segments.length) * (index + 1);
    wheelSegments.push({
      pathData: arcPath(130, 100, lastAngle, angle),
      amount: segmentValue,
      rotationAngle: lastAngle + (angle - lastAngle) / 2,
      centroid: arcCentroid(130, lastAngle, angle),
    });
    lastAngle = angle;
  });
  return wheelSegments;
};

const arcPath = (r, R, startAngle, endAngle) => {
  const angle = endAngle - startAngle;
  const largeArcFlag = angle > 180 ? 1 : 0;
  const sweepFlag = 1;

  const p1 = polarToCartesian(r, startAngle);
  const p2 = polarToCartesian(r, endAngle);
  const p3 = polarToCartesian(R, endAngle);
  const p4 = polarToCartesian(R, startAngle);

  return [
    "M",
    p1[0],
    p1[1],
    "A",
    r,
    r,
    0,
    largeArcFlag,
    sweepFlag,
    p2[0],
    p2[1],
    "L",
    p3[0],
    p3[1],
    "A",
    R,
    R,
    0,
    largeArcFlag,
    0,
    p4[0],
    p4[1],
    "L",
    p1[0],
    p1[1],
  ].join(" ");
};

const polarToCartesian = (radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return [
    radius + radius * Math.cos(angleInRadians),
    radius + radius * Math.sin(angleInRadians),
  ];
};

const arcCentroid = (r, startAngle, endAngle) => {
  const angle = endAngle - startAngle;
  const largeArcFlag = angle > 180 ? 1 : 0;
  const sweepFlag = 1;
  const p1 = polarToCartesian(r, startAngle);
  const p2 = polarToCartesian(r, endAngle);
  const p3 = polarToCartesian(r, startAngle + angle / 2);
  return [p3[0], p3[1]];
};
