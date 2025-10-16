import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-[67px]">
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-200 leading-[1.221] mb-[35px]">Discover</h3>
            <ul className="space-y-[24px] text-brand-sage text-base font-bold leading-[1.221]">
              <li><a href="#" className="hover:text-white transition-colors">Become a Tasker</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Services By City</a></li>
              <li><a href="#" className="hover:text-white transition-colors">All Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Elite Taskers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-200 leading-[1.221] mb-[35px]">Company</h3>
            <ul className="space-y-[24px] text-brand-sage text-base font-bold leading-[1.221]">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partner with 100 Handy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors">100 Handy for Good</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies Settings</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-200 leading-[1.221] mb-[25px]">Download our app</h3>
            <p className="text-brand-sage text-base font-medium leading-[1.221] mb-4">
              Tackle your to-do list wherever you are with our mobile app.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-terracotta rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">100</span>
                </div>
                <span className="text-white text-sm font-bold">HANDY Task</span>
              </div>
              <div className="flex gap-2">
                <button className="bg-black text-white px-3 py-1 rounded text-xs">
                  Download on the App Store
                </button>
                <button className="bg-black text-white px-3 py-1 rounded text-xs">
                  GET IT ON Google Play
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-200 leading-[1.221] mb-[6px]">Follow us! We're friendly:</h3>
            <div className="flex gap-[10px] mt-[22px]">
              {/* Social Media Icons */}
              <a href="#" className="w-6 h-6 hover:opacity-80 transition-opacity">
                <Image 
                  src="/facebook-icon.svg" 
                  alt="Facebook" 
                  width={24} 
                  height={24}
                  className="w-full h-full"
                />
              </a>
              <a href="#" className="w-6 h-6 hover:opacity-80 transition-opacity">
                <Image 
                  src="/twitter-icon.svg" 
                  alt="Twitter" 
                  width={24} 
                  height={24}
                  className="w-full h-full"
                />
              </a>
              <a href="#" className="w-6 h-6 hover:opacity-80 transition-opacity">
                <Image 
                  src="/instagram-icon.svg" 
                  alt="Instagram" 
                  width={24} 
                  height={24}
                  className="w-full h-full"
                />
              </a>
              <a href="#" className="w-6 h-6 hover:opacity-80 transition-opacity">
                <Image 
                  src="/linkedin-icon.svg" 
                  alt="LinkedIn" 
                  width={24} 
                  height={24}
                  className="w-full h-full"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
