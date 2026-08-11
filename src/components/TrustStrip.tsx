import { TRUST_FEATURES, type TrustIcon } from '../data';
import { CameraIcon, CareIcon, GiftIcon, StoneIcon } from './icons';

function FeatureGlyph({ name }: { name: TrustIcon }) {
  if (name === 'stone') return <StoneIcon className="feature-icon" />;
  if (name === 'camera') return <CameraIcon className="feature-icon" />;
  if (name === 'care') return <CareIcon className="feature-icon" />;
  return <GiftIcon className="feature-icon" />;
}

export default function TrustStrip() {
  return (
    <section className="strip" aria-label="UNVEIL 품질 기준">
      <ul className="shell feature-row">
        {TRUST_FEATURES.map((feature) => (
          <li key={feature.title} className="feature">
            <FeatureGlyph name={feature.icon} />
            <div className="feature-body">
              <p className="feature-title">{feature.title}</p>
              <p className="feature-desc">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
