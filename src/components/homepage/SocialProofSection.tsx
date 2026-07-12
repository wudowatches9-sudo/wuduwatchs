import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';

/**
 * Social Proof Section Component - Social Media Feed Integration
 * 
 * Purpose: Build trust and community by showcasing brand's social media presence
 * 
 * Mobile: 2-column grid
 * Desktop: 4-5 column grid with hover overlays showing Facebook, Instagram, TikTok icons
 */

interface SocialPost {
  id: string;
  image: string;
  postLink: string;
}

interface SocialProofSectionProps {
  socialPosts: SocialPost[];
}

export function SocialProofSection({ socialPosts }: SocialProofSectionProps) {
  return (
    <section className="bg-background px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        {/* Section Header */}
        <div className="flex flex-col items-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl mb-4 text-center">
            Join the Community
          </h2>
          <div className="flex space-x-4 mb-8">
            <a href="https://www.facebook.com/share/16AYxJpL1d/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-transform duration-300 hover:scale-110">
              <FontAwesomeIcon icon={faFacebookF} size="2x" />
            </a>
            <a href="https://www.instagram.com/classymart2024?igsh=bXAyZm95Z2tramRo&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-transform duration-300 hover:scale-110">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a href="https://www.tiktok.com/@classymart3?_t=ZS-90oiQSAg4FJ&_r=1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-transform duration-300 hover:scale-110">
              <FontAwesomeIcon icon={faTiktok} size="2x" />
            </a>
          </div>
        </div>

      {/* Social Media Grid */}
      <div className="mt-12 grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {socialPosts.map((post) => (
          <Link
            key={post.id}
            href={post.postLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            {/* Post Image */}
            <Image
              src={post.image}
              alt="Wudo Watches Social Media Post"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 20vw"
            />

            {/* Hover Overlay with Three Icons (Desktop-Only) */}
            <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <FontAwesomeIcon icon={faFacebookF} size="lg" className="text-muted-foreground hover:text-primary" />
              <FontAwesomeIcon icon={faInstagram} size="lg" className="text-muted-foreground hover:text-primary" />
              <FontAwesomeIcon icon={faTiktok} size="lg" className="text-muted-foreground hover:text-primary" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
