import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'

function ContactCard({ icon: Icon, title, details, color = 'blue' }) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    amber: 'text-amber-400 bg-amber-500/10'
  }

  return (
    <div className="rounded-2xl border border-slate-800 glass-effect p-6 text-center animate-fade-in">
      <div className={`mx-auto mb-4 h-16 w-16 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
        <Icon className={`h-8 w-8 ${colorClasses[color].split(' ')[0]}`} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <div className="text-slate-400 space-y-1">
        {details.map((detail, index) => (
          <div key={index}>{detail}</div>
        ))}
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitStatus('success')
    setIsSubmitting(false)
    
    // Reset form after success
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '', priority: 'normal' })
      setSubmitStatus(null)
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Contact Us</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Have questions, suggestions, or need help? We're here to assist you 24/7.
          Reach out to us through any of the methods below.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ContactCard
          icon={Mail}
          title="Email Support"
          details={[
            'support@campuslostandfound.edu',
            'Response within 2 hours',
            'Available 24/7'
          ]}
          color="blue"
        />
        <ContactCard
          icon={Phone}
          title="Phone Support"
          details={[
            '(555) 123-LOST',
            'Mon-Fri: 8AM-8PM',
            'Emergency: 24/7'
          ]}
          color="green"
        />
        <ContactCard
          icon={MapPin}
          title="Office Location"
          details={[
            'Student Services Building',
            'Room 150, 1st Floor',
            'Open Mon-Fri 9AM-5PM'
          ]}
          color="purple"
        />
        <ContactCard
          icon={Clock}
          title="Quick Response"
          details={[
            'Average response: 2.3 hours',
            'Urgent issues: 30 minutes',
            'Status updates via email'
          ]}
          color="amber"
        />
      </div>

      {/* Contact Form */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 glass-effect p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-green-400 font-semibold">Message sent successfully!</div>
                <div className="text-green-300 text-sm">We'll get back to you within 2 hours.</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="your.email@university.edu"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-3 text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="normal">Normal - Standard support</option>
                  <option value="high">High - Urgent issue</option>
                  <option value="critical">Critical - Emergency</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                placeholder="Please provide as much detail as possible about your inquiry or issue..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl school-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 glass-effect p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How long do you keep found items?</h3>
                <p className="text-slate-400">
                  We keep found items for 90 days. After this period, unclaimed items are donated 
                  to local charities or disposed of responsibly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How do I prove an item is mine?</h3>
                <p className="text-slate-400">
                  When claiming an item, you'll need to provide specific details that only the 
                  owner would know, such as contents, unique markings, or circumstances of loss.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can I report items found off-campus?</h3>
                <p className="text-slate-400">
                  Our service is primarily for on-campus items, but we accept reports for items 
                  found in nearby student housing or university-affiliated locations.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is there a fee for this service?</h3>
                <p className="text-slate-400">
                  No, our lost and found service is completely free for all students, faculty, 
                  and staff. It's funded by the university as a student service.
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="rounded-2xl border border-red-800/50 bg-red-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Emergency Contact</h3>
            </div>
            <p className="text-slate-300 mb-4">
              For urgent matters involving valuable items, personal safety, or security concerns:
            </p>
            <div className="space-y-2 text-slate-400">
              <div>📞 Emergency Hotline: (555) 911-HELP</div>
              <div>🚨 Campus Security: (555) 123-SAFE</div>
              <div>📧 Urgent Email: urgent@campuslostandfound.edu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Office Hours & Location */}
      <div className="rounded-2xl border border-slate-800 glass-effect p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Visit Our Office</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Office Hours</h3>
            <div className="space-y-3 text-slate-300">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
              <div className="pt-3 border-t border-slate-700">
                <div className="flex justify-between text-green-400">
                  <span>Emergency Support</span>
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Location Details</h3>
            <div className="space-y-3 text-slate-300">
              <div>📍 Student Services Building, Room 150</div>
              <div>🚗 Parking available in Lot B (free for visitors)</div>
              <div>🚌 Bus routes 12, 15, and 23 stop nearby</div>
              <div>♿ Fully accessible entrance and facilities</div>
              <div>🏢 Located on the first floor, near the main entrance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}