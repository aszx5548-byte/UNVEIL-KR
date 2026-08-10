import CollectionSection from './components/CollectionSection';
import DiscoveryCards from './components/DiscoveryCards';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import MeaningSection from './components/MeaningSection';
import ProductStatement from './components/ProductStatement';
import RecommendationPrinciple from './components/RecommendationPrinciple';
import TrustAndGift from './components/TrustAndGift';
import TrustStrip from './components/TrustStrip';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#discovery">
        본문으로 건너뛰기
      </a>

      <Header />

      <main>
        <Hero />
        <DiscoveryCards />
        <ProductStatement />
        <TrustStrip />
        <CollectionSection />
        <HowItWorks />
        <RecommendationPrinciple />
        <MeaningSection />
        <TrustAndGift />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
