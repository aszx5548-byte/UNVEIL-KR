import { STEPS, type StepIcon } from '../data';
import { ChooseIcon, MeaningIcon, StepArrow, VerifyIcon } from './icons';

function StepGlyph({ name }: { name: StepIcon }) {
  if (name === 'choose') return <ChooseIcon className="step-icon" />;
  if (name === 'meaning') return <MeaningIcon className="step-icon" />;
  return <VerifyIcon className="step-icon" />;
}

export default function HowItWorks() {
  return (
    <section className="section how">
      <div className="shell">
        <h2 className="section-title center">원석을 먼저 고르지 않아도 됩니다.</h2>

        <ol className="step-row">
          {STEPS.map((step, index) => (
            <li key={step.title} className="step">
              <StepGlyph name={step.icon} />
              <p className="step-title">{step.title}</p>
              {index < STEPS.length - 1 ? <StepArrow className="step-arrow" /> : null}
            </li>
          ))}
        </ol>

        <p className="step-note">기준 선택 → 의미 확인 → 실물 확인</p>
      </div>
    </section>
  );
}
