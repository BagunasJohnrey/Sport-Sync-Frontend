import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../mockData"; 
import { useAuth } from "../context/AuthContext";
import background from "../assets/background.png"; 
import logo from "../assets/logo.png"; 
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      setError("Invalid email or password.");
      return;
    }

    if (foundUser.status !== "Active") {
      setError("Your account is inactive.");
      return;
    }

    login(foundUser);


    localStorage.setItem("role", foundUser.role);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-10" style={{ backgroundImage: `url(${background})` }}>

      <div className="w-full max-w-md bg-softWhite flex flex-col items-center justify-center p-8 rounded-xl shadow-lg">
        <img src={logo} className="w-30 h-auto"/>
        <h1 className="text-2xl font-heading font-bold text-deepBlue text-center mb-6">
          Welcome to Sport Sync
        </h1>

        

        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slateGray mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full p-3 border border-lightGray rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slateGray mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full p-3 pr-10 border border-lightGray rounded-lg focus:outline-none focus:ring-2 focus:ring-deepBlue"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Eye Toggle */}
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slateGray"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-crimsonRed text-center mb-4 text-sm">{error}</p>
        )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-deepBlue text-softWhite py-3 rounded-lg font-button hover:bg-navyBlue transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
