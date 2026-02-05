import { Users, Target, Award, Heart, Mail, Phone, MapPin } from 'lucide-react'

function TeamMember({ name, role, description, avatar }) {
  return (
    <div className="rounded-2xl border border-slate-800 glass-effect p-6 text-center animate-fade-in">
      <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
        {avatar}
      </div>
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="text-sm text-blue-400 mb-3">{role}</p>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  )
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-blue-400" />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="mx-auto h-24 w-24 rounded-2xl school-gradient flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
          LF
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">About Campus Lost & Found</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Connecting students with their lost belongings through innovative technology and 
            community-driven solutions. Making campus life easier, one found item at a time.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 glass-effect p-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-8 w-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            To create a seamless, efficient, and user-friendly platform that reunites students 
            with their lost belongings while fostering a sense of community and mutual support 
            on campus. We believe that every lost item has a story and deserves to find its way home.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 glass-effect p-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            To become the leading lost and found solution for educational institutions nationwide, 
            setting the standard for how communities can come together to help one another. 
            We envision a world where losing something doesn't mean losing hope.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="rounded-2xl border border-slate-800 glass-effect p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Our Impact</h2>
        <div className="grid gap-8 md:grid-cols-4">
          <StatCard icon={Users} value="2,500+" label="Happy Students" />
          <StatCard icon={Award} value="1,200+" label="Items Returned" />
          <StatCard icon={Target} value="89%" label="Success Rate" />
          <StatCard icon={Heart} value="24/7" label="Service Available" />
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-2xl border border-slate-800 glass-effect p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center text-2xl font-bold text-blue-400">
              1
            </div>
            <h3 className="text-lg font-semibold text-white">Report Found Items</h3>
            <p className="text-slate-400">
              Found something? Quickly report it with photos and details. Our system makes it easy 
              to document and categorize items for quick identification.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center text-2xl font-bold text-purple-400">
              2
            </div>
            <h3 className="text-lg font-semibold text-white">Search & Claim</h3>
            <p className="text-slate-400">
              Lost something? Use our powerful search to find your item. Submit a claim with 
              verification details to prove ownership.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center text-2xl font-bold text-green-400">
              3
            </div>
            <h3 className="text-lg font-semibold text-white">Get Reunited</h3>
            <p className="text-slate-400">
              Our admin team verifies claims and coordinates the return. Get your belongings 
              back quickly and securely through our trusted process.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-2xl font-bold text-white text-center mb-8">Meet Our Team</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <TeamMember
            name="Sarah Johnson"
            role="Project Manager"
            description="Computer Science major passionate about creating solutions that help students."
            avatar="SJ"
          />
          <TeamMember
            name="Mike Chen"
            role="Lead Developer"
            description="Full-stack developer with expertise in React and modern web technologies."
            avatar="MC"
          />
          <TeamMember
            name="Emma Davis"
            role="UX Designer"
            description="Design student focused on creating intuitive and accessible user experiences."
            avatar="ED"
          />
          <TeamMember
            name="Alex Rodriguez"
            role="Community Manager"
            description="Business major dedicated to building strong campus community connections."
            avatar="AR"
          />
        </div>
      </div>

      {/* Values */}
      <div className="rounded-2xl border border-slate-800 glass-effect p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Community First</h3>
            <p className="text-slate-400">
              We believe in the power of community and helping fellow students succeed.
            </p>
          </div>
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Excellence</h3>
            <p className="text-slate-400">
              We strive for excellence in everything we do, from code quality to user experience.
            </p>
          </div>
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Empathy</h3>
            <p className="text-slate-400">
              We understand the stress of losing something important and work to provide hope.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-2xl border border-slate-800 glass-effect p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Get In Touch</h2>
        <div className="grid gap-6 md:grid-cols-3 text-center">
          <div className="space-y-3">
            <div className="mx-auto h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Email Us</h3>
            <p className="text-slate-400">support@campuslostandfound.edu</p>
          </div>
          <div className="space-y-3">
            <div className="mx-auto h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Phone className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Call Us</h3>
            <p className="text-slate-400">(555) 123-LOST</p>
          </div>
          <div className="space-y-3">
            <div className="mx-auto h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Visit Us</h3>
            <p className="text-slate-400">Student Services Building<br />Room 150</p>
          </div>
        </div>
      </div>
    </div>
  )
}