import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, ExternalLink } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm mt-16">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl school-gradient text-sm font-bold text-white">
                LF
              </div>
              <div className="leading-tight">
                <div className="text-lg font-bold text-white">Campus Lost & Found</div>
                <div className="text-xs text-slate-400">Report and reclaim faster</div>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connecting students with their lost belongings through innovative technology and 
              community-driven solutions. Making campus life easier, one found item at a time.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="rounded-lg bg-slate-800/60 p-2 text-slate-400 hover:bg-slate-700/60 hover:text-white transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-slate-800/60 p-2 text-slate-400 hover:bg-slate-700/60 hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-slate-800/60 p-2 text-slate-400 hover:bg-slate-700/60 hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-slate-800/60 p-2 text-slate-400 hover:bg-slate-700/60 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <nav className="space-y-2">
              <Link to="/" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/items" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Browse Found Items
              </Link>
              <Link to="/report" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Report Found Item
              </Link>
              <Link to="/help" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Help & FAQ
              </Link>
              <Link to="/analytics" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Analytics
              </Link>
              <Link to="/reviews" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Reviews & Feedback
              </Link>
            </nav>
          </div>

          {/* About & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About & Legal</h3>
            <nav className="space-y-2">
              <Link to="/about" className="block text-sm text-slate-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Contact Support
              </Link>
              <Link to="/privacy" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-sm text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <a href="#" className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors">
                Accessibility
                <ExternalLink className="h-3 w-3" />
              </a>
              <a href="#" className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors">
                Campus Map
                <ExternalLink className="h-3 w-3" />
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-blue-400" />
                <a href="mailto:support@campuslostandfound.edu" className="hover:text-white transition-colors">
                  support@campuslostandfound.edu
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-4 w-4 text-green-400" />
                <a href="tel:+15551234567" className="hover:text-white transition-colors">
                  (555) 123-LOST
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-purple-400 mt-0.5" />
                <div>
                  <div>Student Services Building</div>
                  <div>Room 150, 1st Floor</div>
                  <div>University Campus</div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
              <div className="text-sm font-semibold text-white mb-2">Office Hours</div>
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Emergency</span>
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="grid gap-6 md:grid-cols-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">2,500+</div>
              <div className="text-sm text-slate-400">Happy Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1,200+</div>
              <div className="text-sm text-slate-400">Items Returned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">89%</div>
              <div className="text-sm text-slate-400">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-slate-400">Service Available</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>© {currentYear} Campus Lost & Found.</span>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span>for students.</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span>Powered by React & Vite</span>
              <span>•</span>
              <span>FBLA Web Development 2024</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">
                Status Page
              </a>
            </div>
          </div>
        </div>

        {/* University Affiliation */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="text-center">
            <div className="text-sm text-slate-500">
              An official service of University Student Services
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Compliant with FERPA, ADA, and university data protection policies
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}