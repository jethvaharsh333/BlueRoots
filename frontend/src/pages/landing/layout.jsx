import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-6 py-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-teal-100 sticky top-0 z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-700 bg-clip-text text-transparent">
          BlueRoots
        </h1>
        <Link to='/login'>
          <Button
            variant="outline" 
            className="border-teal-300 text-teal-700 hover:bg-teal-50 hover:border-teal-400 transition-all duration-300"
          >
            Login
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-teal-600 to-emerald-600 text-white py-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-white rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Empowering communities with{" "}
            <span className="text-yellow-300">AI</span> to protect{" "}
            <span className="text-cyan-200">blue carbon</span> ecosystems
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Together we can protect mangroves with AI + Community Power 🌱
          </p>
          <Button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105">
            Get Started
          </Button>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-4 text-gray-800">The Problem</h3>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Our precious mangrove ecosystems are under constant threat from human activities
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 border-2 border-red-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-b from-red-50 to-red-100">
              <div className="text-6xl mb-4">🌲</div>
              <h4 className="text-xl font-semibold text-red-800 mb-2">Illegal Cutting</h4>
              <p className="text-red-700">Unauthorized deforestation destroying vital ecosystems</p>
            </div>
            
            <div className="group p-8 border-2 border-orange-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-b from-orange-50 to-orange-100">
              <div className="text-6xl mb-4">🗑</div>
              <h4 className="text-xl font-semibold text-orange-800 mb-2">Waste Dumping</h4>
              <p className="text-orange-700">Pollution threatening marine biodiversity</p>
            </div>
            
            <div className="group p-8 border-2 border-amber-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-b from-amber-50 to-amber-100">
              <div className="text-6xl mb-4">🏗</div>
              <h4 className="text-xl font-semibold text-amber-800 mb-2">Land Reclamation</h4>
              <p className="text-amber-700">Development projects destroying wetlands</p>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl border border-blue-200">
            <p className="text-xl text-gray-800 font-medium">
              <span className="text-blue-600">🌊 Mangroves</span> = 
              <span className="text-teal-600 mx-2">Coastal Protection</span> + 
              <span className="text-green-600 ml-2">🌍 Carbon Storage</span>
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-teal-50 via-blue-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-8 text-gray-800">Our Solution</h3>
          
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-teal-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">👥</span>
                </div>
                <h4 className="font-semibold text-gray-800">Community Reports</h4>
                <p className="text-sm text-gray-600 mt-2">Citizens, NGOs & fishermen report activities</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🤖</span>
                </div>
                <h4 className="font-semibold text-gray-800">AI Validation</h4>
                <p className="text-sm text-gray-600 mt-2">Smart algorithms verify and prioritize reports</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-800">Government Action</h4>
                <p className="text-sm text-gray-600 mt-2">Real-time dashboard enables swift response</p>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Our community-powered AI monitoring system creates a seamless bridge between 
              grassroots environmental awareness and official conservation action, ensuring 
              rapid response to threats against our blue carbon ecosystems.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">Why Blue Carbon Matters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-4">🛡</div>
              <h4 className="text-xl font-semibold mb-2">Coastal Protection</h4>
              <p className="text-blue-100">Natural barriers against storms, floods, and erosion</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-4xl mb-4">💨</div>
              <h4 className="text-xl font-semibold mb-2">Carbon Storage</h4>
              <p className="text-blue-100">Store 3-10x more carbon per hectare than forests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-4">
              BlueRoots
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Together we can protect blue carbon ecosystems 🌍
            </p>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              © 2025 BlueRoots. Protecting our blue planet, one mangrove at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;