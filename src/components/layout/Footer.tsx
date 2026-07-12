import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faFacebookF, faInstagram, faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { Mail, MessageSquareText, Link as LinkIcon } from 'lucide-react';

const contactDetails = {
  customerSupport: {
      phoneNumbers: ['+8801626985454', '+8801621518538', '+8801635814979'],
      email: 'wudowatches@gmail.com',
      whatsapp: '+8801304561370',
      telegram: '+8801304561370',
  },
  socialMedia: {
      facebook: 'https://www.facebook.com/share/16AYxJpL1d/?mibextid=wwXIfr',
      instagram: 'https://www.instagram.com/classymart2024?igsh=bXAyZm95Z2tramRo&utm_source=qr',
      tiktok: 'https://www.tiktok.com/@classymart3?_t=ZS-90oiQSAg4FJ&_r=1',
      whatsapp: 'https://wa.me/8801304561370',
      telegram: 'https://t.me/+8801304561370',
  },
};

/**
 * Main Site Footer Component
 * 
 * Purpose: Comprehensive navigation, trust-building, and information hub
 * 
 * Structure:
 * - 4-column grid (Brand, Shop, About, Support)
 * - Copyright section with payment methods
 */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border dark:bg-rich-black py-16 sm:py-24 pb-32">
      <div className="mx-auto max-w-7xl px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png?v=2"
                alt="Wudo Watches"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 font-sans text-sm text-foreground/60 hover:text-foreground">
              Redefining premium horology with curated timepiece collections for the contemporary enthusiast.
            </p>
            
            {/* Social Media Icons */}
            <div className="mt-6 flex gap-4">
              <Link
                href={contactDetails.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} strokeWidth={1.5} size="lg" />
              </Link>
              <Link
                href={contactDetails.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} strokeWidth={1.5} size="lg" />
              </Link>
              <Link
                href={contactDetails.socialMedia.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground"
                aria-label="TikTok"
              >
                <FontAwesomeIcon icon={faTiktok} strokeWidth={1.5} size="lg" />
              </Link>
              <Link
                href={contactDetails.socialMedia.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-green-500"
                aria-label="WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} strokeWidth={1.5} size="lg" />
              </Link>
              <Link
                href={contactDetails.socialMedia.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-blue-500"
                aria-label="Telegram"
              >
                <FontAwesomeIcon icon={faTelegram} strokeWidth={1.5} size="lg" />
              </Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/collections/automatic"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Automatic
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/quartz"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Quartz
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/chronograph"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Chronograph
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/diver"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Diver
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">
              About
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/story"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="font-sans text-sm text-foreground/60 hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
                {contactDetails.customerSupport.phoneNumbers.map((num, index) => (
                    <li key={index}>
                        <a href={`tel:${num}`} className="font-sans text-sm text-foreground/60 hover:text-foreground">
                            {num}
                        </a>
                    </li>
                ))}
                {/* WhatsApp & Telegram */}
                <li className="flex items-center space-x-2">
                    <Link
                        href={contactDetails.socialMedia.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:scale-110 transition-transform"
                        title="Chat on WhatsApp"
                    >
                        <FontAwesomeIcon icon={faWhatsapp} size="sm" />
                    </Link>
                    <Link
                        href={contactDetails.socialMedia.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:scale-110 transition-transform"
                        title="Chat on Telegram"
                    >
                        <FontAwesomeIcon icon={faTelegram} size="sm" />
                    </Link>
                    <span className="font-sans text-sm text-foreground/60">+8801304561370</span>
                </li>
                <li>
                    <a href={`mailto:${contactDetails.customerSupport.email}`} className="font-sans text-sm text-foreground/60 hover:text-foreground">
                        {contactDetails.customerSupport.email}
                    </a>
                </li>
            </ul>
          </div>
        </div>

        {/* Copyright, Payments, and Developer Info Section */}
        <hr className="mt-12 border-border" />

        {/* Copyright & Payments */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-sans text-sm text-muted-foreground">
            © {currentYear} Wudo Watches. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-muted-foreground">
              We Accept:
            </span>
            <div className="flex items-center gap-2 font-sans text-xs font-medium text-foreground">
              <div className="relative h-6 w-10">
                <Image src="/icons/bkash.png" alt="bKash" fill className="object-contain" />
              </div>
              <div className="relative h-6 w-10">
                <Image src="/icons/nagod.png" alt="Nagad" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* Developer Info */}
        <div className="border-t border-muted-gold/20 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>
            Designed & Developed by{' '}
            <a 
              href="https://www.linkedin.com/in/zayed-web-developer" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold hover:text-soft-white transition-colors"
            >
              Zayed Bin Hamid
            </a>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 md:mt-0 md:justify-end">
                          <a 
                            href="mailto:zayed.b.hamid@gmail.com" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-soft-white transition-colors flex items-center gap-2"
                          >              <Mail className="h-4 w-4" />
              zayed.b.hamid@gmail.com
            </a>
            <a 
              href="https://wa.me/8801977994057" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-soft-white transition-colors flex items-center gap-2"
            >
              <MessageSquareText className="h-4 w-4" />
              WhatsApp
            </a>
            <a 
              href="https://code-and-cortex.vercel.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-soft-white transition-colors flex items-center gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              Website
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}