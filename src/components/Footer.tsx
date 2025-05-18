
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-white mt-auto">
      <Separator />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Poll Creator. All rights reserved.
          </p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">
              Home
            </Link>
            <Link to="/create" className="text-sm text-gray-500 hover:text-gray-900">
              Create Poll
            </Link>
            {/* Add more links as needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
