import Image from "next/image";
import { Gauge, GitBranch, Hammer, Route, ScanLine } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { DiagnosticCard } from "@/components/ui/DiagnosticCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusPill } from "@/components/ui/StatusPill";

const mediaBase = "/images/mechatronics";

const heroStats = ["1st Place", "Arduino Mega 2560", "PID Line Following", "State Machine"];

const systemOverview = [
  {
    title: "Course navigation",
    body: "The robot had one minute to follow a winding course with enough stability to reach the bar, align with the taps, and keep its mechanism square to the target.",
    icon: Route,
  },
  {
    title: "Clock-in and order detection",
    body: "Light and color sensing helped the robot recognize course cues, clock in, and interpret which drink order needed to be served before actuating the tap.",
    icon: ScanLine,
  },
  {
    title: "Tap selection and pull sequence",
    body: "A C++ state machine coordinated approach, alignment, arm positioning, tap pull timing, release, and reset so the robot could serve the correct tap.",
    icon: GitBranch,
  },
  {
    title: "Pour control and reset",
    body: "PWM-controlled servos pulled the tap without overfilling, then returned the arm to neutral so the robot could continue through the run.",
    icon: Gauge,
  },
];

const architectureSteps = [
  {
    title: "Sensors",
    detail: "Line sensors, light sensing, and color sensing provided the cues needed for navigation, clock-in behavior, and order recognition.",
    tags: ["line sensing", "light sensing", "color sensing"],
  },
  {
    title: "Arduino Mega 2560",
    detail: "The Mega ran the C++ state machine that decided when to follow the line, read the order, align to a tap, pull, reset, and continue.",
    tags: ["Arduino", "C++", "state machine"],
  },
  {
    title: "PID line following",
    detail: "PID control kept the robot centered through the winding course so the mechanical actuation sequence started from a repeatable position.",
    tags: ["PID", "course tracking", "control loop"],
  },
  {
    title: "Servo actuation",
    detail: "PWM drove the servo mechanism, including a high-torque base servo that pulled the top arm through a string linkage.",
    tags: ["PWM", "60kg servo", "dual servo"],
  },
  {
    title: "Mechanical tap pull",
    detail: "Laser-cut wood, 3D-printed arm geometry, claws, string tension, and springs worked together to pull the tap and return it cleanly.",
    tags: ["Fusion 360", "laser cut", "3D printed"],
  },
];

const galleryMedia = [
  {
    src: `${mediaBase}/photos/Robot%20-%20Front%20View%20-%20Outside%20of%20Course.jpeg`,
    alt: "Front view of the autonomous bartending robot outside the course",
    label: "Front build view",
  },
  {
    src: `${mediaBase}/photos/Robot%20-%20Claw%20mechinism%20-%20Outside%20oCourse.jpeg`,
    alt: "Close view of the robot claw and arm mechanism",
    label: "Claw mechanism",
  },
  {
    src: `${mediaBase}/photos/Robot%20-%20Pull%20Tap.jpeg`,
    alt: "Robot arm pulling a bar tap during the competition task",
    label: "Tap pull sequence",
  },
];

const reflections = [
  {
    title: "Competition result",
    body: "The team won first place and completed the only perfect run by successfully pulling three beer taps.",
  },
  {
    title: "Software structure",
    body: "A state machine kept navigation, sensing, order handling, actuation, and reset behavior predictable under competition timing.",
  },
  {
    title: "Mechanical design",
    body: "Fusion 360 parts, laser-cut wood, and 3D-printed arm/claw geometry turned a course robot into a task-specific machine.",
  },
  {
    title: "Integration lesson",
    body: "The winning run depended on tuning software timing and mechanical return behavior together, not treating them as separate problems.",
  },
];

