import type { Metadata } from 'next';
import { Mail, MessageSquare, ArrowRight, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';

export const metadata: Metadata = {
  title: 'Contact Us | Wudo Watches',
  description: 'Our new contact center, physical outlets, and support channels are launching soon. Stay tuned for a brand-new customer service experience from Wudo Watches.',
  keywords: ['contact Wudo Watches', 'Wudo Watches outlets', 'customer support Bangladesh', 'coming soon'],
  openGraph: {
    title: 'Contact Us | Wudo Watches',
    description: 'Our new contact center, physical outlets, and support channels are launching soon.',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Contact Wudo Watches',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Wudo Watches',
    description: 'Our new contact center, physical outlets, and support channels are launching soon.',
    images: ['/logo.png'],
  },
};

export default function ContactPage() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground overflow-hidden px-4 py-16 md:py-24">
      {/* Background abstract ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-3xl w-full text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold tracking-wider uppercase text-primary mb-6 animate-pulse" id="status-badge">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Under Construction
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent" id="contact-main-heading">
          Our Contact Channels Are <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Launching Soon</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed" id="contact-description">
          We are currently designing a brand-new, premium support experience and setting up our flagship outlets to serve you better. We'll be live very soon.
        </p>

        {/* Channels / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left mb-12" id="info-cards-grid">
          {/* Quick Help Card */}
          <div className="p-6 rounded-2xl bg-card/45 border border-border backdrop-blur-md hover:border-primary/30 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Need Immediate Support?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is active on WhatsApp for urgent queries and orders.
            </p>
            <Link 
              href="https://wa.me/8801576645415" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
              id="whatsapp-support-link"
            >
              Chat on WhatsApp 
              <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Email Card */}
          <div className="p-6 rounded-2xl bg-card/45 border border-border backdrop-blur-md hover:border-emerald-500/30 transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
              <Mail size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Official Email</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send us your inquiries or business proposals anytime.
            </p>
            <a 
              href="mailto:wudowatches@gmail.com" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-500/80 transition-colors group/link"
              id="email-support-link"
            >
              wudowatches@gmail.com
              <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Social Proof / Outlets Preview */}
        <div className="border-t border-border/60 pt-10" id="social-links-section">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-6">
            Follow our progress and stay updated
          </p>
          <div className="flex justify-center items-center gap-6">
            <Link 
              href="https://www.facebook.com/share/16AYxJpL1d/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-full bg-card border border-border hover:border-primary/45 hover:text-primary transition-all hover:-translate-y-1 duration-300"
              title="Follow us on Facebook"
              id="social-fb"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.instagram.com/classymart2024?igsh=bXAyZm95Z2tramRo&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-full bg-card border border-border hover:border-primary/45 hover:text-primary transition-all hover:-translate-y-1 duration-300"
              title="Follow us on Instagram"
              id="social-ig"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.tiktok.com/@classymart3?_t=ZS-90oiQSAg4FJ&_r=1" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-full bg-card border border-border hover:border-primary/45 hover:text-primary transition-all hover:-translate-y-1 duration-300"
              title="Follow us on TikTok"
              id="social-tiktok"
            >
              <FontAwesomeIcon icon={faTiktok} className="h-5 w-5" />
            </Link>
            <Link 
              href="https://t.me/+8801576645415" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-full bg-card border border-border hover:border-primary/45 hover:text-primary transition-all hover:-translate-y-1 duration-300"
              title="Chat on Telegram"
              id="social-telegram"
            >
              <FontAwesomeIcon icon={faTelegram} className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

