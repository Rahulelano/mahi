import { AboutHeroInteractive } from '../components/AboutHeroInteractive';
import { OurStoryAnimated } from '../components/OurStoryAnimated';
import { ValuesSectionAnimated } from '../components/ValuesSectionAnimated';

export function AboutPage() {
  return (
    <main>
      {/* Interactive & Animated About Hero Section */}
      <AboutHeroInteractive />

      {/* Rich Interactive & Animated Our Story Showcase */}
      <OurStoryAnimated />

      {/* Animated What Matters To Us (Values Section) */}
      <ValuesSectionAnimated />
    </main>
  );
}