export function MechatronicsProjectPage() {
  return (
    <>
      <section className="mechatronics-hero" aria-labelledby="mechatronics-title">
        <Container className="mechatronics-hero__grid">
          <div>
            <SectionLabel>Competition robotics</SectionLabel>
            <h1 id="mechatronics-title" className="page-headline">
              Autonomous Bartending Robot
            </h1>
            <p className="body-copy">
              A first-place Santa Clara mechatronics robot built to navigate a winding course, clock in,
              read the order, pull the correct tap, and complete a controlled pour without overfilling.
              Our final run was the only perfect three-tap run in the competition.
            </p>
            <div className="mechatronics-hero__stats" aria-label="Project highlights">
              {heroStats.map((stat, index) => (
                <StatusPill tone={index === 0 ? "green" : "amber"} key={stat}>
                  {stat}
                </StatusPill>
              ))}
            </div>
            <div className="home-splash__actions">
              <Button href="#mechatronics-system-cards" variant="primary">View system</Button>
            </div>
          </div>
          <div className="mechatronics-video-card" id="mechatronics-run">
            <video
              aria-label="Full course run video"
              autoPlay
              muted
              playsInline
              preload="auto"
              poster={galleryMedia[2].src}
              src={`${mediaBase}/video/Full%20Course%20Run%20-%20Video.mp4`}
            >
              <a href={`${mediaBase}/video/Full%20Course%20Run%20-%20Video.mp4`}>Download the full course run video</a>
            </video>
            <span>Full course run</span>
          </div>
        </Container>
      </section>

      <section id="mechatronics-system" className="section mechatronics-section" aria-labelledby="system-overview-title">
        <Container>
          <SectionLabel>System overview</SectionLabel>
          <div className="split-heading">
            <h2 id="system-overview-title" className="section-heading">
              The robot combined navigation, order detection, and mechanical tap actuation into one timed run.
            </h2>
            <p className="body-copy">
              The course rewarded reliability more than isolated subsystem performance. The robot had to stay on line,
              recognize the task, select the right tap, pull with enough force, avoid overfilling, and reset for the next action.
            </p>
          </div>
          <div id="mechatronics-system-cards" className="mechatronics-card-grid">
            {systemOverview.map((item) => {
              const Icon = item.icon;
              return (
                <DiagnosticCard className="mechatronics-card" key={item.title}>
                  <Icon size={20} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </DiagnosticCard>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="section mechatronics-section mechatronics-architecture" aria-labelledby="architecture-title">
        <Container>
          <SectionLabel>Engineering architecture</SectionLabel>
          <h2 id="architecture-title" className="section-heading">
            A C++ state machine turned sensor cues into repeatable physical actions.
          </h2>
          <div className="mechatronics-pipeline">
            {architectureSteps.map((step, index) => (
              <article className="mechatronics-pipeline__step" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
                <div className="inspection-card__tags">
                  {step.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section mechatronics-section" aria-labelledby="mechanism-title">
        <Container className="mechatronics-spotlight">
          <figure className="mechatronics-spotlight__media">
            <Image src={galleryMedia[2].src} alt={galleryMedia[2].alt} fill sizes="(max-width: 760px) 92vw, 48vw" />
          </figure>
          <div>
            <SectionLabel>Mechanism spotlight</SectionLabel>
            <h2 id="mechanism-title" className="section-heading">
              The tap-pull mechanism used servo torque, string tension, and spring return.
            </h2>
            <p className="body-copy">
              Fusion 360 was used to design the laser-cut frame and 3D-printed arm and claws. A high-torque
              60kg servo at the base pulled the top arm and beer tap through a string linkage, while springs
              pushed the top arm back when the servo returned to neutral.
            </p>
            <div className="mechatronics-callout">
              <Hammer size={19} aria-hidden="true" />
              <span>Mechanical reliability came from matching software timing to the arm’s physical return behavior.</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="section mechatronics-section" aria-labelledby="build-media-title">
        <Container>
          <SectionLabel>Build media</SectionLabel>
          <h2 id="build-media-title" className="section-heading">
            Real competition media shows the robot, mechanism, and final tap interaction.
          </h2>
          <div className="mechatronics-gallery">
            {galleryMedia.map((item) => (
              <figure className="mechatronics-gallery__item" key={item.src}>
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 760px) 92vw, 31vw" />
                <figcaption>{item.label}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section className="section mechatronics-section" aria-labelledby="reflection-title">
        <Container>
          <SectionLabel>Results and reflection</SectionLabel>
          <h2 id="reflection-title" className="section-heading">
            The win came from making the whole robot dependable, not from one isolated subsystem.
          </h2>
          <div className="field-notes">
            {reflections.map((item, index) => (
              <DiagnosticCard className="field-note" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")} · {item.title}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </DiagnosticCard>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
